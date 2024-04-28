import { defineConfig } from 'vite'
export default defineConfig(async ({ command, mode, ssrBuild }) => {
  return {
    base: mode == 'production' ? '/cl/' : './',
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
