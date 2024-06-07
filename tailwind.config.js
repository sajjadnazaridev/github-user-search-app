/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.html", "./src/**/*.js", "./styles/**/*.css"],
  theme: {
    extend: {
      colors: {
        colorDarkBackground: '#111729',
        colorDarkPrimary: '#20293A',
        colorDarkSecondary: '#1D1B48',
        colorLightSecondary: '#CDD5E0',
        colorLightBackground: '#ffff',
        colorPrimaryAccent: '#3662E3',
        colorDarkOverlay: '#364153',
        colorLightOverlay: '#4A5567',

      },
      fontFamily: {
        BeVietnamPro: ["Be Vietnam Pro", "sans-serif"],
      },
    },
    screens: {
      sm: "640px",
      md: "1024px",
      lg: "1280px",
    },
  },
  plugins: [],
}
