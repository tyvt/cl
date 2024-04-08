<template>
  <template v-if="db">
    <div v-for="(article, index) in list" :key="article.url"
      @click="router.push(`/detail?date=${article.date}&title=${article.text}&url=${article.url}`)">
      <div style="display: flex; align-items: center; justify-content: space-between;padding: 10px 12px;">
        <span style="display: flex; flex-direction: column; flex: 1;">
          <span style="font-size: 14px;">{{ article.text }}</span>
          <span style="font-size: 12px;margin-top: 6px; color: #999;">{{ article.date }}</span>
        </span>
        <span
          style="display: flex; align-items: center; justify-content: center; font-size: 20px; color: #999;min-width: 16px;">›</span>
      </div>
    </div>
  </template>
  <div v-else
    style="width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <div>{{ `${filesize(current_size)} / ${filesize(total_size)}` }}</div>
    <progress :max="total_size" :value="current_size"></progress>
  </div>
</template>

<script setup>
import loadDB from '../store/db'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, computed, onActivated } from 'vue'
import useLoadMore from '../hooks/useLoadMore'
import { filesize } from 'filesize'
const db = ref(null)
const title = ref(useRoute().query.title)
const fid = ref(useRoute().query.fid)
const total = ref(useRoute().query.total)
const PAGE_SIZE = 20
const total_size = ref(0)
const current_size = ref(0)
const percent = computed(() => {
  return (current_size.value / total_size.value * 100).toFixed(2)
})
const router = useRouter()
async function getList() {
  const [pageParams] = arguments
  return new Promise((resolve, reject) => {
    const list = []
    const contents = db.value.exec(`SELECT * FROM t_topic tp WHERE url like '%/' || ${fid.value} || '/%' AND post_time NOTNULL ORDER BY post_time DESC LIMIT ${pageParams.pageSize} OFFSET ${(pageParams.pageNum - 1) * pageParams.pageSize}`)
    contents[0].values.forEach(e => {
      const date = new Date(Number(`${e[2]}000`))
      list.push({
        text: e[0],
        url: e[1],
        date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
      })
    })
    resolve({
      rows: list,
      total: total.value,
    })
  })
}
const { list, loadMore, reload } = useLoadMore(getList)
function onReachBottom() {
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 20) {
    loadMore()
  }
}
async function loadCurrentDB() {
  const db_main = await loadDB('cl-main')
  const contents = db_main.exec(`SELECT tc.category_size FROM t_channel tc WHERE fid = ${fid.value}`)
  total_size.value = contents[0].values[0][0]
  db.value = await loadDB(`cl-category-${fid.value}`, (res) => {
    current_size.value = res
  })
}
onActivated(async () => {
  if (fid.value !== useRoute().query.fid) {
    title.value = useRoute().query.title
    fid.value = useRoute().query.fid
    total.value = useRoute().query.total
    await loadCurrentDB()
    reload()
  }
})
onMounted(async () => {
  await loadCurrentDB()
  loadMore()
  window.addEventListener('scroll', () => onReachBottom())
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => onReachBottom())
})

</script>
