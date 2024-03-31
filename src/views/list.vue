<template>
  <div v-for="(article, index) in data?.list" :key="article.url"
    @click="router.push(`/detail?url=${article.url}&title=${article.text}`)">
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

<script setup>
import useDBStore from '../store/db'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useInfiniteScroll } from 'vue-hooks-plus'

const db = ref(null)
await useDBStore.loadDB('cl-main').then(sqlite => {
  db.value = new SQL.Database(new Uint8Array(sqlite))
})
const PAGE_SIZE = 20
const { data, loadMore } = useInfiniteScroll(
  (d) => {
    const page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1
    return getLoadMoreList(page, PAGE_SIZE)
  },
)
const title = useRoute().query.title
const fid = useRoute().query.fid
const total = useRoute().query.total
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

function onReachBottom() {
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 20) {
    loadMore()
  }
}
onMounted(() => {
  window.addEventListener('scroll', () => onReachBottom())
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => onReachBottom())
})

</script>
