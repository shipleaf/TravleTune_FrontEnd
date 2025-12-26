import axiosApi from './axiosApi'

// 실제 API 호출: 이미지 파일(FormData) 전송
export function postMoodRecommendations({ image, prompt }) {
  const formData = new FormData()
  formData.append('image', image) // ✅ 서버가 요구하는 키: image
  if (prompt) formData.append('prompt', prompt)

  return axiosApi.post('/recommendations', formData) // ✅ headers 강제 지정 X
}

// 목업 API: 실제 요청 대신 샘플 데이터를 반환
export function postMoodRecommendationsMock() {
  const sample = {
    success: true,
    data: [
      {
        music_id: 344,
        artist_name: '조이',
        spotify_id: '2OAEKEb0778gsDaCef7MLI',
        title: '좋은 사람 있으면 소개시켜줘',
        album_image: 'https://i.scdn.co/image/ab67616d0000b273117b1209803da865d76b6287',
        uri: 'spotify:track:2OAEKEb0778gsDaCef7MLI',
      },
      {
        music_id: 866,
        artist_name: '볼빨간사춘기',
        spotify_id: '0xd12UCnFMjLnLlF5oSiWa',
        title: '심술',
        album_image: 'https://i.scdn.co/image/ab67616d0000b273910f1e3b33c775c7c3d29572',
        uri: 'spotify:track:0xd12UCnFMjLnLlF5oSiWa',
      },
      {
        music_id: 790,
        artist_name: 'Joosiq',
        spotify_id: '0rXtV4L8uQ7KHNxxKd2jGZ',
        title: 'Think About You',
        album_image: 'https://i.scdn.co/image/ab67616d0000b2731ccc8cbc13eb6446f12b0226',
        uri: 'spotify:track:0rXtV4L8uQ7KHNxxKd2jGZ',
      },
      {
        music_id: 953,
        artist_name: '볼빨간사춘기',
        spotify_id: '0kvtiq8qll4OTfDXvrkXEF',
        title: '나비와 고양이 (feat. 백현)',
        album_image: 'https://i.scdn.co/image/ab67616d0000b27309c71f2dbbf5355e71a2b99a',
        uri: 'spotify:track:0kvtiq8qll4OTfDXvrkXEF',
      },
      {
        music_id: 873,
        artist_name: '비스트',
        spotify_id: '4Cdyx3bs8mMYVJWP3wHPXj',
        title: '비가 오는 날엔',
        album_image: 'https://i.scdn.co/image/ab67616d0000b273c89d6d3da4431db2eb42acb2',
        uri: 'spotify:track:4Cdyx3bs8mMYVJWP3wHPXj',
      },
      {
        music_id: 384,
        artist_name: 'Woody',
        spotify_id: '5JW2OlJRmFLlr63TqBJFdw',
        title: '이 노래가 클럽에서 나온다면',
        album_image: 'https://i.scdn.co/image/ab67616d0000b2734c87f18a5a0c64c806284c65',
        uri: 'spotify:track:5JW2OlJRmFLlr63TqBJFdw',
      },
      {
        music_id: 776,
        artist_name: '버스커 버스커',
        spotify_id: '6LDYx1RVSrhQrFhjFGiTJm',
        title: '소나기 (주르르루)',
        album_image: 'https://i.scdn.co/image/ab67616d0000b2733fa604f357ae9a3291403461',
        uri: 'spotify:track:6LDYx1RVSrhQrFhjFGiTJm',
      },
      {
        music_id: 438,
        artist_name: '별',
        spotify_id: '4ChcAHREIPTwDh7BUavyfT',
        title: '귀여워 (WITH 권정열 OF 10CM)',
        album_image: 'https://i.scdn.co/image/ab67616d0000b273fbd8f282a40529160bcdf257',
        uri: 'spotify:track:4ChcAHREIPTwDh7BUavyfT',
      },
      {
        music_id: 166,
        artist_name: 'G-DRAGON',
        spotify_id: '7g97EfyxPG5XZgYmLig9ML',
        title: '그XX',
        album_image: 'https://i.scdn.co/image/ab67616d0000b2734687bc7a0bda65c282c13afa',
        uri: 'spotify:track:7g97EfyxPG5XZgYmLig9ML',
      },
      {
        music_id: 878,
        artist_name: '긱스',
        spotify_id: '7CkjU55ROZSwb95dzGan0o',
        title: 'Officially Missing You',
        album_image: 'https://i.scdn.co/image/ab67616d0000b27311915bd68054ccc7ffc01c30',
        uri: 'spotify:track:7CkjU55ROZSwb95dzGan0o',
      },
      {
        music_id: 885,
        artist_name: '버스커 버스커',
        spotify_id: '4eFTh1opLS5wANDmZK9ghC',
        title: '벚꽃 엔딩',
        album_image: 'https://i.scdn.co/image/ab67616d0000b27347683d1b11d35a22048d243f',
        uri: 'spotify:track:4eFTh1opLS5wANDmZK9ghC',
      },
      {
        music_id: 631,
        artist_name: '10CM',
        spotify_id: '1fr9b1MIyas7cpt1QY3h9d',
        title: '봄이 좋냐??',
        album_image: 'https://i.scdn.co/image/ab67616d0000b27335c5a4a54a7893ff38289e73',
        uri: 'spotify:track:1fr9b1MIyas7cpt1QY3h9d',
      },
      {
        music_id: 644,
        artist_name: '버스커 버스커',
        spotify_id: '2Jcr94j4IHpeTDXPQ0lALe',
        title: '정말로 사랑한다면',
        album_image: 'https://i.scdn.co/image/ab67616d0000b2733fa604f357ae9a3291403461',
        uri: 'spotify:track:2Jcr94j4IHpeTDXPQ0lALe',
      },
      {
        music_id: 894,
        artist_name: '아이유',
        spotify_id: '0GsRx0gPft6RmijIwMsKmG',
        title: '금요일에 만나요 (feat.장이정 of HISTORY)',
        album_image: 'https://i.scdn.co/image/ab67616d0000b27315b8cef21bf4482d56c15614',
        uri: 'spotify:track:0GsRx0gPft6RmijIwMsKmG',
      },
      {
        music_id: 857,
        artist_name: '원슈타인',
        spotify_id: '2tmX4T7ODY34NwvQ3DD3MC',
        title: '존재만으로',
        album_image: 'https://i.scdn.co/image/ab67616d0000b2735dc4fc537f5a3e3c64b41115',
        uri: 'spotify:track:2tmX4T7ODY34NwvQ3DD3MC',
      },
      {
        music_id: 73,
        artist_name: '문문',
        spotify_id: '6e1jziK0mMytJvWit0W04d',
        title: '비행운',
        album_image: 'https://i.scdn.co/image/ab67616d0000b273472ecc6061a22abb3abdf3f0',
        uri: 'spotify:track:6e1jziK0mMytJvWit0W04d',
      },
      {
        music_id: 979,
        artist_name: '10CM',
        spotify_id: '2eCIpp1f2jrJzVrpaASqlq',
        title: '애상',
        album_image: 'https://i.scdn.co/image/ab67616d0000b2736ef45ebf3d55567ebdece7f0',
        uri: 'spotify:track:2eCIpp1f2jrJzVrpaASqlq',
      },
      {
        music_id: 364,
        artist_name: '이무진',
        spotify_id: '4uQsyh3FqtfUH0gzlpWlkJ',
        title: '청혼하지 않을 이유를 못 찾았어',
        album_image: 'https://i.scdn.co/image/ab67616d0000b273c7c4db30c84c09b8ceafd78c',
        uri: 'spotify:track:4uQsyh3FqtfUH0gzlpWlkJ',
      },
      {
        music_id: 72,
        artist_name: '티아라',
        spotify_id: '3Q6ny7MOETlpX1VE83CzZE',
        title: 'DAY BY DAY',
        album_image: 'https://i.scdn.co/image/ab67616d0000b2736d2fb194d5830b281fab6e7b',
        uri: 'spotify:track:3Q6ny7MOETlpX1VE83CzZE',
      },
      {
        music_id: 826,
        artist_name: '존박',
        spotify_id: '71D25BGzsq5OxlENZnq9N0',
        title: '네 생각',
        album_image: 'https://i.scdn.co/image/ab67616d0000b27319b21380b9330184dfa922a7',
        uri: 'spotify:track:71D25BGzsq5OxlENZnq9N0',
      },
    ],
    error: null,
  }

  // 네트워크 지연 효과를 위해 약간의 지연을 추가
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: sample }), 1200)
  })
}
