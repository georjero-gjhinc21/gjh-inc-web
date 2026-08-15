"""Plain completion interface for loop tasks.

Text-classification work (grading, analysis) goes through here rather than
through a coding agent. No tools, no filesystem access — just prompt → text.
"""
from __future__ import annotations

import os

def completion(
    model: str,
    system: str,
    prompt: str,
    max_tokens: int = 4000,
    temperature: float = 0.0,
) -> str:
    """Plain HTTP completion via Anthropic SDK.

    No tool use, no code execution — pure text classification.
    Use this for grading, analysis, or any task that reads text and returns text/JSON.
    """
    try:
        from anthropic import Anthropic
    except ImportError:
        raise RuntimeError(
            "anthropic SDK not installed. Install with: pip install anthropic"
        )

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY not set. Export it or pass --dry-run for stub grader."
        )

    client = Anthropic(api_key=api_key)

    response = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )

    # Extract text from response
    text_parts = []
    for block in response.content:
        if hasattr(block, "text"):
            text_parts.append(block.text)

    return "".join(text_parts)
