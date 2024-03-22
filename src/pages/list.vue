<template>
  <navigator v-for="article in data?.list" :url="`/pages/detail?url=${article.url}&title=${title}`">
    <div style="display: flex; align-items: center; justify-content: space-between;padding: 20rpx;">
      <span style="display: flex; flex-direction: column; flex: 1;">
        <span style="font-size: 28rpx;">{{ article.text }}</span>
        <span style="font-size: 24rpx;margin-top: 10rpx; color: #999;">{{ article.date }}</span>
      </span>
      <span
        style="display: flex; align-items: center; justify-content: center; font-size: 40rpx; color: #999;min-width: 30rpx;">›</span>
    </div>
  </navigator>
</template>

<script setup>
import { onLoad, onReachBottom } from "@dcloudio/uni-app"
import useDBStore from '@/store/db'
import { ref, onMounted } from 'vue'
import { useInfiniteScroll } from 'vue-hooks-plus'
const title = ref('')
const PAGE_SIZE = 20
const { data, loadMore } = useInfiniteScroll(
  (d) => {
    const page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1
    return getLoadMoreList(page, PAGE_SIZE)
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

onReachBottom(() => {
  loadMore()
})

</script>
