import axiosApi from './axiosApi'

// mockUsers.js
// export const mockUsers = [
//   {
//     member_id: 1,
//     name: '김싸피',
//     email: 'kim1@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=1',
//   },
//   {
//     member_id: 2,
//     name: '이싸피',
//     email: 'lee2@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=2',
//   },
//   {
//     member_id: 3,
//     name: '박싸피',
//     email: 'park3@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=3',
//   },
//   {
//     member_id: 4,
//     name: '최싸피',
//     email: 'choi4@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=4',
//   },
//   {
//     member_id: 5,
//     name: '정싸피',
//     email: 'jung5@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=5',
//   },
//   {
//     member_id: 6,
//     name: '한싸피',
//     email: 'han6@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=6',
//   },
//   {
//     member_id: 7,
//     name: '윤싸피',
//     email: 'yoon7@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=7',
//   },
//   {
//     member_id: 8,
//     name: '임싸피',
//     email: 'lim8@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=8',
//   },
//   {
//     member_id: 9,
//     name: '서싸피',
//     email: 'seo9@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=9',
//   },
//   {
//     member_id: 10,
//     name: '오싸피',
//     email: 'oh10@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=10',
//   },
//   {
//     member_id: 11,
//     name: '강싸피',
//     email: 'kang11@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=11',
//   },
//   {
//     member_id: 12,
//     name: '신싸피',
//     email: 'shin12@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=12',
//   },
//   {
//     member_id: 13,
//     name: '조싸피',
//     email: 'jo13@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=13',
//   },
//   {
//     member_id: 14,
//     name: '백싸피',
//     email: 'baek14@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=14',
//   },
//   {
//     member_id: 15,
//     name: '문싸피',
//     email: 'moon15@ssafy.com',
//     profile_image: 'https://i.pravatar.cc/150?img=15',
//   },
// ]

export const searchUser = (nickname, cursor, size) => {
  return axiosApi({
    url: '/members/search',
    method: 'get',
    params: {
      nickname: nickname,
      cursor: cursor,
      size: size,
    },
    withCredentials: true,
  })
}

// export const mockSearchUser = (nickname = '', page = 0, size = 5) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // 🔍 닉네임 필터 (부분 일치)
//       const filtered = mockUsers.filter((user) => user.name.includes(nickname))

//       const start = page * size
//       const end = start + size
//       const content = filtered.slice(start, end)

//       resolve({
//         success: true,
//         data: {
//           content,
//           page,
//           size,
//           total_elements: filtered.length,
//           total_pages: Math.ceil(filtered.length / size),
//           has_next: end < filtered.length,
//           has_previous: page > 0,
//         },
//         error: null,
//       })
//     }, 400) // 👉 네트워크 지연 느낌
//   })
// }

export const getReceiveddRequest = () => {
  return axiosApi({
    url: '/friends/requests/received',
    method: 'get',
    withCredentials: true,
  })
}

// api/mock/getReceivedRequest.js
export const getReceivedRequestMock = () => {
  return Promise.resolve({
    success: true,
    data: [
      {
        friend_id: 10,
        nickname: '김철수',
        profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
        created_at: '2025-12-05T12:00:00',
      },
      {
        friend_id: 11,
        nickname: '김철수2',
        profile_image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
        created_at: '2025-12-05T12:00:01',
      },
      {
        friend_id: 12,
        nickname: '이영희',
        profile_image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
        created_at: '2025-12-06T09:30:00',
      },
    ],
    error: null,
  })
}

export const getFriends = () => {
  return axiosApi({
    url: '/friends',
    method: 'get',
    withCredentials: true,
  })
}

export const getFriendsMock = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            friend_id: 21,
            member_id: 101,
            nickname: '박민수',
            profile_image: 'https://i.pravatar.cc/150?img=21',
          },
          {
            friend_id: 22,
            member_id: 102,
            nickname: '최지은',
            profile_image: 'https://i.pravatar.cc/150?img=22',
          },
          {
            friend_id: 23,
            member_id: 103,
            nickname: '정우성',
            profile_image: 'https://i.pravatar.cc/150?img=23',
          },
          {
            friend_id: 24,
            member_id: 104,
            nickname: '한지민',
            profile_image: 'https://i.pravatar.cc/150?img=24',
          },
          {
            friend_id: 25,
            member_id: 105,
            nickname: '이준호',
            profile_image: 'https://i.pravatar.cc/150?img=25',
          },
          {
            friend_id: 26,
            member_id: 106,
            nickname: '김하늘',
            profile_image: 'https://i.pravatar.cc/150?img=26',
          },
          {
            friend_id: 27,
            member_id: 107,
            nickname: '오세훈',
            profile_image: 'https://i.pravatar.cc/150?img=27',
          },
          {
            friend_id: 28,
            member_id: 108,
            nickname: '서지수',
            profile_image: 'https://i.pravatar.cc/150?img=28',
          },
        ],
        error: null,
      })
    }, 1000) // ✅ 1초 네트워크 지연
  })
}

export const friendRequest = (memberId) => {
  return axiosApi({
    url: '/friends',
    method: 'post',
    data: {
      to_member_id: memberId,
    },
    withCredentials: true,
  })
}

export const friendRequestMock = (memberId) => {
  console.log('mock api: ', memberId)
  return new Promise.resolve({
    data: {
      success: true,
      data: null,
      error: null,
    },
  })
}
