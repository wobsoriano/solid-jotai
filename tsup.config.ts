import { defineConfig } from 'tsup-preset-solid'

export default defineConfig(
  [
    {
      entry: 'src/index.tsx',
      devEntry: true,
    },
    {
      entry: 'src/utils.tsx'
    },
  ],
  {
    cjs: true,
    dropConsole: true,
  }
)
