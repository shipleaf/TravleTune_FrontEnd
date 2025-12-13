import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSpotStore = defineStore('spot', () => {
  // variable
  const selectedSpot = ref(null)

  // actions
  const setSelectedSpot = (newSpot) => {
    selectedSpot.value = newSpot
  }

  const deleteSelectedSpot = () => {
    selectedSpot.value = null
  }

  return { selectedSpot, setSelectedSpot, deleteSelectedSpot }
})
