export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translate(-50%, 10px)" },
          "100%": { opacity: 1, transform: "translate(-50%, 0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
      },
    }
  },
  plugins: [],
};