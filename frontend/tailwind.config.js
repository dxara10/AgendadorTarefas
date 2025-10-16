/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3F72AF',
        secondary: '#2E3A59',
        accent: '#4ECDC4',
        warning: '#FFB347',
        danger: '#E63946',
        gray: {
          50: '#F4F5F7',
          100: '#D0D3D8',
          900: '#2B2B2B',
        }
      }
    },
  },
  plugins: [],
}