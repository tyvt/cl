<template>
  <div class="content" v-html="content"></div>
</template>

<script setup>
import useDBStore from '../store/db'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
let content = ref()
const url = useRoute().query.url
const title = useRoute().query.title
const date = useRoute().query.date
await useDBStore.loadDB(`cl-detail-${url.split('/')[2]}`).then(detail => {
  const detail_db = new SQL.Database(new Uint8Array(detail))
  const contents = detail_db.exec(`SELECT content FROM t_content tc WHERE url="${url}"`)
  contents[0].values.forEach(e => {
    content.value = `<h3>${title}</h3><span>${date}</span><br><br>${e[0]}`
  })
})

</script>
