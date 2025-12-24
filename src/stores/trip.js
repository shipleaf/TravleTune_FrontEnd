import { defineStore } from 'pinia'

export const useTripStore = defineStore('trip', {
  state: () => ({
    selectedSido: null,
    selectedGungu: null,
    tripTitle: '',
    tripDescription: '',
    image_url: '',
    invitedUsers: [],
  }),
  actions: {
    reset() {
      this.selectedSido = null
      this.selectedGungu = null
      this.tripTitle = ''
      this.tripDescription = ''
      this.image_url = ''
      this.invitedUsers = []
    },
  },
})
