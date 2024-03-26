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
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<style scoped>
header {
  height: 44px;
  width: 100%;
  background-color: #0F7884;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
}

.back {
  position: absolute;
  left: 0;
  padding: 9px 14px;
  font-size: 20px;
}
</style>
