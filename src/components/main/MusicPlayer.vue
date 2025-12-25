<template>
  <div class="player-bar" :style="barStyle" role="region" aria-label="Music Player">
    <!-- 왼쪽: 재생 버튼 + 곡 정보 -->
    <div class="left">
      <button class="play-btn" type="button" aria-label="Play/Pause" @click="togglePlay">
        {{ isPlaying ? '❚❚' : '▶' }}
      </button>

      <div class="cover" aria-hidden="true">
        <img v-if="album_image" :src="album_image" alt="" />
        <div v-else class="cover-fallback">♫</div>
      </div>

      <div class="meta">
        <div class="title" :title="title">{{ title }}</div>
        <div class="artist" :title="artist">{{ artist }}</div>
      </div>
    </div>

    <!-- 가운데: 무드 버튼만 -->
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
        <span class="emoji">{{ m.emoji }}</span>
        <span class="label">{{ m.label }}</span>
      </button>
    </div>

    <!-- 오른쪽: 볼륨 -->
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

    <!-- 아래: 재생바(전체 폭) -->
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
import { computed, ref, onMounted } from 'vue'

/** ✅ 분위기 태그 (4개) */
const moods = [
  { key: '힐링', label: '힐링', emoji: '🌿' },
  { key: '청량', label: '청량', emoji: '🌊' },
  { key: '감성', label: '감성', emoji: '🌙' },
  { key: '에너지', label: '에너지', emoji: '🔥' },
]

/** ✅ public/audio/ 에 MP3 넣어두기 */
const moodConfig = {
  힐링: {
    accent: '163, 177, 138',
    tracks: [
      { title: 'Quiet Morning', artist: 'Free Library', src: '/audio/healing-01.mp3' },
      { title: 'Soft Breeze', artist: 'Free Library', src: '/audio/healing-02.mp3' },
    ],
  },
  청량: {
    accent: '126, 214, 223',
    tracks: [{ title: 'Sunny Walk', artist: 'Free Library', src: '/audio/fresh-01.mp3' }],
  },
  감성: {
    accent: '108, 99, 255',
    tracks: [{ title: 'Late Night', artist: 'Free Library', src: '/audio/emotion-01.mp3' }],
  },
  에너지: {
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

const selectedMood = ref('힐링')

/** ✅ UI 상태 */
const title = ref('선택된 음악 없음')
const artist = ref('TravelTune')
const album_image = ref('')

const isPlaying = ref(false)
const isMuted = ref(false)

const duration = ref(0)
const currentTime = ref(0)
const volume = ref(0.75)

const audioRef = ref(null)

const barStyle = computed(() => {
  const accent = moodConfig[selectedMood.value]?.accent ?? '255,255,255'
  return { '--accent': accent }
})

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

  // ✅ 새 곡 세팅
  a.src = track.src
  a.currentTime = 0
  applyAudioSettings()

  try {
    await a.play()
    // play 이벤트에서 isPlaying=true로 맞춰짐
  } catch {
    // 자동재생 정책 등으로 실패할 수 있음
    isPlaying.value = false
  }
}

const selectMood = async (mood) => {
  selectedMood.value = mood
  const list = moodConfig[mood]?.tracks ?? []
  if (!list.length) return
  await playTrack(pickRandom(list))
}

const togglePlay = async () => {
  const a = audioRef.value
  if (!a) return

  // 아직 src가 없으면 현재 mood에서 하나 틀기
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
    } catch {
      isPlaying.value = false
    }
  } else {
    a.pause()
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

/** ✅ 재생바 반영용 */
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
  // ✅ 끝나면 같은 mood에서 랜덤으로 다음 곡
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

onMounted(() => {
  // 초기 볼륨 적용 (사용자가 바로 play 눌러도 동일 볼륨)
  applyAudioSettings()
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
  grid-template-columns: 1.6fr 2fr 1fr; /* 왼 / 가운데(무드) / 오른 */
  grid-template-rows: 1fr auto; /* 위(컨텐츠) / 아래(프로그레스) */
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

/* ✅ 태그 영역 */
.moods {
  grid-column: 2;
  grid-row: 1;

  display: flex;
  justify-content: center; /* ✅ 가운데 정렬 */
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

  .emoji {
    font-size: 16px;
  }
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

/* 왼쪽 */
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

/* 가운데 */
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

/* 버튼들 */
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

/* 오른쪽 */
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

/* 반응형 */
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
