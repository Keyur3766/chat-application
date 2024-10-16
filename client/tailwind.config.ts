import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#6b8afd",
        secondary: "#ffffff",
        custom: '#000000',
        dark: "#ffffff",
        danger: "#eb3330",
        success: "#4aac68",
      },
    },
  },
  plugins: [],
};
export default config;
