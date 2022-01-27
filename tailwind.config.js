const tailwindcss = require("tailwindcss");

module.exports = {
  content: [
   './views/**/*.handlebars'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
