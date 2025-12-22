import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToolStore = defineStore('tool', () => {
  const isReady = ref(false)

  return { isReady }
})
