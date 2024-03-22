<template>
  <navigator v-for="category in categories"
    :url="`/pages/list?fid=${category.fid}&text=${category.text}&total=${category.count}`">
    <div style="display: flex; align-items: center; justify-content: space-between;padding: 20rpx;">
      <span>
        <span style="letter-spacing: 4rpx;font-size: 30rpx;">{{ `${category.text}` }}</span>
        <span style="font-size: 26rpx;margin-left: 6rpx;">{{ `(${category.count})` }}</span>
      </span>
      <span style="font-size: 40rpx; color: #999;">›</span>
    </div>
  </navigator>
</template>

<script setup>
import useDBStore from '@/store/db'
import { ref } from 'vue'
let categories = ref([])

useDBStore.loadWASM().then((SQL) => {
  useDBStore.loadDB('cl-main').then(sqlite => {
    const db = new SQL.Database(new Uint8Array(sqlite.data))
    const contents = db.exec(`SELECT tc.name, tc.fid, tc.count FROM t_channel tc`)
    const list = []
    contents[0].values.forEach(e => {
      list.push({
        text: `${e[0]}`,
        count: e[2],
        fid: e[1]
      })
    })
    categories.value = list
  })
})
</script>