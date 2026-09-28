/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          app: 'var(--surface-app)',
          card: 'var(--surface-card)',
          subtle: 'var(--surface-subtle)',
          hover: 'var(--surface-hover)',
          active: 'var(--surface-active)',
        },
        border: {
          default: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
          active: 'var(--border-active)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverted: 'var(--text-inverted)',
        },
        brand: {
          primary: 'var(--brand-primary)',
          primaryHover: 'var(--brand-primary-hover)',
          subtle: 'var(--brand-subtle)',
          border: 'var(--brand-border)',
        },
        status: {
          success: 'var(--color-success)',
          danger: 'var(--color-danger)',
          warning: 'var(--color-warning)',
          info: 'var(--color-info)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
