module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: 'plugin:node/recommended',
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    'node/no-unsupported-features/es-syntax': 0,
    'node/no-missing-import': [
      'error',
      {
        resolvePaths: ['./test']
      }
    ]
  }
}
