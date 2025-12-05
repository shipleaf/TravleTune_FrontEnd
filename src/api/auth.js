import axiosApi from './httpClient'

// 로그인 api
export const login = (credentials) => axiosApi.post('/auth/login', credentials)

// 회원가입 api
export const signup = (payload) => axiosApi.post('/auth/signup', payload)
