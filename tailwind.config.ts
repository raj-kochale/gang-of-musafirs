import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          light: "#E8845A",
          DEFAULT: "#C05C3A",
          dark: "#9A3E22",
        },
        sage: {
          light: "#A8C5AB",
          DEFAULT: "#7A9E7E",
          dark: "#537A57",
        },
        sunset: {
          light: "#F9A97A",
          DEFAULT: "#F4845F",
          dark: "#D6613D",
        },
        brand: {
          bg: "#0E0E0E",
          surface: "#1A1A1A",
          card: "#222222",
          border: "#2E2E2E",
          text: "#F5F0EB",
          muted: "#9A9A9A",
        },
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0E0E0E 0%, #1A0E08 50%, #0E1A10 100%)",
        "card-gradient":
          "linear-gradient(180deg, transparent 0%, rgba(14,14,14,0.9) 100%)",
        "terracotta-gradient":
          "linear-gradient(135deg, #C05C3A 0%, #F4845F 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
