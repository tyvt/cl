<template>
  <uv-list>
    <uv-list-item v-for="category in categories" :title="category.text" link
      :to="`/pages/list/index?fid=${category.fid}`"></uv-list-item>
  </uv-list>
</template>

<script setup>
import { SQL_WASM } from '../../../constant'
import { ref } from 'vue'
let categories = ref([])
window.initSqlJs({
  locateFile: () => SQL_WASM,
}).then((SQL) => {
  uni.request({
    url: './package.json',
    success: (res) => {
      uni.request({
        url: `https://unpkg.com/cl-lite@${res.data.version}/db/cl-main.sqlite`,
        responseType: 'arraybuffer'
      }).then(sqlite => {
        const db = new SQL.Database(new Uint8Array(sqlite.data))
        const contents = db.exec(`SELECT tc.name, tc.fid, tc.count FROM t_channel tc`)
        const list = []
        contents[0].values.forEach(e => {
          list.push({
            text: `${e[0]}(${e[2]})`,
            fid: e[1]
          })
        })
        categories.value = list
      })
    }
  })
})
</script>

<style scoped></style>
