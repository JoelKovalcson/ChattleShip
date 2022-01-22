const tailwindcss = require("tailwindcss");

module.exports = {
  content: [
    "./views/*.handlebars/html",
    "./views/layouts/*.handlebars/html"
  //  "./public/*.html"
],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
