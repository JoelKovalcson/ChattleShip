const tailwindcss = require("tailwindcss");

module.exports = {
  content: [
   './views/**/*.handlebars',
   './public/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
