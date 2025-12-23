import axiosApi from './axiosApi'

export const createTrip = (data) => {
  return axiosApi({
    url: '/api/v1/trips',
    method: 'post',
    data: data,
    withCredentials: true,
  })
}

export const getTripImageMock = (tripId) => {
  const imageMap = {
    1: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    2: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c',
    3: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    4: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',

    // ✅ 추가 이미지(2026)
    5: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', // 제주
    6: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c', // 서울
    7: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', // 강릉/바다 느낌
    8: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // 부산 바다 느낌
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
      {
        trip_id: 5,
        sido_name: '제주',
        gungu_name: '제주시',
        title: '새해 제주 드라이브',
        start_date: '2026-01-10',
        end_date: '2026-01-12',
        trip_members: [
          {
            member_id: 10,
            nickname: '김선엽',
            profile_image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
            role: 'HOST',
          },
          {
            member_id: 11,
            nickname: '홍길동',
            profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
            role: 'GUEST',
          },
        ],
      },
      {
        trip_id: 6,
        sido_name: '서울',
        gungu_name: '마포구',
        title: '전시회 + 카페 투어',
        start_date: '2026-02-08',
        end_date: '2026-02-09',
        trip_members: [
          {
            member_id: 12,
            nickname: '박지성',
            profile_image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
            role: 'HOST',
          },
          {
            member_id: 13,
            nickname: '김하나',
            profile_image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
            role: 'GUEST',
          },
          {
            member_id: 14,
            nickname: '최유진',
            profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
            role: 'GUEST',
          },
        ],
      },
      {
        trip_id: 7,
        sido_name: '강원',
        gungu_name: '강릉시',
        title: '강릉 커피 + 바다',
        start_date: '2026-03-20',
        end_date: '2026-03-22',
        trip_members: [
          {
            member_id: 15,
            nickname: '이민지',
            profile_image: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0',
            role: 'HOST',
          },
        ],
      },
      {
        trip_id: 8,
        sido_name: '부산',
        gungu_name: '수영구',
        title: '광안리 야경 여행',
        start_date: '2026-05-03',
        end_date: '2026-05-05',
        trip_members: [
          {
            member_id: 16,
            nickname: '정수빈',
            profile_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
            role: 'HOST',
          },
          {
            member_id: 17,
            nickname: '오지훈',
            profile_image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
            role: 'GUEST',
          },
        ],
      },
    ],
    error: null,
  })
}

const TRIP_DETAIL_DB = {
  1: {
    trip_id: 1,
    sido_name: '부산',
    gungu_name: '강서구',
    title: '부산 2박 3일 힐링 여행',
    image_url: 'https://cdn.travie.com/news/photo/202404/52446_32969_4728.jpg',
    description: '부산 바다를 보며 힐링하는 여행',
    start_date: '2025-05-01',
    end_date: '2025-05-03',
    day_numbers: [1, 2, 3],
    trip_members: [
      { member_id: 5, nickname: 'a', profile_image: null, role: 'GUEST' },
      { member_id: 4, nickname: 'aaaaaaa', profile_image: null, role: 'HOST' },
    ],
  },

  // ✅ 나머지도 필요하면 이런 식으로 확장
  2: {
    trip_id: 2,
    sido_name: '서울',
    gungu_name: '종로구',
    title: '서울 2박 3일 감성 산책',
    image_url: null,
    description: '한옥/전시/산책 코스로 도심 힐링',
    start_date: '2025-06-10',
    end_date: '2025-06-12',
    day_numbers: [1, 2, 3],
    trip_members: [{ member_id: 3, nickname: '박민수', profile_image: null, role: 'HOST' }],
  },
}

export const getTripDetailMock = (trip_id) => {
  const id = Number(trip_id)
  const data = TRIP_DETAIL_DB[id]

  if (!id || !data) {
    return Promise.resolve({
      success: false,
      data: null,
      error: { code: 'TRIP_NOT_FOUND', message: '해당 trip_id의 여행이 없습니다.' },
    })
  }

  return Promise.resolve({
    success: true,
    data,
    error: null,
  })
}

const ITINERARY_DB = {
  1: {
    1: [
      {
        itinerary_id: 521,
        attraction_id: 1004,
        attraction_title: '경성 부민관 의거지',
        cat3: '소분류',
        visit_order: 1,
        start_time: '14:00',
        end_time: '16:00',
        latitude: '37.5663',
        longitude: '126.9780',
      },
      {
        itinerary_id: 522,
        attraction_id: 1005,
        attraction_title: '가창 찐빵 골목',
        cat3: '소분류',
        visit_order: 2,
        start_time: '16:30',
        end_time: '18:00',
        latitude: '35.795',
        longitude: '128.618',
      },
    ],
    2: [
      {
        itinerary_id: 523,
        attraction_id: 2001,
        attraction_title: '해운대 해수욕장',
        cat3: '자연',
        visit_order: 1,
        start_time: '10:00',
        end_time: '12:00',
      },
    ],
    3: [],
  },

  2: {
    1: [
      {
        itinerary_id: 610,
        attraction_id: 3001,
        attraction_title: '경복궁',
        cat3: '문화',
        visit_order: 1,
        start_time: '11:00',
        end_time: '13:00',
      },
    ],
    2: [],
    3: [],
  },
}

export const getItinerariesMock = ({ trip_id, day_number }) => {
  const tId = Number(trip_id)
  const day = Number(day_number)

  if (!tId || !day) {
    return Promise.resolve({
      success: false,
      data: null,
      error: { code: 'INVALID_QUERY', message: 'trip_id, day_number가 필요합니다.' },
    })
  }

  const rows = ITINERARY_DB?.[tId]?.[day]
  if (!rows) {
    // 없으면 "빈 배열 반환"이 편한 경우가 많아서 success는 true로 두는 것도 흔합니다.
    return Promise.resolve({
      success: true,
      data: [],
      error: null,
    })
  }

  // visit_order 기준 정렬 보장
  const sorted = [...rows].sort((a, b) => a.visit_order - b.visit_order)

  return Promise.resolve({
    success: true,
    data: sorted,
    error: null,
  })
}

// ✅ mock detail DB
const ITINERARY_DETAIL_BY_ID = {
  521: {
    itinerary_id: 521,
    attraction_title: '가창 찐빵 골목',
    image_url: 'https://picsum.photos/seed/521/600/400',
    cat3: '맛집',
    visitOrder: 1,
    start_time: '14:00',
    end_time: '16:00',
    memo: '점심 식사 겸 찐빵 포장',
    price: 30000,
    music_list: [
      { music_id: 1, title: 'dddd', artist_name: 'dddd' },
      { music_id: 2, title: 'Sunset Drive', artist_name: 'Neon Waves' },
      { music_id: 3, title: 'Osaka Night', artist_name: 'City Pop' },
    ],
  },
  522: {
    itinerary_id: 522,
    attraction_title: '경성 부민관 의거지',
    image_url: 'https://picsum.photos/seed/522/600/400',
    cat3: '역사',
    visitOrder: 2,
    start_time: '16:30',
    end_time: '17:30',
    memo: '사진 찍기 좋은 포인트 확인',
    price: 0,
    music_list: [{ music_id: 11, title: 'History Walk', artist_name: 'Ambient Lab' }],
  },
}

// ✅ /api/v1/itineraries/{itineraryId} mock
export const getItineraryDetailMock = (itineraryId) => {
  const data = ITINERARY_DETAIL_BY_ID[itineraryId]

  // 네가 말한 형태: "data.data"로 조회
  if (!data) {
    return Promise.resolve({
      success: false,
      data: null,
      error: { message: '해당 itinerary가 없습니다.' },
    })
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          success: true,
          data, // ✅ 여기!
          error: null,
        },
        error: null,
      })
    }, 250)
  })
}
