// import axiosApi from './axiosApi'

const sidoList = {
  data: [
    { sido_code: 11, sido_name: '서울' },
    { sido_code: 26, sido_name: '부산' },
    { sido_code: 27, sido_name: '대구' },
    { sido_code: 28, sido_name: '인천' },
    { sido_code: 29, sido_name: '광주' },
    { sido_code: 30, sido_name: '대전' },
    { sido_code: 31, sido_name: '울산' },
    { sido_code: 36, sido_name: '세종' },
    { sido_code: 41, sido_name: '경기' },
    { sido_code: 42, sido_name: '강원' },
    { sido_code: 43, sido_name: '충북' },
    { sido_code: 44, sido_name: '충남' },
    { sido_code: 45, sido_name: '전북' },
    { sido_code: 46, sido_name: '전남' },
    { sido_code: 47, sido_name: '경북' },
    { sido_code: 48, sido_name: '경남' },
    { sido_code: 50, sido_name: '제주' },
  ],
}

const gunguData = {
  11: [
    { gungu_code: 1, gungu_name: '종로구' },
    { gungu_code: 2, gungu_name: '중구' },
    { gungu_code: 3, gungu_name: '용산구' },
    { gungu_code: 4, gungu_name: '성동구' },
    { gungu_code: 5, gungu_name: '광진구' },
    { gungu_code: 6, gungu_name: '동대문구' },
    { gungu_code: 7, gungu_name: '중랑구' },
    { gungu_code: 8, gungu_name: '성북구' },
    { gungu_code: 9, gungu_name: '강북구' },
    { gungu_code: 10, gungu_name: '도봉구' },
    { gungu_code: 11, gungu_name: '노원구' },
    { gungu_code: 12, gungu_name: '은평구' },
    { gungu_code: 13, gungu_name: '서대문구' },
    { gungu_code: 14, gungu_name: '마포구' },
    { gungu_code: 15, gungu_name: '양천구' },
    { gungu_code: 16, gungu_name: '강서구' },
    { gungu_code: 17, gungu_name: '구로구' },
    { gungu_code: 18, gungu_name: '금천구' },
    { gungu_code: 19, gungu_name: '영등포구' },
    { gungu_code: 20, gungu_name: '동작구' },
    { gungu_code: 21, gungu_name: '관악구' },
    { gungu_code: 22, gungu_name: '서초구' },
    { gungu_code: 23, gungu_name: '강남구' },
    { gungu_code: 24, gungu_name: '송파구' },
    { gungu_code: 25, gungu_name: '강동구' },
  ],
  41: [
    { gungu_code: 1, gungu_name: '수원시 장안구' },
    { gungu_code: 2, gungu_name: '수원시 권선구' },
    { gungu_code: 3, gungu_name: '수원시 팔달구' },
    { gungu_code: 4, gungu_name: '수원시 영통구' },
    { gungu_code: 5, gungu_name: '용인시 처인구' },
    { gungu_code: 6, gungu_name: '용인시 기흥구' },
    { gungu_code: 7, gungu_name: '용인시 수지구' },
    { gungu_code: 8, gungu_name: '성남시 수정구' },
    { gungu_code: 9, gungu_name: '성남시 중원구' },
    { gungu_code: 10, gungu_name: '성남시 분당구' },
    { gungu_code: 11, gungu_name: '고양시 덕양구' },
    { gungu_code: 12, gungu_name: '고양시 일산동구' },
    { gungu_code: 13, gungu_name: '고양시 일산서구' },
    { gungu_code: 14, gungu_name: '광명시' },
    { gungu_code: 15, gungu_name: '평택시' },
    { gungu_code: 16, gungu_name: '하남시' },
    { gungu_code: 17, gungu_name: '김포시' },
    { gungu_code: 18, gungu_name: '광주시' },
    { gungu_code: 19, gungu_name: '오산시' },
    { gungu_code: 20, gungu_name: '안성시' },
    { gungu_code: 21, gungu_name: '이천시' },
    { gungu_code: 22, gungu_name: '여주시' },
    { gungu_code: 23, gungu_name: '양평군' },
    { gungu_code: 24, gungu_name: '가평군' },
    { gungu_code: 25, gungu_name: '연천군' },
  ],
}

// 시도 불러오기
// export const getSido = () => {
//   axiosApi({
//     url: '/regions/sido',
//     method: 'get',
//     withCredentials: true,
//   })
// }

export const getSido = () => {
  return sidoList
}

// 시군구 불러오기
// export const getGungu = (sidoCode) => {
//   axiosApi({
//     url: '/regions/gugun',
//     method: 'get',
//     params: { sido_code: sidoCode },
//     withCredentials: true,
//   })
// }

export const getGungu = (sido_code) => {
  return gunguData[sido_code] || []
}
