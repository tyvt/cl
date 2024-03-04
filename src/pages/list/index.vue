<template>
  <uv-list>
    <uv-list-item v-for="article in articles" :title="article.text" :note="article.date" link
      :to="`/pages/detail/index?url=${article.url}`"></uv-list-item>
  </uv-list>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app"
import { SQL_WASM } from '../../../constant'
import { ref } from 'vue'
let articles = ref([])
onLoad((options) => {
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
          const contents = db.exec(`SELECT * FROM t_topic tp WHERE url like '%/' || ${options.fid} || '/%' AND post_time NOTNULL ORDER BY post_time DESC`)
          const list = []
          contents[0].values.forEach(e => {
            const date = new Date(Number(`${e[2]}000`))
            list.push({
              text: e[0],
              url: e[1],
              date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
            })
          })
          articles.value = list
        })
      }
    })
  })
})

</script>

<style scoped></style>
