import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
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
  const version = await execute('npm pkg get version')
  fs.writeFileSync('src/static/version.js', `export default ${version}`)
  return {
    base: './'
    plugins: [
      uni.default(),
    ],
  }
})
