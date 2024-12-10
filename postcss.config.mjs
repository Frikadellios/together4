/** @type {import('postcss-load-config').Config} */
const config = {
  autoprefixer: {},
  'postcss-import': {},
  'tailwindcss/nesting': 'postcss-nesting',
  tailwindcss: {},
  'postcss-preset-env': {
    features: { 'nesting-rules': false }
  }
}

export default config
