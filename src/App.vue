<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
const showBack = ref(false)
const router = useRouter()
const title = ref('cl-lite')
useRouter().beforeEach((to) => {
  showBack.value = to.name != 'home'
  title.value = to.query.title || 'cl-lite'
  document.title = title.value
})
</script>

<template>
  <header>
    <span v-show="showBack" class="back" @click="router.back()">{{ `<` }}</span>
        <span id="header">{{ title }}</span>
  </header>

  <router-view v-slot="{ Component }">
    <keep-alive include="list">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
