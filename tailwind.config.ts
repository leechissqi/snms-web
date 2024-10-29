import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#143896",
        "primary-dark": "#0f2b6d",
        point: "#49CBFF",
        blue: { 400: "#2589FE", 500: "#0070F3", 600: "#2F6FEB" },
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: { shimmer: "shimmer 2s 1" },
      backgroundImage: {
        "gradient-shimmer":
          "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
export default config
