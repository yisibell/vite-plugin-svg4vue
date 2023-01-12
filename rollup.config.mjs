import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: 'src/index.ts',
    external: ['@vue/compiler-sfc'],
    plugins: [
      commonjs(),
      typescript(), // so Rollup can convert TypeScript to JavaScript
    ],
    output: [
      {
        file: 'lib/index.cjs.js',
        format: 'cjs',
      },
      {
        file: 'lib/index.esm.js',
        format: 'es',
      },
    ],
  },
  {
    input: './types/index.d.ts',
    output: [{ file: 'lib/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]
