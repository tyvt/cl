import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'
import { exec } from 'child_process'
import childProcess from 'child_process'
import fs from 'fs'
function execute(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, function (err, stdout, stderr) {
      if (err != null) {
        resolve(err)
      } else {
        resolve(stdout)
      }
    })
  })
}
export default defineConfig(async ({ command, mode, ssrBuild }) => {
  return {
    base: mode == 'production' ? '/cl/' : './',
    plugins: [
      vue(),
      viteCompression({
        threshold: 10240
      })
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
