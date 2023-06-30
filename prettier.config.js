module.exports = {
  bracketSpacing: true,
  tabWidth: 2,
  singleQuote: false,
  trailingComma: "es5",
  importSort: {
    ".ts": {
      style: "module",
    },
  },
  importOrder: ["^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
};
