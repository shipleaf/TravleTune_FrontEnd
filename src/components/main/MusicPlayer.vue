<template>
  <div class="player-bar" :style="barStyle" role="region" aria-label="Music Player">
    <div class="left">
      <button class="play-btn" type="button" aria-label="Play/Pause" @click="togglePlay">
        {{ isPlaying ? '⏸' : '▶' }}
      </button>

      <div class="cover" aria-hidden="true">
        <img v-if="album_image" :src="album_image" alt="" />
        <div v-else class="cover-fallback">♪</div>
      </div>

      <div class="meta">
        <div class="title" :title="title">{{ title }}</div>
        <div class="artist" :title="artist">{{ artist }}</div>
      </div>
    </div>

    <div class="moods" role="tablist" aria-label="Travel moods">
      <button
        v-for="m in moods"
        :key="m.key"
        type="button"
        class="mood-chip"
        :class="{ 'is-active': selectedMood === m.key }"
        @click="selectMood(m.key)"
        role="tab"
        :aria-selected="selectedMood === m.key"
      >
        <span class="label">{{ m.label }}</span>
      </button>
    </div>

    <div class="right">
      <button class="chip" type="button" @click="toggleMute">
        {{ isMuted ? 'Muted' : 'Volume' }}
      </button>

      <input
        class="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="volume"
        @input="onVolume"
        aria-label="Volume"
      />
    </div>

    <div class="progress-row">
      <span class="time">{{ formatTime(currentTime) }}</span>

      <input
        class="progress"
        type="range"
        min="0"
        :max="duration || 0"
        step="0.1"
        :value="currentTime"
        @input="onSeek"
        aria-label="Seek"
      />

      <span class="time">{{ formatTime(duration) }}</span>
    </div>

    <audio
      ref="audioRef"
      preload="metadata"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMeta"
      @durationchange="onDurationChange"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useSpotifyStore } from '@/stores/spotify'
import { storeToRefs } from 'pinia'

const props = defineProps({
  externalTrack: {
    type: Object,
    default: null,
  },
})

const moods = [
  { key: 'healing', label: '힐링' },
  { key: 'fresh', label: '상큼' },
  { key: 'emo', label: '감성' },
  { key: 'energy', label: '에너지' },
]

const moodConfig = {
  healing: {
    accent: '163, 177, 138',
    tracks: [
      {
        title: 'apart',
        artist: 'sumu',
        album_image: '/src/assets/album/sumu.jpg',
        src: '/src/assets/music/sumu - apart [NCS Release].mp3',
      },
    ],
  },
  fresh: {
    accent: '126, 214, 223',
    tracks: [
      {
        title: 'Magnetic',
        artist: 'springs!',
        album_image: '/src/assets/album/springs!.jpg',
        src: '/src/assets/music/springs! - Magnetic [NCS Release].mp3',
      },
    ],
  },
  emo: {
    accent: '108, 99, 255',
    tracks: [
      {
        title: 'No Way',
        artist: 'BIMINI, Avi Snow',
        album_image: '/src/assets/album/BIMIBI.jpg',
        src: '/src/assets/music/BIMINI, Avi Snow - No Way (with Avi Snow) [NCS Release].mp3',
      },
    ],
  },
  energy: {
    accent: '239, 35, 60',
    tracks: [
      {
        title: 'Blank (HYLO Remix)',
        artist: 'Disfigure',
        album_image: '/src/assets/album/blank.jpg',
        src: '/src/assets/music/Disfigure, HYLO - Blank (HYLO Remix) [NCS Release].mp3',
      },
    ],
  },
}

const selectedMood = ref(null)
const title = ref('재생할 곡을 선택해 주세요')
const artist = ref('TravelTune')
const album_image = ref('')

const isPlaying = ref(false)
const isMuted = ref(false)
const duration = ref(0)
const currentTime = ref(0)
const volume = ref(0.75)
const audioRef = ref(null)

const spotifyStore = useSpotifyStore()
const { accessToken } = storeToRefs(spotifyStore)

const barStyle = computed(() => {
  const accent = moodConfig[selectedMood.value]?.accent
  if (!accent) {
    return {
      '--accent': '255,255,255',
      background: 'rgba(10,10,12,0.92)',
      borderColor: 'rgba(255,255,255,0.08)',
      boxShadow: '0 18px 55px rgba(0,0,0,0.35), 0 2px 0 rgba(255,255,255,0.04) inset',
    }
  }
  return {
    '--accent': accent,
    background: `radial-gradient(circle at 16% 18%, rgba(${accent},0.18), rgba(${accent},0.08) 32%, rgba(10,10,12,0.9))`,
    borderColor: `rgba(${accent},0.25)`,
    boxShadow: `0 18px 55px rgba(${accent},0.25), 0 2px 0 rgba(255,255,255,0.04) inset`,
  }
})

const applyThemeVars = () => {
  const accent = moodConfig[selectedMood.value]?.accent
  const fallbackAccent = '0,0,0'
  const useAccent = accent || fallbackAccent
  const soft = accent ? `rgba(${useAccent},0.10)` : 'rgba(0,0,0,0)'
  const strong = accent ? `rgba(${useAccent},0.18)` : 'rgba(0,0,0,0)'
  const root = document.documentElement
  if (!root?.style) return
  root.style.setProperty('--mood-accent-rgb', useAccent)
  root.style.setProperty('--mood-glow-soft', soft)
  root.style.setProperty('--mood-glow-strong', strong)
}

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

const applyAudioSettings = () => {
  const a = audioRef.value
  if (!a) return
  a.volume = volume.value
  a.muted = isMuted.value
}

const playTrack = async (track) => {
  const a = audioRef.value
  if (!a || !track?.src) return
  title.value = track.title
  artist.value = track.artist
  album_image.value = track.album_image
  a.src = track.src
  a.currentTime = 0
  applyAudioSettings()
  try {
    await a.play()
    isPlaying.value = true
  } catch (e) {
    console.error('재생 실패:', e)
    isPlaying.value = false
  }
}

const selectMood = async (mood) => {
  selectedMood.value = mood
  applyThemeVars()
  const list = moodConfig[mood]?.tracks ?? []
  if (!list.length) return
  await playTrack(pickRandom(list))
}

const togglePlay = async () => {
  const a = audioRef.value
  if (!a) return
  if (!a.src) {
    const list = moodConfig[selectedMood.value]?.tracks ?? []
    if (!list.length) return
    await playTrack(pickRandom(list))
    return
  }
  if (a.paused) {
    try {
      applyAudioSettings()
      await a.play()
      isPlaying.value = true
    } catch (e) {
      console.error('재생 실패:', e)
      isPlaying.value = false
    }
  } else {
    a.pause()
    isPlaying.value = false
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  const a = audioRef.value
  if (a) a.muted = isMuted.value
}

const onSeek = (e) => {
  const a = audioRef.value
  if (!a) return
  a.currentTime = Number(e.target.value)
  currentTime.value = a.currentTime
}

const onVolume = (e) => {
  volume.value = Number(e.target.value)
  const a = audioRef.value
  if (a) a.volume = volume.value
}

const onTimeUpdate = () => {
  const a = audioRef.value
  if (!a) return
  currentTime.value = a.currentTime || 0
}

const onLoadedMeta = () => {
  const a = audioRef.value
  if (!a) return
  duration.value = Number.isFinite(a.duration) ? a.duration : 0
}

const onDurationChange = () => {
  const a = audioRef.value
  if (!a) return
  duration.value = Number.isFinite(a.duration) ? a.duration : 0
}

const onPlay = () => {
  isPlaying.value = true
}
const onPause = () => {
  isPlaying.value = false
}

const onEnded = async () => {
  const list = moodConfig[selectedMood.value]?.tracks ?? []
  if (!list.length) return
  await playTrack(pickRandom(list))
}

const formatTime = (sec) => {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

async function hasActiveDevice() {
  if (!accessToken.value) return false
  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
    if (!res.ok) return false
    const body = await res.json()
    const devices = body?.devices ?? []
    const active = devices.find((d) => d.is_active)
    if (active) return true

    // 활성 디바이스가 없으면 기본 디바이스로 전환
    const target = devices[0]
    if (target?.id) {
      await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_ids: [target.id], play: false }),
      })
      return true
    }
    return false
  } catch (e) {
    console.warn('Spotify 디바이스 조회 실패', e)
    return false
  }
}

async function playOnSpotify(uri) {
  if (!uri || !accessToken.value) return false
  const hasDevice = await hasActiveDevice()
  if (!hasDevice) {
    console.warn('활성 Spotify 디바이스가 없어 프리뷰로 폴백합니다.')
    return false
  }
  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] }),
    })
    if (!res.ok) {
      let reason = ''
      try {
        const body = await res.json()
        reason = body?.error?.reason || body?.error?.message
      } catch {
        /* ignore */
      }
      console.warn('Spotify play 실패', res.status, reason || res.statusText)
      return false
    }
    return true
  } catch (e) {
    console.error('Spotify play 요청 에러', e)
    return false
  }
}

const fallbackExternalSrc = '/audio/healing-01.mp3'
const playExternal = async (ext) => {
  if (!ext) return
  title.value = ext.title || 'Unknown Title'
  artist.value = ext.artist_name || ext.artist || 'Unknown Artist'
  album_image.value = ext.album_image || ''

  // Spotify URI가 있고 토큰이 있으면 Spotify 재생 시도
  if (ext.uri && accessToken.value) {
    const ok = await playOnSpotify(ext.uri)
    if (ok) {
      isPlaying.value = true
      return
    }
  }

  const src = ext.preview_url || ext.previewUrl || fallbackExternalSrc
  await playTrack({
    title: title.value,
    artist: artist.value,
    album_image: album_image.value,
    src,
  })
}

watch(
  () => props.externalTrack,
  async (val) => {
    if (val) {
      await playExternal(val)
    }
  },
)

watch(selectedMood, () => applyThemeVars())

onMounted(() => {
  applyAudioSettings()
  applyThemeVars()
})
</script>

<style lang="scss" scoped>
.player-bar {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  z-index: 2000;

  width: 80%;
  height: 120px;

  display: grid;
  grid-template-columns: 1.6fr 2fr 1fr;
  grid-template-rows: 1fr auto;
  gap: 10px 16px;

  padding: 12px 3%;
  border-radius: 18px;

  background: rgba(10, 10, 12, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 18px 55px rgba(0, 0, 0, 0.35),
    0 2px 0 rgba(255, 255, 255, 0.04) inset;
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.92);

  --accent: 255, 255, 255;
}

.moods {
  grid-column: 2;
  grid-row: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  overflow: hidden;
}

.mood-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 14px;
  border-radius: 999px;

  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);

  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  .label {
    font-size: 0.9rem;
    font-weight: 650;
    white-space: nowrap;
  }

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
  }

  &.is-active {
    border-color: rgba(var(--accent), 0.65);
    background: rgba(var(--accent), 0.14);
    box-shadow: 0 0 0 1px rgba(var(--accent), 0.22);
  }
}

.left {
  grid-column: 1;
  grid-row: 1;

  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.cover {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
.cover-fallback {
  font-size: 18px;
  opacity: 0.85;
}
.meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.title {
  font-size: 0.95rem;
  font-weight: 650;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.artist {
  font-size: 0.82rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.center {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn,
.chip {
  border: none;
  outline: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition:
    transform 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease;
}
.play-btn {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;

  border: 1px solid rgba(var(--accent), 0.55);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;

  box-shadow: 0 0 0 1px rgba(var(--accent), 0.18);
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}
.play-btn:hover {
  background: rgba(var(--accent), 0.12);
  transform: translateY(-1px);
}

.progress-row {
  grid-column: 1 / -1;
  grid-row: 2;

  display: grid;
  grid-template-columns: 44px 1fr 44px;
  gap: 10px;
  align-items: center;
}
.time {
  font-size: 0.78rem;
  opacity: 0.7;
  text-align: center;
}
.progress {
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: rgba(var(--accent), 0.95);
    border: 2px solid rgba(0, 0, 0, 0.25);
  }
}

.right {
  grid-column: 3;
  grid-row: 1;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.chip {
  height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 0.82rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
}
.volume {
  width: 120px;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: rgba(var(--accent), 0.95);
    border: 2px solid rgba(0, 0, 0, 0.25);
  }
}

@media (max-width: 720px) {
  .player-bar {
    width: calc(100% - 18px);
    height: auto;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    gap: 12px;
  }
  .right {
    justify-content: space-between;
  }
  .volume {
    width: 100%;
  }
}
</style>
