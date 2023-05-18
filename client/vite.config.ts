/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    deps: {
      inline: ["fudge-lib"]
    },
    watch: false,
    threads: false
  }
})

//npx vite-bundle-visualizer