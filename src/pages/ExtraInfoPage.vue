<template>
  <div class="page">
    <div class="container">
      <!-- Progress indicator -->
      <div class="progress">
        <div class="pill" :class="{ active: step >= 1 }">Artist</div>
        <div class="bar" :class="{ active: step >= 2 }"></div>
        <div class="pill" :class="{ active: step >= 2 }">Genre</div>
        <div class="bar" :class="{ active: step >= 3 }"></div>
        <div class="pill" :class="{ active: step >= 3 }">Song</div>
      </div>

      <!-- Header -->
      <div class="header">
        <h1 class="title">{{ stepTitle }}</h1>
        <p class="subtitle">원하는 옵션을 선택해 주세요</p>
      </div>

      <!-- Selection Grid -->
      <div class="grid">
        <button
          v-for="option in currentData"
          :key="option.id"
          type="button"
          class="card"
          :class="{ selected: isSelected(option.id) }"
          @click="toggleSelect(option.id)"
        >
          <div class="img-wrap">
            <img v-if="option.image" :src="option.image" :alt="option.name" class="img" />
            <div v-else class="avatar-fallback">{{ option.name?.slice(0, 2) }}</div>
          </div>

          <div class="text">
            <div class="name" :title="option.name">{{ option.name }}</div>
            <div v-if="option.subtitle" class="sub" :title="option.subtitle">
              {{ option.subtitle }}
            </div>
          </div>

          <!-- Selected Indicator -->
          <div v-if="isSelected(option.id)" class="selected-badge" aria-hidden="true">
            <!-- check icon -->
            <svg viewBox="0 0 24 24" class="check-icon">
              <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
            </svg>
          </div>
        </button>
      </div>

      <!-- Save Button -->
      <button class="save" type="button" :disabled="!canProceed" @click="handleSave">
        <span>{{ step < 3 ? '저장 후 다음' : '완료' }}</span>
        <!-- arrow-right -->
        <svg viewBox="0 0 24 24" class="arrow-icon" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 4l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8z"
            transform="scale(-1,1) translate(-24,0)"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import axiosApi from '@/api/axiosApi'

const ARTISTS = [
  { id: 31, name: '오혁' },
  { id: 32, name: 'FIFTY FIFTY' },
  { id: 33, name: '4Minute' },
  { id: 34, name: 'NewJeans' },
  { id: 35, name: 'Red Velvet' },
  { id: 36, name: '10CM' },
  { id: 37, name: '승리' },
  { id: 38, name: 'BIGBANG' },
  { id: 39, name: '소녀시대' },
  { id: 40, name: '길구봉구' },
  { id: 41, name: '경서' },
  { id: 42, name: '허각' },
  { id: 43, name: 'EXO' },
  { id: 44, name: '아이유' },
  { id: 45, name: '리쌍' },
  { id: 46, name: 'Yangpa' },
  { id: 47, name: '김하온' },
  { id: 48, name: '첸' },
  { id: 49, name: 'Hot Potato' },
  { id: 50, name: 'ILLIT' },
]

const GENRES = [
  { id: 20, name: 'K-발라드' },
  { id: 21, name: '케이팝' },
  { id: 22, name: '사운드트랙' },
  { id: 23, name: '한국 랩' },
  { id: 24, name: '한국 록' },
  { id: 25, name: '버블검 팝' },
  { id: 26, name: 'J-pop' },
  { id: 27, name: 'j-R&B' },
  { id: 28, name: '노이즈 음악' },
  { id: 29, name: '시티 팝' },
]

const SONGS = [
  {
    id: 30,
    name: '소녀',
    subtitle: '오혁',
    image: 'https://i.scdn.co/image/ab67616d0000b27398cebc1a9eb5555af0e1cade',
  },
  {
    id: 31,
    name: 'Cupid',
    subtitle: 'FIFTY FIFTY',
    image: 'https://i.scdn.co/image/ab67616d0000b273eb535219dc875690e09dd8f9',
  },
  {
    id: 32,
    name: '이름이 뭐예요?',
    subtitle: '4Minute',
    image: 'https://i.scdn.co/image/ab67616d0000b2739b2240d4c622dd529d9dc1ee',
  },
  {
    id: 33,
    name: 'Cookie',
    subtitle: 'NewJeans',
    image: 'https://i.scdn.co/image/ab67616d0000b2739d28fd01859073a3ae6ea209',
  },
  {
    id: 34,
    name: '피카부 (Peek-A-Boo)',
    subtitle: 'Red Velvet',
    image: 'https://i.scdn.co/image/ab67616d0000b2736538b8e1b5c7b2a9d2211769',
  },
  {
    id: 35,
    name: '스토커',
    subtitle: '10CM',
    image: 'https://i.scdn.co/image/ab67616d0000b2736c38e41f13abf275a8cf066f',
  },
  {
    id: 36,
    name: '셋 셀테니 (1, 2, 3!)',
    subtitle: '승리',
    image: 'https://i.scdn.co/image/ab67616d0000b27343a916c2fa6bc0cc3f63d123',
  },
  {
    id: 37,
    name: '쩔어 (GD&T.O.P)',
    subtitle: 'BIGBANG',
    image: 'https://i.scdn.co/image/ab67616d0000b273fd0d9a33127c1d3f58ba3504',
  },
  {
    id: 38,
    name: '훗 (Hoot)',
    subtitle: '소녀시대',
    image: 'https://i.scdn.co/image/ab67616d0000b2738836e229149c876eb60c7885',
  },
  {
    id: 39,
    name: '이 별',
    subtitle: '길구봉구',
    image: 'https://i.scdn.co/image/ab67616d0000b273526d6799731a72a8426c15ca',
  },
  {
    id: 40,
    name: '나의 X에게',
    subtitle: '경서',
    image: 'https://i.scdn.co/image/ab67616d0000b2739659451f3c10481af6a4587e',
  },
  {
    id: 41,
    name: '물론',
    subtitle: '허각',
    image: 'https://i.scdn.co/image/ab67616d0000b273d0d379eee69cf9d53c8f7b83',
  },
  {
    id: 42,
    name: 'Universe',
    subtitle: 'EXO',
    image: 'https://i.scdn.co/image/ab67616d0000b27382c1b5cc2b62cae85ef7ffdb',
  },
  {
    id: 43,
    name: '밤편지',
    subtitle: '아이유',
    image: 'https://i.scdn.co/image/ab67616d0000b273c06f0e8b33ac2d246158253e',
  },
  {
    id: 44,
    name: '나란 놈은 답은 너다 (feat. 하림)',
    subtitle: '리쌍',
    image: 'https://i.scdn.co/image/ab67616d0000b2739d2c67d5318d278ff7d6f4b9',
  },
  {
    id: 45,
    name: '사랑은 다 그런거래요',
    subtitle: 'Yangpa',
    image: 'https://i.scdn.co/image/ab67616d0000b273549ebd9968bb3a1385daa6aa',
  },
  {
    id: 46,
    name: '바코드 (Prod. GroovyRoom)',
    subtitle: '김하온',
    image: 'https://i.scdn.co/image/ab67616d0000b2732e60c813d04d2de52a7568e3',
  },
  {
    id: 47,
    name: '최고의 행운',
    subtitle: '첸',
    image: 'https://i.scdn.co/image/ab67616d0000b27394ef09fcc9d51d6515a67e94',
  },
  {
    id: 48,
    name: '고백',
    subtitle: 'Hot Potato',
    image: 'https://i.scdn.co/image/ab67616d0000b27340c8155542841bc57b60c36a',
  },
  {
    id: 49,
    name: 'Dumb Dumb',
    subtitle: 'Red Velvet',
    image: 'https://i.scdn.co/image/ab67616d0000b27371a70331062453ece06f8b79',
  },
]

// step: 1 | 2 | 3
const step = ref(1)

const selectedArtists = ref([])
const selectedGenres = ref([])
const selectedSongs = ref([])

const currentData = computed(() => {
  if (step.value === 1) return ARTISTS
  if (step.value === 2) return GENRES
  return SONGS
})

const currentSelection = computed(() => {
  if (step.value === 1) return selectedArtists.value
  if (step.value === 2) return selectedGenres.value
  return selectedSongs.value
})

const stepTitle = computed(() => {
  if (step.value === 1) return '좋아하는 아티스트를 선택하세요'
  if (step.value === 2) return '선호하는 장르를 선택하세요'
  return '좋아하는 곡을 선택하세요'
})

const isSelected = (id) => currentSelection.value.includes(id)

const toggleSelect = (id) => {
  const arr = currentSelection.value
  const exists = arr.includes(id)
  const next = exists ? arr.filter((x) => x !== id) : [...arr, id]

  if (step.value === 1) selectedArtists.value = next
  else if (step.value === 2) selectedGenres.value = next
  else selectedSongs.value = next
}

const canProceed = computed(() => currentSelection.value.length > 0)

const handleSave = async () => {
  if (step.value < 3) {
    step.value += 1
    return
  }

  try {
    await axiosApi.post('/members/preferences', {
      artist_ids: selectedArtists.value,
      music_ids: selectedSongs.value,
    })
    console.log('취향 저장 완료', {
      artist_ids: selectedArtists.value,
      music_ids: selectedSongs.value,
    })
  } catch (e) {
    console.error('취향 저장 실패', e)
  }
}
</script>

<style lang="scss" scoped>
$page-blue: oklch(0.75 0.15 195);

.page {
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.14), transparent 40%),
    radial-gradient(circle at 80% 10%, rgba(236, 72, 153, 0.12), transparent 42%),
    #05070c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.container {
  width: 100%;
  max-width: 672px; // max-w-2xl 느낌
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Progress */
.progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  height: 40px;
  padding: 0 16px;
  border-radius: 9999px;
  border: 2px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.45);
  font-weight: 700;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease;

  &.active {
    background: $page-blue;
    border-color: $page-blue;
    color: #000;
  }
}

.bar {
  width: 80px;
  height: 2px;
  background: rgba(255, 255, 255, 0.18);
  transition: background-color 180ms ease;

  &.active {
    background: $page-blue;
  }
}

/* Header */
.header {
  text-align: center;
  display: grid;
  gap: 8px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
}

.card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 14px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  cursor: pointer;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background-color 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.18);
    transform: translateY(-1px);
  }

  &.selected {
    border-color: $page-blue;
    box-shadow: 0 16px 40px rgba(99, 102, 241, 0.25);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(99, 102, 241, 0.08));
  }
}

.img-wrap {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.08);
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 16px;
  background: linear-gradient(135deg, #60a5fa, #a855f7, #ec4899);
  color: #0b0b10;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.text {
  min-width: 0;
  flex: 1;
  text-align: left;
}

.name {
  font-weight: 800;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

.sub {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Selected badge */
.selected-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: $page-blue;
  color: #000;
  display: grid;
  place-items: center;
}

.check-icon {
  width: 16px;
  height: 16px;
}

/* Save button */
.save {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: none;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition:
    opacity 150ms ease,
    background-color 150ms ease,
    color 150ms ease;

  background: $page-blue;
  color: #000;

  &:hover {
    opacity: 0.92;
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.35);
    cursor: not-allowed;
    opacity: 1;
  }
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: currentColor;
}
</style>
