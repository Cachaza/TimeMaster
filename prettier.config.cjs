/** @type {import("prettier").Config} */
module.exports = {
  singleAttributePerLine: false,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};
