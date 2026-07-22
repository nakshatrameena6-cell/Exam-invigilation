/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#059669',
        'primary-hover': '#047857',
        'secondary-bg': '#f0fdf4',
        'secondary-accent': '#10b981',
        olive: '#10b981',
        success: '#10b981',
        warning: '#f59e0b',
        hover: '#fbbf24',
        highlight: '#b45309',
        info: '#3b82f6',

        // Expanded Vibrant Palette for clear visual differentiation
        cyber: {
          emerald: '#10b981',
          gold: '#f59e0b',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          rose: '#f43f5e',
          indigo: '#6366f1',
          teal: '#14b8a6',
          amber: '#d97706',
          blue: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'ui-serif', 'serif'],
      },
      borderRadius: {
        xl: '0.85rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 12px 30px -4px rgba(0, 0, 0, 0.03)',
        glow: '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
        'dark-glass-gradient': 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.4))',
      },
    },
  },
  plugins: [],
};
