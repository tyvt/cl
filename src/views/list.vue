<template>
  <template v-if="db">
    <div v-for="(article, index) in data?.list" :key="article.url"
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
    <progress :max="total_size" :value="current_size">{{ percent }}%</progress>
  </div>
</template>

<script setup>
import useDBStore from '../store/db'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useInfiniteScroll } from 'vue-hooks-plus'
import { filesize } from 'filesize'
const db = ref(null)
const title = useRoute().query.title
const fid = useRoute().query.fid
const total = useRoute().query.total
const PAGE_SIZE = 20
const total_size = ref(0)
const current_size = ref(0)
const percent = computed(() => {
  return (current_size.value / total_size.value * 100).toFixed(2)
})
const router = useRouter()
function getLoadMoreList(page, pageSize) {
  return new Promise((resolve, reject) => {
    const list = []
    const contents = db.value.exec(`SELECT * FROM t_topic tp WHERE url like '%/' || ${fid} || '/%' AND post_time NOTNULL ORDER BY post_time DESC LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`)
    contents[0].values.forEach(e => {
      const date = new Date(Number(`${e[2]}000`))
      list.push({
        text: e[0],
        url: e[1],
        date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
      })
    })
    resolve({
      list,
      total: total,
    })
  })
}
const { data, loadMore } = useInfiniteScroll(
  (d) => {
    const page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1
    return getLoadMoreList(page, PAGE_SIZE)
  },
)
function onReachBottom() {
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 20) {
    loadMore()
  }
}
onMounted(async () => {
  const db_main = await useDBStore.loadDB('cl-main')
  const contents = db_main.exec(`SELECT tc.category_size FROM t_channel tc WHERE fid = ${fid}`)
  total_size.value = contents[0].values[0][0]
  db.value = await useDBStore.loadDB(`cl-category-${fid}`, (res) => {
    current_size.value = res
  })
  loadMore()
  window.addEventListener('scroll', () => onReachBottom())
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => onReachBottom())
})

</script>
