/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,pug}", "./public/js/**/*.{html,js,pug}"],
  theme: {
    extend: {
      colors:{
        // 'dark':"#222",
        dark:'#00150f',
        'dark-light':'#0b201a',
        'primary':'#228B22',
        'primary-light':'#50C878',
      },
    }
  },
  plugins: [],
}

