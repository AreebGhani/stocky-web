import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './helper/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custom': 'var(--bg-color)',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        myanmarKhyay: ['Myanmar Khyay', 'sans-serif'],
        moul: ['Moul', 'sans-serif'],
      },
      screens: {
        'sm': '550px',
        'md': '576px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
}
export default config
