import { storeToRefs } from 'pinia'
import axiosApi from './axiosApi'
import { useTokenStore } from '@/stores/userTokenStore'

// 로그인 api
export const login = async (credentials) => {
  const response = await axiosApi({
    url: '/members/login',
    method: 'post',
    data: credentials,
    withCredentials: true,
  })

  const accessToken = response.data.data.access_token

  if (accessToken) {
    const store = useTokenStore()
    const { userAccessToken } = storeToRefs(store)
    userAccessToken.value = accessToken
  }

  return response
}

// 회원가입 api
export const signup = (payload) => {
  return axiosApi({
    url: '/members/signup',
    method: 'post',
    data: payload,
  })
}

export const checkNickname = (nickname) => {
  return axiosApi({
    url: '/members/check-nickname',
    method: 'get',
    params: { nickname: nickname },
    withCredentials: true,
  })
}

export const checkEmail = (email) => {
  return axiosApi({
    url: '/members/check-email',
    method: 'get',
    params: { email: email },
    withCredentials: true,
  })
}

export const mockMe = () => {
  return new Promise((resolve) => {
    resolve({
      success: true,
      data: {
        email: 'sunyeop12@gmail.com',
        profileImage: '/src/assets/img/shipleaf.jpg',
        nickname: '김선엽',
      },
      error: null,
    })
    // 네트워크 지연 흉내
  })
}

// 이메일 중복 더미 함수
// export const mockCheckEmail = (email) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         success: true,
//         data: {
//           has_email: email === 'test@example.com',
//           // test@example.com이면 중복(true)
//           // 그 외는 사용 가능(false)
//         },
//         error: null,
//       })
//     }, 600) // 네트워크 지연 흉내
//   })
// }
// 닉네임 중복 더미 함수
// export const mockCheckNickname = (nickname) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         success: true,
//         data: {
//           has_nickname: nickname === 'admin' || nickname === 'tester',
//         },
//         error: null,
//       })
//     }, 600)
//   })
// }
