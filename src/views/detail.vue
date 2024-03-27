<template>
  <div class="content" v-html="content"></div>
</template>

<script setup>
import useDBStore from '../store/db'
import { ref } from 'vue'
let content = ref()
const url = new URLSearchParams(location.search).get('url')
await useDBStore.loadWASM().then(async (SQL) => {
  await useDBStore.loadDB('cl-main').then(sqlite => {
    const db = new SQL.Database(new Uint8Array(sqlite))
    const title = db.exec(`SELECT name FROM t_topic tp WHERE url="${url}"`)[0].values[0]
    const post_time = db.exec(`SELECT post_time FROM t_topic tp WHERE url="${url}"`)[0].values[0]
    const date = new Date(Number(`${post_time}000`))
    useDBStore.loadDB(`cl-detail-${url.split('/')[2]}`).then(detail => {
      const detail_db = new SQL.Database(new Uint8Array(detail))
      const contents = detail_db.exec(`SELECT content FROM t_content tc WHERE url="${url}"`)
      contents[0].values.forEach(e => {
        content.value = `<h3>${title}</h3><span>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</span><br><br>${e[0]}`
      })
    })
  })
})

</script>
