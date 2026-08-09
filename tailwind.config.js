/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "rgb(var(--color-bg) / <alpha-value>)",
          panel: "rgb(var(--color-panel) / <alpha-value>)",
          chrome: "rgb(var(--color-chrome) / <alpha-value>)",
          ink: "rgb(var(--color-ink) / <alpha-value>)",
          text: "rgb(var(--color-text) / <alpha-value>)",
          soft: "rgb(var(--color-soft) / <alpha-value>)",
          faint: "rgb(var(--color-faint) / <alpha-value>)",
          primary: "rgb(var(--color-primary) / <alpha-value>)",
          primaryDark: "rgb(var(--color-primary-dark) / <alpha-value>)",
          success: "rgb(var(--color-success) / <alpha-value>)",
          danger: "rgb(var(--color-danger) / <alpha-value>)",
          warning: "rgb(var(--color-warning) / <alpha-value>)",
          code: "rgb(var(--color-code) / <alpha-value>)"
        }
      },
      boxShadow: {
        panel: "0 1px 2px rgba(23,27,36,0.04), 0 8px 24px -12px rgba(23,27,36,0.18)",
        glow: "0 0 0 4px rgba(79,95,224,0.16)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        serif: ["Georgia", "ui-serif", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Cascadia Code", "Consolas", "monospace"]
      }
    }
  },
  plugins: [],
};
