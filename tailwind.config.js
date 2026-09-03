/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        border: 'var(--color-border)',

        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-dim': 'var(--color-text-dim)',

        tomato: 'var(--color-tomato)',
        'tomato-dim': 'var(--color-tomato-dim)',
        cheese: 'var(--color-cheese)',
        'cheese-dim': 'var(--color-cheese-dim)',

        primary: 'var(--color-primary)',
        tertiary: 'var(--color-tertiary)',
        accent: 'var(--color-accent)',
        neutral: 'var(--color-neutral)',
        muted: 'var(--color-muted)',

        success: 'var(--color-success)',
        'success-bg': 'var(--color-success-bg)',
        danger: 'var(--color-danger)',
        'danger-bg': 'var(--color-danger-bg)',
        info: 'var(--color-info)',

        'slot-empty': 'var(--color-slot-empty)',
        'slot-fill': 'var(--color-slot-fill)',
        glow: 'var(--color-glow)',
        ground: 'var(--color-ground)',
        'accent-soft': 'var(--color-accent-soft)',
        'cheese-bg': 'var(--color-cheese-bg)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        label: 'var(--font-label)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
      },
      // `touch:` = no hover pointer (phones, tablets). One predicate for every
      // "say tap instead of drag" decision.
      screens: {
        touch: { raw: '(hover: none)' },
      },
      maxWidth: {
        // Mobile column width (single source for every screen's narrow layout).
        game: '28rem',
        // Desktop shell width: the split-screen Workshop/Progress and the app
        // chrome (header, bottom nav) all share this at `lg`+.
        desktop: '72rem',
        // Desktop reading column for game screens — comfortable, never so wide
        // that a game's narrow-column design stretches.
        read: '34rem',
      },
    },
  },
  plugins: [],
}
