import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSpotStore = defineStore('spot', () => {
  // variable
  const selectedSpot = ref(null)

  // actions
  const setSelectedSpot = (newSpot) => {
    console.log('설정할 스팟', newSpot)
    selectedSpot.value = newSpot
    console.log('설정된 스팟', selectedSpot.value)
  }

  const deleteSelectedSpot = () => {
    selectedSpot.value = null
  }

  return { selectedSpot, setSelectedSpot, deleteSelectedSpot }
})
