<template>
  <template v-if="!showSwiper">
    <div v-if="db" class="content" v-html="content"></div>
    <div style="position: absolute; right: 10px;bottom: 10%; border: 1px solid #000; border-radius: 4px;"
      @click="showSwiper = true">
      只看图
    </div>
  </template>
  <swiper v-else :slides-per-view="1" :modules="[Pagination]" :pagination="{
    type: 'custom',
    renderCustom: function (swiper, current, total) {
      return current + ' / ' + total
    }
  }" style="height: calc(100vh - 44px);">
    <swiper-slide v-for="img in imgList">
      <img style="width: 100%; height: 100%;" :src="img" />
    </swiper-slide>
  </swiper>
</template>

<script setup>
import loadDB from '../store/db'
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'

let content = ref()
const db = ref(null)
const url = useRoute().query.url
const title = useRoute().query.title
const date = useRoute().query.date

const imgList = ref([])
const showSwiper = ref(false)
onMounted(async () => {
  window.scrollTo(0, 0)
  const db_main = await loadDB('cl-main')
  const main_contents = db_main.exec(`SELECT tc.detail_size FROM t_channel tc WHERE fid = ${url.split('/')[2]}`)
  db.value = await loadDB(`cl-detail-${url.split('/')[2]}`, (currentSize) => {
    updateProgress(currentSize, main_contents[0].values[0][0], `cl-detail-${url.split('/')[2]}.sqlite`)
  })
  const contents = db.value.exec(`SELECT content FROM t_content tc WHERE url="${url}"`)
  contents[0].values.forEach(e => {
    content.value = `<h3>${title}</h3><span>${date}</span><br><br>${e[0]}`
    imgList.value = e[0].match(/(?<=<img.*?src=')(.*?)(?=')/g)
  })
})
</script>
