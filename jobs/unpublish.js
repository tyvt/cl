import childProcess from 'child_process'
function execute(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, function (err, stdout, stderr) {
      console.log('err: ', err)
      if (err != null) {
        resolve(err)
      } else {
        console.log('stdout: ', stdout)
        resolve(stdout)
      }
    })
  })
}

const versions = await execute('npm view cl-lite versions')

const list = versions.match(/(?<=')(\d\.\d\.\d\d\d)(?=')/g).slice(0, -1)
for await (const iterator of list) {
  await execute(`npm unpublish cl-lite@${iterator} --force`)
}