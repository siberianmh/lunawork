import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function packageJSON() {
  return {
    name: 'rollup-plugin-package-json',
    generateBundle: async (_outputOptions) => {
      const inputFile = fs.readFileSync(
        path.resolve(__dirname, '..', 'package.json'),
        { encoding: 'utf-8' },
      )
      const inputObject = JSON.parse(inputFile)
      const outputPath = path.resolve(__dirname, '..', 'dist')

      console.log(outputPath)
      delete inputFile['devDependencies']
      const outputObject = {
        ...inputObject,
        main: 'index.js',
        types: 'index.d.ts',
      }

      fs.mkdirSync(outputPath, { recursive: true })

      return fs.writeFileSync(
        `${outputPath}/package.json`,
        JSON.stringify(outputObject, null, 2),
        { encoding: 'utf-8' },
      )
    },
  }
}

export function copyAssets() {
  return {
    name: 'rollup-plugin-copy-assets',
    generateBundle: async () => {
      const files = ['README.md', 'CHANGELOG.md']

      for (const file of files) {
        fs.copyFileSync(
          path.resolve(__dirname, `../${file}`),
          path.resolve(__dirname, `../dist/${file}`),
        )
      }

      return
    },
  }
}
