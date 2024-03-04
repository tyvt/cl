<template>
  <uv-parse :content="content"></uv-parse>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app"
import { SQL_WASM } from '../../../constant'
import { ref } from 'vue'
let content = ref()
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
          const title = db.exec(`SELECT name FROM t_topic tp WHERE url="${options.url}"`)[0].values[0]
          const post_time = db.exec(`SELECT post_time FROM t_topic tp WHERE url="${options.url}"`)[0].values[0]
          const date = new Date(Number(`${post_time}000`))
          uni.request({
            url: `https://unpkg.com/cl-lite@${res.data.version}/db/cl-detail-${options.url.split('/')[2]}.sqlite`,
            responseType: 'arraybuffer'
          }).then(detail => {
            const detail_db = new SQL.Database(new Uint8Array(detail.data))
            const contents = detail_db.exec(`SELECT content FROM t_content tc WHERE url="${options.url}"`)
            contents[0].values.forEach(e => {
              content.value = `<h3>${title}</h3><span>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</span><br><br>${e[0]}`
            })
          })
        })
      }
    })
  })
})

</script>

<style scoped></style>
