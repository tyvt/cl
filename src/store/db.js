import { defineStore } from 'pinia'
import { reactive } from 'vue'
import version from '../static/version'
import { request } from '../utils/request'
let base = `https://unpkg.com/cl-lite@${version}`
if (import.meta.env.MODE === 'development') {
  base = '.'
}
const onProgress = (res) => {
  // console.log(res)
}
const useDBStore = defineStore('db', () => {
  const DB = reactive({})
  async function loadDB(DBName) {
    // uni.showLoading({
    //   title: '加载数据'
    // })
    return new Promise((resolve, reject) => {
      if (DB[`${DBName}`]) {
        resolve(DB[`${DBName}`])
      } else {
        request({
          url: `${base}/db/${DBName}.sqlite`,
          onProgress: onProgress
        }).then(arraybuffer => {
          DB[`${DBName}`] = arraybuffer
          const checkModule = () => {
            if (!window.SQL) {
              setTimeout(() => {
                checkModule()
              }, 100)
            } else {
              resolve(DB[`${DBName}`])
            }
          }
          checkModule()
        })

      }
    }).finally(() => {
      // uni.hideLoading()
    })
  }
  return { loadDB }
})

export default useDBStore()