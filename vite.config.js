import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'
import { resolve } from 'path'

export default defineConfig({
  publicDir: 'public',
  plugins: [ vue(), cssInjectedByJs() ],
  server: {
    // Open the dev‐only index.html
    open: '/index.html'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'EcomWidget',
      fileName: () => 'widget.min.js',
      formats: ['iife']
    },
    minify: 'esbuild' // or 'terser'
  }
})
