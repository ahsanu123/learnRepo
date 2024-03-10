/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      "dracula",
    ],
  },
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#243c5a',
      },
    }
  },
  plugins: [require("daisyui")],
}

