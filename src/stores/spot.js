import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSpotStore = defineStore('spot', () => {
  // variable
  const selectedSpot = ref(null)
  const selectedPlayerSpot = ref(null)
  const spots = ref([])

  // actions
  const setSelectedSpot = (newSpot) => {
    console.log('설정할 스팟', newSpot)
    selectedSpot.value = newSpot
    console.log('설정된 스팟', selectedSpot.value)
  }

  const deleteSelectedSpot = () => {
    selectedSpot.value = null
  }

  const setSpots = (list) => {
    spots.value = Array.isArray(list) ? list : []
  }

  return { selectedSpot, setSelectedSpot, deleteSelectedSpot, selectedPlayerSpot, spots, setSpots }
})
