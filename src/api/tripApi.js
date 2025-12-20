import axiosApi from './axiosApi'

export const createTrip = (data) => {
  return axiosApi({
    url: '/api/v1/trips',
    method: 'post',
    data: data,
    withCredentials: true,
  })
}

// api/mock/getTrips.js
export const getTripsMock = () => {
  return Promise.resolve({
    success: true,
    data: [
      {
        trip_id: 1,
        sido_name: '부산',
        gungu_name: '해운대구',
        title: '부산 먹방 여행',
        start_date: '2025-05-01',
        end_date: '2025-05-03',
        trip_members: [
          {
            member_id: 1,
            nickname: '김철수',
            profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
            role: 'HOST',
          },
          {
            member_id: 2,
            nickname: '이영희',
            profile_image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
            role: 'GUEST',
          },
        ],
      },
      {
        trip_id: 2,
        sido_name: '서울',
        gungu_name: '종로구',
        title: '서울 감성 산책',
        start_date: '2025-06-10',
        end_date: '2025-06-12',
        trip_members: [
          {
            member_id: 3,
            nickname: '박민수',
            profile_image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
            role: 'HOST',
          },
        ],
      },
      {
        trip_id: 3,
        sido_name: '제주',
        gungu_name: '서귀포시',
        title: '제주 힐링 여행',
        start_date: '2025-07-01',
        end_date: '2025-07-05',
        trip_members: [
          {
            member_id: 4,
            nickname: '최지은',
            profile_image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
            role: 'HOST',
          },
          {
            member_id: 5,
            nickname: '정우성',
            profile_image: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0',
            role: 'GUEST',
          },
          {
            member_id: 6,
            nickname: '한지민',
            profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
            role: 'GUEST',
          },
        ],
      },
      {
        trip_id: 4,
        sido_name: '강원',
        gungu_name: '속초시',
        title: '속초 바다 여행',
        start_date: '2025-08-15',
        end_date: '2025-08-17',
        trip_members: [
          {
            member_id: 7,
            nickname: '이준호',
            profile_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
            role: 'HOST',
          },
        ],
      },
    ],
    error: null,
  })
}

// api/mock/getTripImage.js
export const getTripImageMock = (tripId) => {
  const imageMap = {
    1: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // 부산 해운대
    2: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c', // 서울
    3: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', // 제주
    4: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', // 속초
  }

  return Promise.resolve({
    success: true,
    data: {
      trip_id: tripId,
      image_url: imageMap[tripId] ?? null,
    },
    error: null,
  })
}

