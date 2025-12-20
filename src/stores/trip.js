import { defineStore } from 'pinia'

export const useTripStore = defineStore('trip', {
  state: () => ({
    selectedSido: null,
    selectedGungu: null,
    tripTitle: '',
    tripDescription: '',
    invitedUsers: [],
  }),
  actions: {
    reset() {
      this.selectedSido = null
      this.selectedGungu = null
      this.tripTitle = ''
      this.tripDescription = ''
      this.invitedUsers = []
    },
  },
})
