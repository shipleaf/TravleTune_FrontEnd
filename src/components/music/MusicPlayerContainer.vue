<template>
  <div class="player-container">
    <!-- 현재 재생중인 곡 정보 -->
    <div class="current-track" v-if="currentTrack">
      <div class="albumAndPlayButton">
        <img :src="currentTrack.albumImage" alt="Album cover" class="album-cover" />
        <button @click="togglePlay" :disabled="!currentTrack" class="playButton">
          {{ isPlaying ? '⏸︎' : '▶︎' }}
        </button>
      </div>
      <div class="albumInfo">
        <div class="titleAndArtist">
          <div class="currentTitle">{{ currentTrack.title }}</div>
          <div class="currentArtist">{{ currentTrack.artist }}</div>
        </div>
        <!-- 타임/시크바 -->
        <div class="playBar">
          <button class="prevButton" @click="prevTrack" :disabled="tracks.length === 0">◀︎</button>
          <div class="progress" v-if="duration > 0">
            <span>{{ formatTime(currentTime) }}</span>
            <input
              type="range"
              min="0"
              :max="duration"
              v-model.number="seekValue"
              @change="seekAudio"
            />
            <span>{{ formatTime(duration) }}</span>
          </div>
          <button class="nextButton" @click="nextTrack" :disabled="tracks.length === 0">▶︎</button>
        </div>
      </div>
    </div>

    <!-- 트랙 리스트 -->
    <div class="track-list">
      <ul>
        <li
          v-for="(track, index) in tracks"
          :key="track.id"
          :class="{ active: index === currentIndex }"
          @click="selectTrack(index)"
        >
          <span class="number">{{ track.pk }}</span>
          <div class="text">
            <div class="title">{{ track.title }}</div>
            <div class="artist">{{ track.artist }}</div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 실제 오디오 태그 (UI에서는 안 보임) -->
    <audio
      ref="audioRef"
      :src="currentTrack?.previewUrl"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useSpotifyStore } from '@/stores/spotify'
import { storeToRefs } from 'pinia'

const tracks = ref([])
const currentIndex = ref(0)
const isPlaying = ref(false)
const audioRef = ref(null)
const currentTime = ref(0)
const duration = ref(0)
const seekValue = ref(0)
const spotifyPlayer = ref(null)
const spotifyDeviceId = ref(null)

const store = useSpotifyStore()
const { accessToken } = storeToRefs(store)

const currentTrack = computed(() => tracks.value[currentIndex.value])

async function playWithSpotify() {
  const track = currentTrack.value
  if (!track || !accessToken.value || !spotifyDeviceId.value) {
    console.warn('재생 준비가 안 됐습니다.')
    return
  }

  try {
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${spotifyDeviceId.value}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [track.spotifyUri],
        }),
      },
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('Spotify play error status:', res.status)
      console.error('Spotify play error body:', text)
      return
    }

    isPlaying.value = true
  } catch (e) {
    console.error('Spotify play error', e)
  }
}

async function pauseWithSpotify() {
  if (!accessToken.value || !spotifyDeviceId.value) return

  try {
    await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${spotifyDeviceId.value}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    })
    isPlaying.value = false
  } catch (e) {
    console.error('Spotify pause error', e)
  }
}

async function loadSpotifySDKScript() {
  if (window.Spotify) return // 이미 로드됨

  await new Promise((resolve) => {
    const scriptTag = document.createElement('script')
    scriptTag.src = 'https://sdk.scdn.co/spotify-player.js'
    scriptTag.onload = () => resolve()
    document.body.appendChild(scriptTag)
  })
}

async function initSpotifyPlayer() {
  await loadSpotifySDKScript()

  return new Promise((resolve) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'My Web Player',
        getOAuthToken: (cb) => {
          cb(accessToken.value) // 🔥 유저 access_token
        },
        volume: 0.5,
      })

      player.addListener('ready', ({ device_id }) => {
        console.log('Spotify Player Ready with device_id:', device_id)
        spotifyPlayer.value = player
        spotifyDeviceId.value = device_id
        resolve()
      })

      player.addListener('initialization_error', ({ message }) =>
        console.error('init error', message),
      )
      player.addListener('authentication_error', ({ message }) =>
        console.error('auth error', message),
      )
      player.addListener('account_error', ({ message }) => console.error('account error', message))
      player.addListener('playback_error', ({ message }) =>
        console.error('playback error', message),
      )

      player.connect()
    }
  })
}

// 🔹 Spotify 추천/검색 API 호출
async function loadTracks() {
  const res = await fetch('http://localhost:3001/api/recommend')
  const data = await res.json()

  const pk = ref(1)

  tracks.value = data.tracks.items.map((t) => ({
    pk: pk.value++,
    id: t.id,
    title: t.name,
    artist: t.artists.map((a) => a.name).join(', '),
    albumImage: t.album?.images?.[0]?.url || '',
    previewUrl: t.preview_url ?? 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
    hasPreview: !!t.preview_url,
    mood: 'search',
    location: 'Spotify',
    spotifyUri: t.uri, // 나중에 SDK 재생용으로 쓸 수 있게
  }))

  if (tracks.value.length > 0) {
    currentIndex.value = 0
  }

  if (audioRef.value && currentTrack.value) {
    audioRef.value.load()
  }
}

// 🔹 (선택) 나중에 Web Playback SDK 붙일 거면 여기에서 initSpotifyPlayer() 호출
// async function initSpotifyPlayer() { ... }

onMounted(async () => {
  // 1️⃣ 토큰 먼저 확보

  if (!accessToken) {
    // 토큰 없으면 로그인 페이지로 보냄 (백엔드 /login 라우트)
    window.location.href = 'http://localhost:3001/login'
    return
  }

  // 2️⃣ (옵션) Web Playback SDK 초기화
  await initSpotifyPlayer()

  // 3️⃣ 그 다음에 트랙 로딩
  try {
    await loadTracks()
  } catch (err) {
    console.error('Spotify fetch error:', err)
  }
})

// 현재 곡 바뀌면 포인터/시간 초기화
watch(currentTrack, (newTrack) => {
  if (audioRef.value && newTrack) {
    audioRef.value.currentTime = 0
    currentTime.value = 0
    seekValue.value = 0
    audioRef.value.load()
    // 곡 바뀔 때 자동 재생하고 싶으면 여기서 호출:
    // playAudio()
  }
})

function playAudio() {
  if (!audioRef.value) return
  audioRef.value
    .play()
    .then(() => {
      isPlaying.value = true
    })
    .catch((err) => {
      console.error('재생 오류:', err)
    })
}

function togglePlay() {
  if (!currentTrack.value) return

  if (isPlaying.value) {
    pauseWithSpotify()
  } else {
    playWithSpotify()
  }
}

function prevTrack() {
  if (tracks.value.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + tracks.value.length) % tracks.value.length
  playAudio()
}

function nextTrack() {
  if (tracks.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % tracks.value.length
  playAudio()
}

function selectTrack(index) {
  currentIndex.value = index
  playAudio()
}

function onTimeUpdate() {
  if (!audioRef.value) return
  currentTime.value = audioRef.value.currentTime
  seekValue.value = audioRef.value.currentTime
}

function onLoadedMetadata() {
  if (!audioRef.value) return
  duration.value = audioRef.value.duration
}

function onEnded() {
  // 한 곡 끝나면 다음 곡 자동 재생
  nextTrack()
}

function seekAudio() {
  if (!audioRef.value) return
  audioRef.value.currentTime = seekValue.value
}

function formatTime(t) {
  if (!t || isNaN(t)) return '0:00'
  const minutes = Math.floor(t / 60)
  const seconds = Math.floor(t % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

onBeforeUnmount(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>

<style lang="scss" scoped>
.player-container {
  width: 600px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.current-track {
  display: flex;
  gap: 16px;
  align-items: center;
}

.album-cover {
  width: 96px;
  height: 96px;
  object-fit: cover;
}

.albumAndPlayButton {
  /* 사용 */
  position: relative;
}

.albumInfo {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.playButton {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.titleAndArtist {
  color: #fff;

  .currentTitle {
    font-size: 24px;
    font-weight: bold;
  }

  .currentArtist {
    font-size: 14px;
    opacity: 0.8;
  }
}

/*  */
.playBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.prevButton {
  color: white;
  background: none;
  border: none;
}
.nextButton {
  color: white;
  background: none;
  border: none;
}

.track-info .tag {
  margin-top: 6px;
  font-size: 0.85rem;
  color: #9ca3af;
}

.controls button {
  border: none;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  background: #f97316;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.controls button:disabled {
  background: #4b5563;
  cursor: not-allowed;
}

/* 시크바 */
.progress {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
  font-size: 0.8rem;
  color: #9ca3af;
}

.progress input[type='range'] {
  flex: 1;
}

/* 트랙 리스트 */
//  <span class="number">1</span>
//           <div class="text">
//             <div class="title">{{ track.title }}</div>
//             <div class="artist">{{ track.artist }}</div>
//           </div>
.number {
  color: #9ca3af;
  font-weight: 600;
}
.title {
  color: #f0f0f0;
}

.track-list h3 {
  margin: 0 0 10px;
  font-size: 1rem;
}

.track-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.track-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.track-list li:hover {
  background: rgba(148, 163, 184, 0.15);
}

.track-list li.active {
  background: rgba(249, 115, 22, 0.15);
}

.thumb {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
}

.text .title {
  font-size: 0.95rem;
}

.text .artist {
  font-size: 0.8rem;
  color: #9ca3af;
}

.text .sub {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
