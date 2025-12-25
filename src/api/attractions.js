import axiosApi from './axiosApi'
import axios from 'axios'

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

export const fetchSpots = ({ sidoCode, gunguCode, title, size = 10, cursor, contentType } = {}) => {
  const params = {}

  if (sidoCode) params.sido_code = sidoCode
  if (gunguCode) params.gungu_code = gunguCode
  if (title) params.title = title
  if (cursor) params.cursor = cursor
  if (size) params.size = size
  if (contentType && contentType !== 'all') params.content_type = contentType

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

export const fetchRecommendationAttractions = (itinerary_id, sido_id, gungu_id) => {
  const params = {}

  if (sido_id) params.sido_id = sido_id
  if (gungu_id) params.gungu_id = gungu_id

  return axiosApi({
    url: `/itineraries/${itinerary_id}/attraction-recommendations`,
    method: 'get',
    params: params,
    withCredentials: true,
  })
}

const attracionsMockData = [
  {
    attraction_id: 47171,
    content_id: 2715272,
    cat3_name: '공원',
    title: '故박정렬여사 추모공원',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/24/3384124_image2_1.JPG',
    latitude: 37.73218005,
    longitude: 128.36066014,
    like_cnt: 0,
  },
  {
    attraction_id: 47170,
    content_id: 3544745,
    cat3_name: '박물관',
    title: '㈜타임트레인',
    image_url: '',
    latitude: 37.68826765,
    longitude: 129.03742269,
    like_cnt: 0,
  },
  {
    attraction_id: 47169,
    content_id: 2908526,
    cat3_name: '사후면세점',
    title: '㈜엔터식스패션쇼핑몰 천호역점',
    image_url: '',
    latitude: 37.53939334,
    longitude: 127.12331694,
    like_cnt: 0,
  },
  {
    attraction_id: 47168,
    content_id: 2910272,
    cat3_name: '사후면세점',
    title: '㈜엔터식스 왕십리역사점',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/91/2890691_image2_1.jpg',
    latitude: 37.5614948,
    longitude: 127.03841015,
    like_cnt: 0,
  },
  {
    attraction_id: 47167,
    content_id: 2907469,
    cat3_name: '사후면세점',
    title: '㈜엔터식스 상봉점',
    image_url: '',
    latitude: 37.59813871,
    longitude: 127.09133762,
    like_cnt: 0,
  },
  {
    attraction_id: 47166,
    content_id: 2910945,
    cat3_name: '사후면세점',
    title: '㈜러쉬코리아 홍대점',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/05/2875505_image2_1.jpg',
    latitude: 37.55249097,
    longitude: 126.92139329,
    like_cnt: 0,
  },
  {
    attraction_id: 47165,
    content_id: 2910593,
    cat3_name: '사후면세점',
    title: '㈜러쉬코리아 이태원역점',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/70/2878470_image2_1.jpg',
    latitude: 37.534686,
    longitude: 126.99389274,
    like_cnt: 0,
  },
  {
    attraction_id: 47164,
    content_id: 2910412,
    cat3_name: '사후면세점',
    title: '㈜러쉬코리아 신림점',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/88/2880488_image2_1.jpg',
    latitude: 37.48390465,
    longitude: 126.93024997,
    like_cnt: 0,
  },
  {
    attraction_id: 47163,
    content_id: 2905444,
    cat3_name: '사후면세점',
    title: '㈜러쉬코리아 대학로점',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/83/2878183_image2_1.jpg',
    latitude: 37.58319992,
    longitude: 127.00009914,
    like_cnt: 0,
  },
  {
    attraction_id: 47162,
    content_id: 2910762,
    cat3_name: '사후면세점',
    title: '㈜러쉬코리아 경리단길점',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/01/2890701_image2_1.jpg',
    latitude: 37.540727,
    longitude: 126.99566185,
    like_cnt: 0,
  },
  {
    attraction_id: 47161,
    content_id: 2907399,
    cat3_name: '사후면세점',
    title: '㈜러쉬코리아 경리단길 스파',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/49/2890649_image2_1.jpg',
    latitude: 37.540727,
    longitude: 126.99566185,
    like_cnt: 0,
  },
  {
    attraction_id: 47160,
    content_id: 2775331,
    cat3_name: '이색체험',
    title: '㈜놀아본',
    image_url: '',
    latitude: 35.26983471,
    longitude: 126.51174608,
    like_cnt: 0,
  },
  {
    attraction_id: 47159,
    content_id: 3353949,
    cat3_name: '이색체험',
    title: '㈜ 희품씨',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/12/3353912_image2_1.jpg',
    latitude: 35.56716099,
    longitude: 129.11242854,
    like_cnt: 0,
  },
  {
    attraction_id: 47158,
    content_id: 2402735,
    cat3_name: '가족코스',
    title: '“해금강이 전부인 줄 알았지?”...거제에서 배우는 역사',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/59/1609959_image2_1.jpg',
    latitude: 34.85222337,
    longitude: 128.59587638,
    like_cnt: 0,
  },
  {
    attraction_id: 47157,
    content_id: 2401954,
    cat3_name: '힐링코스',
    title: '“동굴아, 여름을 부탁해”...그늘 찾아 떠나는 삼척여행',
    image_url: 'http://tong.visitkorea.or.kr/cms/resource/40/2037140_image2_1.jpg',
    latitude: 37.32595353,
    longitude: 129.02057144,
    like_cnt: 0,
  },
]

export const fetchRecommendationAttractionsMock = (itinerary_id, sido_id, gungu_id) => {
  console.log(itinerary_id, sido_id, gungu_id)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: attracionsMockData,
          error: null,
        },
      })
    }, 250) // 로딩 테스트용 딜레이
  })
}
