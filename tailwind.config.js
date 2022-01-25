const tailwindcss = require("tailwindcss");

module.exports = {
  content: [
    // "./views/*.handlebars/html",
    "./views/*.{html,js,handlebars}",
   './views/**/*.{html,js,handlebars}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
