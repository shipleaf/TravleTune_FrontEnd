import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filter', {
  state: () => ({
    keyword: '',
    sido_code: null,
    gungu_code: null,
    content_type: 'all',
  }),
})
