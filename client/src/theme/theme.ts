/**
 * Penalty Management Cloud — Unified Design System & Theme Tokens
 * No hardcoded colors. Everything is bound to semantic tokens.
 */

export const themeTokens = {
  surfaces: {
    app: 'bg-[var(--surface-app)]',
    card: 'bg-[var(--surface-card)]',
    subtle: 'bg-[var(--surface-subtle)]',
    hover: 'hover:bg-[var(--surface-hover)]',
    active: 'bg-[var(--surface-active)]',
  },
  borders: {
    default: 'border-[var(--border-default)]',
    subtle: 'border-[var(--border-subtle)]',
    active: 'border-[var(--border-active)]',
  },
  typography: {
    primary: 'text-[var(--text-primary)]',
    secondary: 'text-[var(--text-secondary)]',
    muted: 'text-[var(--text-muted)]',
    inverted: 'text-[var(--text-inverted)]',
  },
  brand: {
    primary: 'bg-[var(--brand-primary)] text-white',
    primaryHover: 'hover:bg-[var(--brand-primary-hover)]',
    subtle: 'bg-[var(--brand-subtle)] text-[var(--brand-primary)] border-[var(--brand-border)]',
  },
  status: {
    compliant: {
      badge: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--badge-success-border)]',
      dot: 'bg-[var(--color-success)]',
    },
    infraction: {
      badge: 'bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] border-[var(--badge-danger-border)]',
      dot: 'bg-[var(--color-danger)]',
    },
    pending: {
      badge: 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-[var(--badge-warning-border)]',
      dot: 'bg-[var(--color-warning)]',
    },
    info: {
      badge: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] border-[var(--badge-info-border)]',
      dot: 'bg-[var(--color-info)]',
    },
  },
} as const;

export type ThemeTokens = typeof themeTokens;
