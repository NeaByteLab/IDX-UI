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
  resolve: {
    alias: {
      '@app': path.resolve(dirName, 'src')
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
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('react-dom')) return 'react-dom'
          if (id.includes('react-router')) return 'react-router'
          if (id.includes('scheduler')) return 'scheduler'
          if (id.includes('react')) return 'react'
          if (id.includes('node_modules') || id.includes('.deno')) {
            const nodeModulesMatch = id.match(/node_modules[\\/](@[^/]+[\\/][^/]+|[^/]+)/)
            if (nodeModulesMatch) {
              const name = nodeModulesMatch[1]?.replace(/^@/, '').replace(/\//g, '-')
              if (name) return name
            }
            const denoPathMatch = id.match(
              /[\\/]\.deno[\\/](@[^/]+?\+[^/]+?|[^/]+?)(?:@[\d.]+|[\\/]|$)/
            )
            if (denoPathMatch) {
              const name = denoPathMatch[1]?.replace(/^@/, '').replace(/\+/g, '-')
              if (name) return name
            }
            return 'vendor'
          }
          return undefined
        }
      }
    }
  }
})
