import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF90B3",
          hover: "#FF7BA6",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1A1523",
          hover: "#2A2433",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FFD4E1",
          foreground: "#1A1523",
        },
        love: {
          50: "#FFF1F5",
          100: "#FFE4EC",
          200: "#FFD4E1",
          300: "#FFB8CF",
          400: "#FF90B3",
          500: "#FF6B97",
          600: "#FF477C",
          700: "#FF1A53",
          800: "#1A1F2C",
          900: "#221F26",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
