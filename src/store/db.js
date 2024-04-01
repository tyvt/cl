import { defineStore } from 'pinia'
import { reactive } from 'vue'
import version from '../static/version'
let base = `https://unpkg.com/cl-lite@${version}`
if (import.meta.env.MODE === 'development') {
  base = '.'
}
const useDBStore = defineStore('db', () => {
  const DB = reactive({})
  async function loadDB(DBName, onProgress) {
    return new Promise((resolve, reject) => {
      if (window[DBName]) {
        resolve(window[DBName])
      } else {
        request({
          url: `${base}/db/${DBName}.sqlite`,
          onProgress: onProgress
        }).then(arraybuffer => {
          const checkModule = () => {
            if (!window.SQL) {
              setTimeout(() => {
                checkModule()
              }, 100)
            } else {
              window[DBName] = new SQL.Database(new Uint8Array(arraybuffer))
              resolve(window[DBName])
            }
          }
          checkModule()
        })

      }
    })
  }
  return { loadDB }
})

export default useDBStore()