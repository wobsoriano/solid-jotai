import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'

export default defineConfig({
  plugins: [solidPlugin({
    babel: {
      plugins: [jotaiDebugLabel],
    },
  })],
  build: {
    target: 'esnext',
  },
})
