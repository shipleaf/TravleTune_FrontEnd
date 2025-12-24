import axiosApi from './axiosApi'
import axios from 'axios'

// src/api/mockSpotsApi.js
export function fetchMockSpots() {
  const response = {
    data: {
      data: [
        {
          attraction_id: 1,
          title: '경복궁',
          image:
            'https://media.istockphoto.com/id/1676101015/ko/%EC%82%AC%EC%A7%84/%EA%B2%BD%EB%B3%B5%EA%B6%81%EC%9D%80-%EC%84%9D%EC%96%91%EC%9D%B4-%EC%95%84%EB%A6%84%EB%8B%B5%EA%B3%A0-%EC%84%9C%EC%9A%B8-%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD.jpg?s=612x612&w=0&k=20&c=gKZvvJAShxWls229xvzBJlCHJMJF9rOJn-yOYn1ACeA=',
          addr1: '서울특별시 종로구',
          addr2: '사직동',
          likeCount: 128,
        },
        {
          attraction_id: 2,
          title: '북촌 한옥마을',
          image:
            'https://media.triple.guide/triple-cms/c_limit,f_auto,h_1024,w_1024/62a8d636-234e-4903-b4fb-5dd079c7bee3.jpeg',
          addr1: '서울특별시 종로구',
          addr2: '계동',
          likeCount: 128,
        },
        {
          attraction_id: 3,
          title: '해운대 해수욕장',
          image:
            'https://i.namu.wiki/i/hkDOgJHC40yiIFKQDRz7YjHpzWrL9vCTT7mve4TF6Lj-GpGsBpvT8WlXbwOT_To1Ndl1zKrVLQ-SiwaGNFOgQA.webp',
          addr1: '부산광역시 해운대구',
          addr2: '우동',
          likeCount: 128,
        },
        {
          attraction_id: 4,
          title: '감천문화마을',
          image:
            'https://cdn.sanity.io/images/nxpteyfv/goguides/d47e6af783f73cb63ef98a6153f1029064348ebf-1600x1066.jpg',
          addr1: '부산광역시 사하구',
          addr2: '감천동',
          likeCount: 128,
        },
        {
          attraction_id: 5,
          title: '성산일출봉',
          image:
            'https://www.telltrip.com/wp-content/uploads/2025/08/seongsan-ilchulbong-jeju-unesco3.webp',
          addr1: '제주특별자치도 서귀포시',
          addr2: '성산읍',
          likeCount: 128,
        },
        {
          attraction_id: 6,
          title: '안동 하회마을',
          image: 'https://cdn.ardentnews.co.kr/news/photo/202506/6639_31472_5340.jpg',
          addr1: '경상북도 안동시',
          addr2: '풍천면',
          likeCount: 128,
        },
        {
          attraction_id: 7,
          title: '경주 불국사',
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHh7SfRmRY-QnIhGSAUooX6TTLVBw23IApEQ&s',
          addr1: '경상북도 경주시',
          addr2: '진현동',
          likeCount: 128,
        },
        {
          attraction_id: 8,
          title: '남이섬',
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqW0IT7Zat4O4TgoH9Hgv-rk2Z_BH39VYmxw&s',
          addr1: '강원특별자치도 춘천시',
          addr2: '남산면',
          likeCount: 128,
        },
      ],
    },
  }

  // ✅ 실제 API처럼 약간의 지연
  return new Promise((resolve) => {
    setTimeout(() => resolve(response), 500)
  })
}

export const fetchSpots = ({ sidoCode, gunguCode, title, size } = {}) => {
  const params = {}

  if (sidoCode) params.sido_code = sidoCode
  if (gunguCode) params.gungu_code = gunguCode
  if (title) params.title = title
  if (size) params.size = size

  return axiosApi({
    url: '/attractions',
    method: 'get',
    params,
    withCredentials: true,
  })
}

const tourApi = axios.create({
  baseURL: 'https://apis.data.go.kr/B551011/KorService2',
  timeout: 10000,
})

// contentId로 상세 공통 정보 가져오기
export const fetchDetailCommon2 = (contentId) => {
  return tourApi.get('/detailCommon2', {
    params: {
      serviceKey: import.meta.env.VITE_SERVICE_KEY, // ✅ .env
      MobileOS: 'WEB',
      MobileApp: 'TravelTune',
      _type: 'json',

      contentId, // ✅ spot에 있는 contentId

      // ✅ 필요한 필드 내려오게 옵션 켜기
      defaultYN: 'Y',
      addrinfoYN: 'Y',
      overviewYN: 'Y',

      // 안전하게 1건만
      numOfRows: 1,
      pageNo: 1,
    },
  })
}

// 응답에서 필요한 값만 뽑는 헬퍼
export const extractDetailCommon2 = (res) => {
  const item =
    res?.data?.response?.body?.items?.item?.[0] ?? res?.data?.response?.body?.items?.item ?? null

  return {
    addr1: item?.addr1 ?? '',
    addr2: item?.addr2 ?? '',
    description: item?.overview ?? '', // ✅ overview를 description으로 사용
  }
}
