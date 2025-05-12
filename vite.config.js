import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'
import { resolve } from 'path'

export default defineConfig({
  publicDir: 'public',
  plugins: [
    vue(),
    cssInjectedByJs()
  ],
  server: {
    open: '/index.html'
  },
  define: {
    'process.env': {}
  },
  preview: {
    open: '/preview.html'
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
    minify: 'esbuild'
  }
})
