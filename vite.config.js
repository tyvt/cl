import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { exec } from 'child_process'
import childProcess from 'child_process'
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
  const version = await execute('npm pkg get version')
  const base = `https://unpkg.com/cl-lite@${version.replace(/\n/, '').replace(/"/g, '')}/dist/build/h5/`

  console.log('base: ', base)
  return {
    base: base,
    plugins: [
      uni.default(),
    ],
  }
})
