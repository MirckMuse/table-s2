import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'S2Table',
      fileName: 'S2Table'
    }
  }
})
