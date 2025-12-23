import { defineStore } from 'pinia'

export const useTripSelectionStore = defineStore('tripSelection', {
  state: () => ({
    selectedItineraryId: null,
    selectedFrom: null,
    selectedPlace: null, // ✅ 추가 (지도에서 바로 쓸 수 있게)
  }),
  actions: {
    select(placeOrId, from) {
      if (typeof placeOrId === 'object' && placeOrId) {
        this.selectedItineraryId = placeOrId.itinerary_id
        this.selectedPlace = placeOrId
      } else {
        this.selectedItineraryId = placeOrId
        this.selectedPlace = null
      }
      this.selectedFrom = from
    },
    clear() {
      this.selectedItineraryId = null
      this.selectedFrom = null
      this.selectedPlace = null
    },
  },
})
