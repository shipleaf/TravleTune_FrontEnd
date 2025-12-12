import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSiGunguStore = defineStore(
  'sigungu',
  () => {
    // state
    const currentSido = ref(null)
    const currentGungu = ref(null)

    // actions
    const setSido = (newSido) => {
      currentSido.value = newSido
    }
    const setGungu = (newGungu) => {
      currentGungu.value = newGungu
    }

    return { currentSido, currentGungu, setSido, setGungu }
  },
  { persist: true },
)
