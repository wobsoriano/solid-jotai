import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

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
