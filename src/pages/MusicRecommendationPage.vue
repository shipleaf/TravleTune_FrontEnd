<template>
  <section class="page">
    <MapContainer />
    <button @click="loginWithSpotify">Spotify로 로그인</button>
    <p v-if="accessToken">토큰 있음 ✅</p>
    <MusicPlayerContainer v-if="store.accessToken" />
  </section>
</template>

<script setup>
import MapContainer from '@/components/music/MapContainer.vue'
import MusicPlayerContainer from '@/components/music/MusicPlayerContainer.vue'
import { useSpotifyStore } from '@/stores/spotify'
import { storeToRefs } from 'pinia'

const store = useSpotifyStore()

const { accessToken } = storeToRefs(store)

function loginWithSpotify() {
  window.location.href = 'http://localhost:3001/login'
}
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
}
</style>
