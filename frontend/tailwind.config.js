/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#07070f",
          secondary: "#0e0e1a",
          card: "#13131f",
          hover: "#1a1a2e",
        },
        purple: {
          DEFAULT: "#6c63ff",
          light: "#9b94ff",
          dark: "#4a42d0",
        },
        cyan: "#00d4ff",
        pink: "#ff6584",
        green: "#43e97b",
        orange: "#ff9a3c",
      },
      borderRadius: {
        'md': '14px',
        'lg': '20px',
        'xl': '28px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px rgba(108,99,255,0.15)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
}
