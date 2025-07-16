import type { Config } from "tailwindcss";

export default {
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
        primary: {
          yellow: '#F8E71C',
          'yellow-hover': '#FFD700',
        },
        dark: {
          bg: '#0D0D0D',
          card: '#1A1A1A',
          text: '#E0E0E0',
          border: '#333',
        }
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 255, 0, 0.3)',
      }
    },
  },
  plugins: [],
} satisfies Config;