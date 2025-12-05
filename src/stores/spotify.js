import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSpotifyStore = defineStore('spotify', () => {
  const accessToken = ref(null)

  return { accessToken }
})
