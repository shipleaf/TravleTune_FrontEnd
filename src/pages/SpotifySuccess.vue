<template>
  <p>로그인 처리 중...</p>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSpotifyStore } from '@/stores/spotify'

const store = useSpotifyStore()
const router = useRouter()

onMounted(() => {
  const url = new URL(window.location.href)
  if (url.pathname === '/spotify-success') {
    const token = url.searchParams.get('access_token')
    if (token) {
      store.accessToken = token
      // 필요하면 localStorage 등에 저장
    }
  }

  router.push('/music')
})
</script>

<style lang="scss" scoped></style>
