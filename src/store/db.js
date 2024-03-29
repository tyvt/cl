import { defineStore } from 'pinia'
import { reactive } from 'vue'
import version from '../static/version'
import { request } from '../utils/request'
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
          url: `https://unpkg.com/cl-lite@${version}/db/${DBName}.sqlite`,
          onProgress: onProgress
        }).then(arraybuffer => {
          DB[`${DBName}`] = arraybuffer
          resolve(DB[`${DBName}`])
        })
      }
    }).finally(() => {
      // uni.hideLoading()
    })
  }
  return { loadDB }
})

export default useDBStore()