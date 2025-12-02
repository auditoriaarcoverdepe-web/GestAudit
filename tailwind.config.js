/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-escuro': '#1E3A8A',
        'azul-claro': '#3B82F6',
        'cinza-claro': '#F3F4F6',
        'verde-status': '#10B981',
        'vermelho-status': '#EF4444',
        'amarelo-status': '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}