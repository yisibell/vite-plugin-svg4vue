import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import fs from 'node:fs'

const pkgjson = fs.readFileSync('./package.json', 'utf-8')
const pkg = JSON.parse(pkgjson)
const external = [
  /^node:/,
  'vue/compiler-sfc',
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]

export default [
  {
    input: 'src/index.ts',
    external,
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
    external,
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
]
