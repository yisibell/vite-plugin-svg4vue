import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import format from 'eslint-plugin-format'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  eslintConfigPrettier,
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
          printWidth: 100,
          endOfLine: 'auto',
        },
      ],
    },
  },
  {
    files: ['**/*.vue'],
    plugins: {
      format,
    },
    rules: {
      'format/prettier': [
        'error',
        {
          parser: 'vue',
          semi: false,
          singleQuote: true,
          printWidth: 100,
          endOfLine: 'auto',
        },
      ],
    },
  },
)
