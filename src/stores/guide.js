// pinia 사용 가이드입니다
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    guideToken: '',
    guideRefreshToken: '',
    expiresAt: 0,
  }),
  actions: {
    setTokens({ guideToken, guideRefreshToken, expiresAt }) {
      this.guideToken = guideToken
      this.guideRefreshToken = guideRefreshToken
      this.expiresAt = expiresAt
    },
  },

  // 🔹 여기서부터 로컬스토리지 설정
  persist: {
    storage: localStorage, // 기본은 localStorage
    // paths를 지정하면 이 필드만 저장
    paths: ['guideToken', 'expiresAt'],
  },
})
