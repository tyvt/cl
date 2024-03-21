<template>
  <uv-list ref="domRef" class="list">
    <uv-list-item v-for="article in data?.list" :title="article.text" :note="article.date" link
      :to="`/pages/detail?url=${article.url}&title=${title}`"></uv-list-item>
  </uv-list>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app"
import useDBStore from '@/store/db'
import { ref } from 'vue'
import { useInfiniteScroll } from 'vue-hooks-plus'
const domRef = ref()
const title = ref('')
const PAGE_SIZE = 10
const { data, loadMore } = useInfiniteScroll(
  (d) => {
    const page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1
    return getLoadMoreList(page, PAGE_SIZE)
  },
  {
    target: domRef,
    isNoMore: d => {
      return d?.list?.length == count.value
    },
  },
)
const db = ref(null)
const fid = ref('')
const count = ref('')
async function getLoadMoreList(page, pageSize) {
  return new Promise((resolve, reject) => {
    const list = []
    const contents = db.value.exec(`SELECT * FROM t_topic tp WHERE url like '%/' || ${fid.value} || '/%' AND post_time NOTNULL ORDER BY post_time DESC LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`)
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
      total: count.value,
    })
  })
}
onLoad((options) => {
  if (options.text) {
    title.value = options.text
    uni.setNavigationBarTitle({
      title: decodeURIComponent(options.text)
    })
  }
  fid.value = options.fid
  count.value = options.total

  useDBStore.loadWASM().then((SQL) => {
    useDBStore.loadDB('cl-main').then(sqlite => {
      db.value = new SQL.Database(new Uint8Array(sqlite.data))
      loadMore()
    })
  })
})


</script>

<style scoped>
.list {
  height: 100%;
  overflow-y: auto;
}
</style>
