/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'translink-blue': '#0072CE',
        'ferry-orange': '#FF6B00',
        'charcoal': '#2D3436',
        'cream': '#FDF5E6',
        'golden': '#F5B800',
      },
    },
  },
  plugins: [],
}
