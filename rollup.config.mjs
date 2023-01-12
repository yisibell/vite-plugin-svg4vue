import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import pkg from './package.json' assert { type: 'json' }

export default [
  {
    input: 'src/index.ts',
    external: Object.keys(pkg.dependencies),
    plugins: [
      commonjs(),
      typescript(), // so Rollup can convert TypeScript to JavaScript
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
  },
  {
    input: './types/index.d.ts',
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
]
