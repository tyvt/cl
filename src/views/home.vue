<template>
  <div v-for="category in categories"
    style="display: flex; align-items: center; justify-content: space-between;padding: 11px 14px;"
    @click="router.push(`/list?fid=${category.fid}&title=${category.text}&total=${category.count}`)">
    <span>
      <span style="letter-spacing: 2px;font-size: 16px;">{{ `${category.text}` }}</span>
      <span style="font-size: 14px;margin-left: 3px;">{{ `(${category.count})` }}</span>
    </span>
    <span style="font-size: 20px; color: #999;">›</span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useDBStore from '../store/db'
import { ref, onMounted } from 'vue'
let categories = ref([])

const router = useRouter()

onMounted(async () => {
  const db = await useDBStore.loadDB('cl-main')
  const contents = db.exec(`SELECT tc.name, tc.fid, tc.count FROM t_channel tc`)
  const list = []
  contents[0].values.forEach(e => {
    list.push({
      text: `${e[0]}`,
      count: e[2],
      fid: e[1],
    })
  })
  categories.value = list
})
</script>
