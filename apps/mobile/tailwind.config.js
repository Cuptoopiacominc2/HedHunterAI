/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg:      "#060d1a",
        surface: "#0d1729",
        border:  "rgba(255,255,255,0.1)",
        primary: "#5b8def",
        accent:  "#3ce8ff",
        muted:   "#7e8aa3",
        text:    "#f3eee4",
        subtle:  "#c7cfdf",
      },
    },
  },
};
