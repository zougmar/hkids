/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          500: '#64748b',
          700: '#334155',
          900: '#0f172a',
        },
        accent: {
          coral: '#ff6b4a',
          sun: '#f5b942',
          leaf: '#34b87a',
          sky: '#3b82f6',
          ink: '#1e293b',
        },
        primary: {
          blue: '#0891b2',
          green: '#34b87a',
          orange: '#ff6b4a',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(15, 23, 42, 0.18)',
        lift: '0 18px 50px -16px rgba(8, 145, 178, 0.35)',
      },
      backgroundImage: {
        mesh:
          'radial-gradient(at 12% 18%, rgba(34, 211, 238, 0.28) 0px, transparent 45%), radial-gradient(at 88% 12%, rgba(255, 107, 74, 0.18) 0px, transparent 42%), radial-gradient(at 70% 88%, rgba(52, 184, 122, 0.16) 0px, transparent 40%), radial-gradient(at 18% 78%, rgba(59, 130, 246, 0.14) 0px, transparent 38%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s ease-out both',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
