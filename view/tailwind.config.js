/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
    "./src/**/*.{astro,js,ts,jsx,tsx}",
    "./src/**/*.{md,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

