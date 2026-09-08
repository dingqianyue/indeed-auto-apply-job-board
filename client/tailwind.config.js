/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB', // Light gray background
        primary: '#0F172A', // Dark text color for headings
        secondary: '#64748B', // Muted text color
        accent: '#2563EB', // Blue accent color for match score/badges
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming Inter is used based on design aesthetics
      }
    },
  },
  plugins: [],
}
