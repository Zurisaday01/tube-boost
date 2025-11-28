module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'docs', 'update']],
    'type-case': [2, 'always', 'lower-case']
  }
};
