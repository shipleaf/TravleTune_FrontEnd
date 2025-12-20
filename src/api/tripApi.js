import axiosApi from './axiosApi'

export const createTrip = (data) => {
  return axiosApi({
    url: '/api/v1/trips',
    method: 'post',
    data: data,
    withCredentials: true,
  })
}
