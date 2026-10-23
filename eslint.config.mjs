// @ts-check

import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import format from 'eslint-plugin-format'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintConfigPrettier,
  {
    ignores: ['lib', 'example'],
  },
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    plugins: {
      format,
    },
    rules: {
      'format/prettier': [
        'error',
        {
          parser: 'typescript',
          semi: false,
          singleQuote: true,
          endOfLine: 'lf',
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-explicit-any': 0,
    },
  },
)
