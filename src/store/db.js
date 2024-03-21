import { defineStore } from 'pinia'
import { SQL_WASM } from '../../constant'
import { ref, reactive } from 'vue'
import version from '../static/version'

const useDBStore = defineStore('db', () => {
  const WASM = ref(null)
  const DB = reactive({})
  async function loadWASM() {
    uni.showLoading({
      title: '加载数据库依赖'
    })
    return new Promise((resolve, reject) => {
      if (WASM.value) {
        resolve(WASM.value)
      } else {
        window.initSqlJs({
          locateFile: () => SQL_WASM,
        }).then(sql => {
          WASM.value = sql
          resolve(WASM.value)
        })
      }
    }).finally(() => {
      uni.hideLoading()
    })
  }
  async function loadDB(DBName) {
    uni.showLoading({
      title: '加载数据'
    })
    return new Promise((resolve, reject) => {
      if (DB[`${DBName}`]) {
        resolve(DB[`${DBName}`])
      } else {
        uni.request({
          url: `https://unpkg.com/cl-lite@${version}/db/${DBName}.sqlite`,
          responseType: 'arraybuffer'
        }).then(db => {
          DB[`${DBName}`] = db
          resolve(DB[`${DBName}`])
        })
      }
    }).finally(() => {
      uni.hideLoading()
    })
  }
  return { loadWASM, loadDB }
})

export default useDBStore()