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

const props = defineProps({
  tracks: {
    type: Array,
    default: () => [],
  },
})

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

const tracks = computed(() => props.tracks)
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
  if (window.Spotify) return

  await new Promise((resolve) => {
    const scriptTag = document.createElement('script')
    scriptTag.src = 'https://sdk.scdn.co/spotify-player.js'
    scriptTag.onload = () => resolve()
    document.body.appendChild(scriptTag)
  })
}

async function initSpotifyPlayer() {
  if (window.Spotify) {
    return createPlayer()
  }

  await loadSpotifySDKScript()
  return waitForSpotifyObject()
}

function waitForSpotifyObject() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.Spotify) {
        clearInterval(interval)
        resolve(createPlayer())
      }
    }, 50)
  })
}

function createPlayer() {
  return new Promise((resolve) => {
    const player = new window.Spotify.Player({
      name: 'My Web Player',
      getOAuthToken: (cb) => cb(accessToken.value),
      volume: 0.5,
    })

    player.addListener('ready', ({ device_id }) => {
      console.log('Player ready:', device_id)
      spotifyPlayer.value = player
      spotifyDeviceId.value = device_id
      resolve()
    })

    player.connect()
  })
}

onMounted(async () => {
  if (!accessToken.value) {
    window.location.href = 'http://localhost:3001/login'
    return
  }

  await initSpotifyPlayer()
})

// 현재 곡 바뀌면 포인터/시간 초기화
watch(currentTrack, (newTrack) => {
  if (audioRef.value && newTrack) {
    audioRef.value.currentTime = 0
    currentTime.value = 0
    seekValue.value = 0
    audioRef.value.load()
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
  if (!tracks.value.length) return
  currentIndex.value = (currentIndex.value - 1 + tracks.value.length) % tracks.value.length
  playAudio()
}

function nextTrack() {
  if (!tracks.value.length) return
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
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  z-index: 10;
}

/* 이하 스타일은 그대로 사용 */
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

.playBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.prevButton,
.nextButton {
  color: white;
  background: none;
  border: none;
}

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

.number {
  color: #9ca3af;
  font-weight: 600;
}
.title {
  color: #f0f0f0;
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
  cursor: pointer;
  transition: background 0.15s ease;
}

.track-list li:hover {
  background: rgba(148, 163, 184, 0.15);
}

.track-list li.active {
  background: rgba(249, 115, 22, 0.15);
}

.text .title {
  font-size: 0.95rem;
}

.text .artist {
  font-size: 0.8rem;
  color: #9ca3af;
}
</style>
