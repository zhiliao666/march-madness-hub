/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ncaa-blue': '#003087',
        'ncaa-orange': '#F5811E',
        'bracket-bg': '#f5f5f5',
      },
    },
  },
  plugins: [],
}
