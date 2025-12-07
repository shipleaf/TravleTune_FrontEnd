import axios from 'axios'
import { useTokenStore } from '@/stores/userTokenStore'

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosApi.interceptors.request.use(
  (config) => {
    const store = useTokenStore()
    const token = store.getUserAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default axiosApi
