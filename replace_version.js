import { exec } from 'child_process'
import fs from 'fs'
exec('npm pkg get version', (_, stdout) => {
  const html = fs.readFileSync('./index.html', 'utf-8').replace(/(?<=<title>).*?(?=<\/title>)/, stdout.replace(/\n/, '').replace(/"/g, ''))
  fs.writeFileSync('./index.html', html)
})