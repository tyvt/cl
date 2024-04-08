<template>
  <div v-if="db" class="content" v-html="content"></div>
  <div v-else
    style="width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <div>{{ `${filesize(current_size)} / ${filesize(total_size)}` }}</div>
    <progress :max="total_size" :value="current_size"></progress>
  </div>
</template>

<script setup>
import loadDB from '../store/db'
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { filesize } from 'filesize'
let content = ref()
const db = ref(null)
const url = useRoute().query.url
const title = useRoute().query.title
const date = useRoute().query.date

const total_size = ref(0)
const current_size = ref(0)
const percent = computed(() => {
  return (current_size.value / total_size.value * 100).toFixed(2)
})
onMounted(async () => {
  window.scrollTo(0, 0)
  const db_main = await loadDB('cl-main')
  const main_contents = db_main.exec(`SELECT tc.detail_size FROM t_channel tc WHERE fid = ${url.split('/')[2]}`)
  total_size.value = main_contents[0].values[0][0]
  db.value = await loadDB(`cl-detail-${url.split('/')[2]}`, (res) => {
    current_size.value = res
  })
  const contents = db.value.exec(`SELECT content FROM t_content tc WHERE url="${url}"`)
  contents[0].values.forEach(e => {
    content.value = `<h3>${title}</h3><span>${date}</span><br><br>${e[0]}`
  })
})
</script>
