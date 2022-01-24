const tailwindcss = require("tailwindcss");

module.exports = {
  content: [
    // "./views/*.handlebars/html",
  //   "./layouts/*.{js,html}",
   './views/**/*.{html,js,handlebars}'
],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
