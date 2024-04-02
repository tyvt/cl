import { exec } from 'child_process'
import fs from 'fs'
exec('npm pkg get version', (_, stdout) => {
  const version = stdout.replace(/\n/, '').replace(/"/g, '')
  const html = fs.readFileSync('./dist/index.html', 'utf-8').replace(/(?<=<script\stype=\"module\"\scrossorigin\ssrc=\")(.*?)(?=\/assets\/index.js"><\/script>)/, `https://unpkg.com/cl-lite@${version}/dist`)
  console.log('html: ', html)
  fs.writeFileSync('./dist/index.html', html)
})