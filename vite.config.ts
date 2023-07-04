import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'S2Table',
      fileName: 'S2Table'
    }
  },
  server: {
    port: 3001
  }
})
