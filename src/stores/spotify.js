import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSpotifyStore = defineStore(
  'spotify',
  () => {
    const accessToken = ref(null)
    const clearToken = () => {
      accessToken.value = null
    }

    return { accessToken, clearToken }
  },
  {
    persist: {
      storage: localStorage,
      paths: ['accessToken'],
    },
  },
)
