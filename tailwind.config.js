/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-raised': 'var(--color-bg-raised)',
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
        crust: 'var(--color-crust)',
        basil: 'var(--color-basil)',

        success: 'var(--color-success)',
        'success-bg': 'var(--color-success-bg)',
        danger: 'var(--color-danger)',
        'danger-bg': 'var(--color-danger-bg)',
        info: 'var(--color-info)',

        metal: 'var(--color-metal)',
        'metal-dim': 'var(--color-metal-dim)',
        'slot-empty': 'var(--color-slot-empty)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
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
      maxWidth: {
        game: '28rem',
      },
    },
  },
  plugins: [],
}
