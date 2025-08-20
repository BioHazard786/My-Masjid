/** @type {import('tailwindcss').Config} */

import { platformSelect } from "nativewind/theme";

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins"],
      },
      colors: {
        // CSS variables for dynamic theming
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        background: "var(--color-background)",
        card: "var(--color-card)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        "accent-background": "var(--color-accent-background)",
        surface: "var(--color-surface)",
      },
    },
  },
  plugins: [],
};
