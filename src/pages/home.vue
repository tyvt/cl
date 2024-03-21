<template>
  <uv-list>
    <uv-list-item v-for="category in categories" :title="`${category.text}(${category.count})`" link
      :to="`/pages/list?fid=${category.fid}&text=${category.text}&total=${category.count}`"></uv-list-item>
  </uv-list>
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

<style scoped></style>
