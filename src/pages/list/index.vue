<template>
  <uv-list>
    <uv-list-item v-for="article in list" :title="article.text" :note="article.date" link
      :to="`/pages/detail/index?url=${article.url}`"></uv-list-item>
    <uv-load-more :status="status" />
  </uv-list>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app"
import useLoadMore from '../../utils/useLoadMore'
import { SQL_WASM } from '../../../constant'
import { ref } from 'vue'
import version from '@/static/version'
const { list, total, status, refresh } = useLoadMore(getList)
async function getList() {
  const [pageParams] = arguments
  return new Promise((resolve, reject) => {
    resolve({
      rows: articles.value.slice(pageParams.page, pageParams.pageSize),
      total: articles.value.length
    })
  })
}
let articles = ref([])
onLoad((options) => {
  if (options.text) {
    uni.setNavigationBarTitle({
      title: decodeURIComponent(options.text)
    })
  }
  window.initSqlJs({
    locateFile: () => SQL_WASM,
  }).then((SQL) => {
    uni.request({
      url: `https://unpkg.com/cl-lite@${version}/db/cl-main.sqlite`,
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
  })
})

</script>

<style scoped></style>
