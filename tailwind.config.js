const tailwindcss = require("tailwindcss");

module.exports = {
  content: ["./views/**/*.html/js", "./public/*.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
