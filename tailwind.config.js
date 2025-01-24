/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    fontFamily: {
      outfit: ["Outfit", "sans-serif"],
    },
    colors: {
      "pastel-pink": "#FFD1DC",
      "pastel-yellow": "#FFF5BA",
      "pastel-blue": "#BDE0FE",
    },

    keyframes: {
      pulseColors: {
        "0%": { backgroundColor: "#FFD1DC" }, // pastel pink
        "33%": { backgroundColor: "#BDE0FE" }, // pastel blue
        "66%": { backgroundColor: "#FFF5BA" }, 
        "100%": { backgroundColor: "#FFD1DC" }, 
      },
    },
    animation: {
      pulseColors: "pulseColors 6s infinite", 
    },
    colors: {
      pastel: {
        pink: "#FFD1DC",
        yellow: "#FFF5BA",
        blue: "#BDE0FE",
      },
    },
  },
  },
  plugins: [],
}

