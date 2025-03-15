import antfu from '@antfu/eslint-config'

export default antfu({
  solid: true,
}, {
  // keep this or tests will fail
  files: ['test/**/*.{ts,tsx}'],
  rules: {
    'style/jsx-one-expression-per-line': 'off',
    'style/multiline-ternary': 'off',
  },
})
