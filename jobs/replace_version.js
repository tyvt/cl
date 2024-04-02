import { exec } from 'child_process'
import fs from 'fs'
exec('npm pkg get version', (_, stdout) => {
  const version = stdout.replace(/\n/, '').replace(/"/g, '')
  const html = fs.readFileSync('./index.html', 'utf-8').replace(/(?<=<title>).*?(?=<\/title>)/, version).replace(/(?<=<script\stype=\"module\"\scrossorigin\ssrc=\")(.*?)(?=\/assets\/index.js"><\/script>)/, `https://unpkg.com/cl-lite@${version}/dist`)
  fs.writeFileSync('./index.html', html)
  fs.writeFileSync('src/static/version.js', `export default "${version}"`)
})