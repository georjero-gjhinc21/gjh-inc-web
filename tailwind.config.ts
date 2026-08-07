import type { Config } from "tailwindcss";

/**
 * GJH Inc. design tokens.
 * See docs/DESIGN.md for the rationale behind every value here.
 * Two surfaces only: `paper` (what we say) and `ink` (what we ship).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#FBFBF9", raised: "#F4F3EF", sunk: "#EDEBE5" },
        ink: { DEFAULT: "#14142B", raised: "#1E1E3A", muted: "#8A8AA8" },
        indigo: { DEFAULT: "#4338CA", lift: "#6366F1", wash: "#EEF0FE", deep: "#312E81" },
        signal: "#10B981",
        rule: { DEFAULT: "#E2E1DA", strong: "#CBC9C0" },
        muted: "#6B6A63",
      },
      fontFamily: {
        display: ["var(--font-display)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Fluid display scale — no jumps between breakpoints.
        d1: ["clamp(2.5rem, 1.4rem + 4.4vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        d2: ["clamp(2rem, 1.3rem + 2.6vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        d3: ["clamp(1.5rem, 1.2rem + 1.2vw, 2.125rem)", { lineHeight: "1.16", letterSpacing: "-0.015em" }],
        lede: ["clamp(1.0625rem, 1rem + 0.4vw, 1.3125rem)", { lineHeight: "1.55" }],
        label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.14em" }],
      },
      borderRadius: { DEFAULT: "4px", card: "10px", chip: "3px" },
      maxWidth: { measure: "38rem", frame: "76rem", wide: "88rem" },
      spacing: { band: "clamp(4rem, 8vw, 7.5rem)" },
      keyframes: {
        "trace-in": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
        blip: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.35" } },
      },
      animation: { "trace-in": "trace-in .45s cubic-bezier(.2,.7,.3,1) both", blip: "blip 2.4s ease-in-out infinite" },
    },
  },
  plugins: [],
};

export default config;
