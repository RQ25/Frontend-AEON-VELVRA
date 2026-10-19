import type { Config } from "tailwindcss";


export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {

      fontFamily : {
        'press-start': ['"Press Start 2P"', 'cursive'],
        'quintessential': ['"Quintessential"', 'serif'],
        'orbitron': ['"Orbitron"', 'serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
      },
      backgroundImage: {
        'login': "url(/image/login.jpg)"
      }
    },
  },
  plugins: [],
} satisfies Config;
