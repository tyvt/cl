import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
export default defineConfig(async ({ command, mode, ssrBuild }) => {
  const lifecycle = process.env.npm_lifecycle_event
  return {
    base: mode == 'production' ? '/cl/' : './',
    plugins: [
      vue(),
      lifecycle === 'report'
        ? visualizer({
          gzipSize: true,
          emitFile: true
        })
        : null,
    ],
    build: {
      target: 'esnext',
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            return 'index'
          },
          entryFileNames: `assets/[name].js`,
        }
      }
    }
  }
})
