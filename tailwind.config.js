/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        blush: {
          50: '#fff5f7',
          100: '#ffe0e6',
          200: '#ffc0cc',
          300: '#ff8fa3',
          400: '#ff5c78',
          500: '#ff2d55',
          600: '#e0002a',
        },
        warm: {
          900: '#1a0a0d',
          800: '#2d1217',
          700: '#3d1820',
          600: '#5c2233',
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'glow-ping': 'glow-ping 1s ease-out 3',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'heartbeat': 'heartbeat 0.8s ease-in-out',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'glow-ping': {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 45, 85, 0.7)' },
          '100%': { boxShadow: '0 0 0 30px rgba(255, 45, 85, 0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.3)' },
          '60%': { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
}
