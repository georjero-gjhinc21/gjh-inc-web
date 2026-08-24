#!/usr/bin/env python3
"""Model gateway for the content loop.

Every model call in the loop goes through this module so that:
  - the default route is the free headless opencode CLI (no API key, works in CI),
  - optional paid/provider routes are litellm-backed and activate only when their
    API-key env var is present,
  - the first route that returns wins; if none does, the call fails closed
    rather than silently degrading the grading.

Config lives in loop/config.yaml:

  models:
    grader:     opencode/muse-spark-1.2-contributor-free   # the CLI route (free)
    improver:   opencode/muse-spark-1.2-contributor-free
    researcher: opencode/muse-spark-1.2-contributor-free

  litellm_fallbacks:          # optional, tried in order after the CLI route
    - openai/gpt-4o-mini
    - anthropic/claude-3-5-haiku-latest

A model id with the `opencode/` prefix is the headless CLI. Any other prefix is
a litellm route (provider/model) and requires its API key env var.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys

OPENCODE_PREFIX = "opencode/"


class ModelError(RuntimeError):
    """Raised when every configured route fails to produce output."""


def _extract_opencode_text(raw: str) -> str:
    """Pull every assistant text block out of `opencode run --format json` output."""
    parts = []
    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue  # stray non-JSON log line — skip
        if ev.get("type") == "text":
            parts.append(ev.get("part", {}).get("text", ""))
    return "\n".join(parts).strip()


def _call_opencode(model: str, system: str, prompt: str, max_tokens: int = 4000) -> str:
    cmd = [
        "opencode", "run",
        "-m", model,
        "--format", "json",
        "--pure",                # no external plugins in CI
        "--auto",                # don't block on permission prompts, headless
        f"{system}\n\n{prompt}",
    ]
    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=600,
            env={**os.environ,
                 "OPENCODE_DISABLE_PROJECT_CONFIG": "1",
                 "CI": "1"},
        )
    except FileNotFoundError as exc:
        raise ModelError("opencode CLI is not installed (needs `npm i -g opencode-ai`)") from exc
    if proc.returncode != 0:
        raise ModelError(f"opencode run failed ({proc.returncode}): {proc.stderr[-400:]}")
    text = _extract_opencode_text(proc.stdout)
    if not text:
        raise ModelError("opencode returned no assistant text")
    return text


def _call_litellm(model: str, system: str, prompt: str, max_tokens: int = 4000) -> str:
    """Route a call through litellm. `model` is `provider/model` (e.g. openai/gpt-4o-mini)."""
    try:
        import litellm
    except ImportError as exc:
        raise ModelError("litellm is not installed (pip install -r loop/requirements.txt)") from exc

    resp = litellm.completion(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        max_tokens=max_tokens,
    )
    try:
        text = resp["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError) as exc:
        raise ModelError(f"litellm returned an unreadable response: {type(exc).__name__}") from exc
    if not text:
        raise ModelError("litellm returned empty content")
    return text


def _normalise_model(model: str) -> str:
    """Coerce deprecated aliases into the current free route."""
    if "/" in model and not model.startswith(OPENCODE_PREFIX):
        return model  # provider/model — a litellm route
    base = model.removeprefix(OPENCODE_PREFIX)
    # deepseek-v4-flash-free was removed 2026-08 (opencode UnknownError); map to current free model
    for alias in ("deepseek", "deepseek-v4", "deepseek-v4-flash-free", "deepseek-v4-flash"):
        if base == alias:
            return f"{OPENCODE_PREFIX}muse-spark-1.2-contributor-free"
    return model


def call_model(
    role: str,
    system: str,
    prompt: str,
    cfg: dict,
    max_tokens: int = 4000,
) -> str:
    """Try the role's routes in order; first success wins; fail closed otherwise.

    `role` must be a key of `cfg["models"]`. The primary (`opencode/…`) route is
    always tried first since it needs no API key. Then any configured litellm
    fallback whose key is present in the environment.
    """
    models = cfg.get("models", {})
    if role not in models:
        raise ModelError(f"no model configured for role '{role}'")

    primary = _normalise_model(models[role])
    candidates = [primary]
    for fallback in cfg.get("litellm_fallbacks") or []:
        if fallback not in candidates:
            candidates.append(fallback)

    errors = []
    for model in candidates:
        try:
            if model.startswith(OPENCODE_PREFIX):
                return _call_opencode(model, system, prompt, max_tokens)
            # litellm route — require its key before spending anything
            provider = model.split("/", 1)[0].upper()
            key_env = {
                "OPENAI": "OPENAI_API_KEY",
                "ANTHROPIC": "ANTHROPIC_API_KEY",
                "GOOGLE": "GOOGLE_API_KEY",
                "GEMINI": "GOOGLE_API_KEY",
                "DEEPSEEK": "DEEPSEEK_API_KEY",
                "AZURE": "AZURE_API_KEY",
                "GROQ": "GROQ_API_KEY",
            }.get(provider)
            if key_env and not os.environ.get(key_env):
                errors.append(f"{model}: {key_env} not set")
                continue
            return _call_litellm(model, system, prompt, max_tokens)
        except ModelError as exc:
            errors.append(f"{model}: {exc}")
            print(f"  route {model} failed — {exc}", file=sys.stderr)
        except Exception as exc:  # noqa: BLE001 — a flaky route must not kill the loop
            errors.append(f"{model}: {type(exc).__name__}: {exc}")
            print(f"  route {model} threw — {type(exc).__name__}: {exc}", file=sys.stderr)

    raise ModelError("all model routes failed: " + " | ".join(errors))