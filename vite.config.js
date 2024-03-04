import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
let version
exec('npm pkg get version', (_, stdout) => {
  version = stdout.replace(/\n/, '').replace(/"/g, '')
})
export default defineConfig({
  base: `https://unpkg.com/cl-lite@${version}`,
  plugins: [
    uni.default(),
  ],
})
