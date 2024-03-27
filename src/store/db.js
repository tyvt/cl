import { defineStore } from 'pinia'
import { reactive } from 'vue'
import version from '../static/version'

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
        fetch(`https://unpkg.com/cl-lite@${version}/db/${DBName}.sqlite`, {
          method: 'get',
          responseType: 'arraybuffer'
        }).then(res => {
          return res.arrayBuffer()
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