import axiosApi from './axiosApi'

// 로그인 api
export const login = (credentials) => {
  axiosApi({
    url: '/member/login',
    method: 'post',
    data: credentials,
    withCredentials: true,
  })
}

// 회원가입 api
export const signup = (payload) => {
  axiosApi({
    url: '/member/signup',
    method: 'post',
    data: payload,
  })
}

