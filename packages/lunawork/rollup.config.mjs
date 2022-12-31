import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import { packageJSON, copyAssets } from './tools/rollup-plugin.mjs'

export default [
  {
    input: 'src/index.ts',
    plugins: [esbuild(), packageJSON(), copyAssets()],
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
  },
]
