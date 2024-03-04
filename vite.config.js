import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { exec } from 'child_process'

export default defineConfig(async ({ command, mode, ssrBuild }) => {
  let version
  exec('npm pkg get version', (_, stdout) => {
    version = stdout.replace(/\n/, '').replace(/"/g, '')
  })
  return {
    base: `https://unpkg.com/cl-lite@${version}`,
    plugins: [
      uni.default(),
    ],
  }

})
