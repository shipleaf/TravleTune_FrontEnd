<template>
  <section class="page">
    <p class="eyebrow">Music</p>
    <h1>장소 기반 음악 추천</h1>
    <p class="lead">현재 위치와 목적지 분위기에 맞는 음악을 받아보세요.</p>
    <AlbumScene />
    <MapContainer />
    <button @click="loginWithSpotify">Spotify로 로그인</button>
    <p v-if="accessToken">토큰 있음 ✅</p>
    <MusicPlayerContainer v-if="store.accessToken" />

    <div class="panel-grid">
      <div class="panel">
        <h2>추천 설정</h2>
        <form class="form">
          <label>
            현재 도시
            <input type="text" placeholder="예: 파리, 서울" />
          </label>
          <label>
            분위기
            <select>
              <option>잔잔한 카페</option>
              <option>도시의 밤</option>
              <option>드라이브</option>
              <option>트레킹</option>
            </select>
          </label>
          <label>
            활동
            <select>
              <option>산책</option>
              <option>드라이브</option>
              <option>작업/공부</option>
              <option>휴식</option>
            </select>
          </label>
        </form>
      </div>

      <div class="panel">
        <h2>추천 플레이리스트</h2>
        <ul class="list">
          <li>Golden Hour Walk - chillhop</li>
          <li>City Night Drive - synthwave</li>
          <li>Local Taste - 인디/어쿠스틱</li>
          <li>Sunrise Vibes - ambient</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import MapContainer from '@/components/music/MapContainer.vue'
import AlbumScene from '@/components/music/AlbumScene.vue'
import MusicPlayerContainer from '@/components/music/MusicPlayerContainer.vue'
import { useSpotifyStore } from '@/stores/spotify'
import { storeToRefs } from 'pinia'

const store = useSpotifyStore()

const { accessToken } = storeToRefs(store)

function loginWithSpotify() {
  window.location.href = 'http://localhost:3001/login'
}
</script>
