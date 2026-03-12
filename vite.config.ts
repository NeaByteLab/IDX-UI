import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

/** Current project directory path */
const dirName = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vite configuration.
 * @description Setup plugins and path aliases.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 50260,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:50270',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 50260
  },
  resolve: {
    alias: {
      '@app': path.resolve(dirName, 'src'),
      '@data': path.resolve(dirName, 'data')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]'
    }
  },
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000
  }
})
