import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore('token', () => {
  const userAccessToken = ref(null)

  const getUserAccessToken = () => {
    return userAccessToken
  }

  const setUserAccessToken = (newUserToken) => {
    userAccessToken.value = newUserToken
  }

  const deleteAccessToken = () => {
    userAccessToken.value = null
  }

  return { userAccessToken, getUserAccessToken, setUserAccessToken, deleteAccessToken }
})
