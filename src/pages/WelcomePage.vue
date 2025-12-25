<template>
  <div class="page">
    <IntroVideo v-if="showIntro" @finished="onIntroFinished" @phase="onIntroPhase" />
    <div class="page-header">
      <HeaderBar />
    </div>

    <main class="main-container">
      <section class="content-container">
        <div v-if="showPlayer" class="player-spacer" ref="playerSpacerRef">
          <div v-if="recommendations.length" class="rec-heading">추천 음악</div>
          <div v-if="recommendations.length" class="rec-wrapper">
            <button
              v-if="showPrev"
              type="button"
              class="rec-nav rec-nav--prev"
              @click="scrollList(-1)"
            >
              ‹
            </button>
            <div class="rec-list" ref="recListRef" @scroll.passive="updateArrows">
              <div
                v-for="rec in recommendations"
                :key="rec.music_id || rec.spotify_id || rec.uri"
                class="rec-card"
                :class="{ active: selectedTrack?.uri === rec.uri }"
                @click="selectedTrack = rec"
              >
                <img :src="rec.album_image" alt="" />
                <div class="rec-meta">
                  <div class="rec-title">{{ rec.title }}</div>
                  <div class="rec-artist">{{ rec.artist_name }}</div>
                </div>
              </div>
            </div>
            <button
              v-if="showNext"
              type="button"
              class="rec-nav rec-nav--next"
              @click="scrollList(1)"
            >
              ›
            </button>
          </div>
        </div>
        <div class="prompt-container">
          <div class="content-1">
            <div class="mood-card">
              <div class="prompt">
                <label class="prompt__label">무드 입력</label>
                <span class="prompt__desc"> 사진과 문장으로 어울리는 음악을 추천해요 </span>
                <div class="prompt__col">
                  <div class="prompt__row">
                    <div class="file-upload-form">
                      <label for="file" class="file-upload-label">
                        <div
                          v-if="isLoading"
                          class="file-upload-design skeleton skeleton-upload"
                        ></div>
                        <div
                          v-else
                          class="file-upload-design"
                          @dragenter.prevent="onDragEnter"
                          @dragover.prevent="onDragOver"
                          @dragleave.prevent="onDragLeave"
                          @drop.prevent="onDrop"
                          @click="openFileDialog"
                        >
                          <template v-if="previewUrl">
                            <img :src="previewUrl" alt="preview" class="preview preview--compact" />
                            <div class="preview-actions" @click.stop>
                              <button class="chip" type="button" @click="openFileDialog">
                                바꾸기
                              </button>
                              <button class="chip chip--danger" type="button" @click="clearImage">
                                삭제
                              </button>
                            </div>
                          </template>
                          <template v-else>
                            <ImageUp class="upload-area" />
                            <span class="upload-area">이미지를 드래그하거나 클릭해 주세요</span>
                          </template>
                        </div>
                        <input
                          ref="fileInputRef"
                          class="file-input"
                          type="file"
                          accept="image/*"
                          @change="onFileChange"
                          :class="{ 'has-preview': !!previewUrl }"
                          :disabled="isLoading"
                        />
                      </label>
                    </div>

                    <template v-if="isLoading">
                      <div class="prompt__input skeleton skeleton-textarea"></div>
                    </template>
                    <template v-else>
                      <textarea
                        ref="textareaRef"
                        v-model="prompt"
                        class="prompt__input"
                        placeholder="예) 여행 중 찍은 사진이에요, 잔잔하고 감성적인 노래로 추천해 주세요."
                        @input="autoGrow"
                        @keydown.enter.exact.prevent="submit"
                      />
                    </template>
                  </div>
                  <div class="prompt-footer">
                    <p class="prompt__helper">팁: 업로드 한 사진의 분위기나 감정을 적어보세요</p>
                    <div class="prompt-footer-right">
                      <div class="ai-version">GPT-4.0-mini</div>
                      <button
                        type="button"
                        class="send-button"
                        :class="buttonStateClass"
                        :disabled="!canSubmit || isLoading"
                        @click="submit"
                      >
                        <template v-if="isLoading">
                          <span class="spinner" />
                        </template>
                        <template v-else>
                          <SendHorizontal size="18" />
                        </template>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="prompt">
              <label class="prompt__label">다가오는 일정</label>
              <span class="prompt__desc"> 소중한 사람들과 떠날 여행 일정이에요 </span>
              <UpcomingPlan />
            </div>
          </div>
          <div class="friend-container">
            <FriendList />
          </div>
        </div>
        <GeolocationAttractions />
      </section>
    </main>
    <MusicPlayer :externalTrack="selectedTrack" />
  </div>
</template>

<script setup>
import MusicPlayer from '@/components/main/MusicPlayer.vue'
import IntroVideo from '@/components/main/IntroVideo.vue'
import UpcomingPlan from '@/components/main/UpcomingPlan.vue'
import GeolocationAttractions from '@/components/main/GeolocationAttractions.vue'
import FriendList from '@/components/main/FriendList.vue'
import { ref, computed, onBeforeUnmount, nextTick, onMounted, watch } from 'vue'
import HeaderBar from '@/components/common/HeaderBar.vue'
import { SendHorizontal, ImageUp } from 'lucide-vue-next'
import { postMoodRecommendationsMock } from '@/api/recommendations'
import { gsap } from 'gsap'

const showIntro = ref(true)
const isSkeleton = ref(false)

const onIntroPhase = (phase) => {
  if (phase === 'shrink') {
    isSkeleton.value = true
  }
}

const onIntroFinished = () => {
  showIntro.value = false
  isSkeleton.value = false
}
const fileInputRef = ref(null)
const textareaRef = ref(null)
const playerSpacerRef = ref(null)
const recListRef = ref(null)

const isDragging = ref(false)
const file = ref(null)
const previewUrl = ref('')
const prompt = ref('')
const isLoading = ref(false)
const showPlayer = ref(false)
const recommendations = ref([])
const selectedTrack = ref(null)
const showPrev = ref(false)
const showNext = ref(false)

const canSubmit = computed(() => !!file.value)
const buttonStateClass = computed(() => {
  if (isLoading.value) return 'send-button--loading'
  if (canSubmit.value) return 'send-button--active'
  return ''
})

function openFileDialog() {
  fileInputRef.value?.click()
}

function setImage(selectedFile) {
  if (!selectedFile) return
  if (!selectedFile.type?.startsWith('image/')) return

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)

  file.value = selectedFile
  previewUrl.value = URL.createObjectURL(selectedFile)
}

function clearImage() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  file.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function onFileChange(e) {
  setImage(e.target.files?.[0])
}

function onDragEnter() {
  isDragging.value = true
}
function onDragOver() {
  isDragging.value = true
}
function onDragLeave() {
  isDragging.value = false
}
function onDrop(e) {
  isDragging.value = false
  setImage(e.dataTransfer?.files?.[0])
}

function runRevealAnimation() {
  const spacer = playerSpacerRef.value
  const cards = recListRef.value?.querySelectorAll('.rec-card')
  const tl = gsap.timeline()

  if (spacer) {
    const targetHeight = spacer.scrollHeight || 60
    tl.fromTo(
      spacer,
      { height: 0, opacity: 0 },
      {
        height: targetHeight,
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out',
        clearProps: 'height',
      },
    )
  }

  if (cards && cards.length) {
    tl.from(
      cards,
      {
        x: -40,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.05,
      },
      '-=0.15',
    )
  }
}

function updateArrows() {
  const el = recListRef.value
  if (!el) {
    showPrev.value = false
    showNext.value = false
    return
  }
  const maxScroll = el.scrollWidth - el.clientWidth - 2
  showPrev.value = el.scrollLeft > 2
  showNext.value = el.scrollLeft < maxScroll
}

function scrollList(direction) {
  const el = recListRef.value
  if (!el) return
  const card = el.querySelector('.rec-card')
  const step = card ? card.clientWidth + 14 : 200
  el.scrollBy({ left: step * 3 * direction, behavior: 'smooth' })
  setTimeout(updateArrows, 350)
}

watch(recommendations, () => {
  nextTick(() => updateArrows())
})

function submit() {
  if (!canSubmit.value || isLoading.value) return
  console.log('submit (prompt text은 전송하지 않음):', { prompt: prompt.value, file: file.value })

  isLoading.value = true

  postMoodRecommendationsMock()
    .then((res) => {
      const data = res.data?.data ?? res.data
      console.log('목업 추천 결과:', data)
      recommendations.value = data || []
      selectedTrack.value = null
      showPlayer.value = true
      // 입력 초기화
      prompt.value = ''
      clearImage()
      nextTick(() => {
        runRevealAnimation()
        updateArrows()
      })
    })
    .catch((err) => {
      console.error('목업 추천 호출 실패:', err)
    })
    .finally(() => {
      isLoading.value = false
    })
}

/** ✅ textarea 자동 높이 증가 + max 높이 이후 스크롤 */
const MAX_TEXTAREA_HEIGHT = 220 // 원하시면 260~320도 좋습니다

function autoGrow() {
  const el = textareaRef.value
  if (!el) return

  // 먼저 높이를 줄여서 실제 scrollHeight를 제대로 얻기
  el.style.height = 'auto'

  const next = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)
  el.style.height = `${next}px`

  // max를 넘으면 스크롤, 아니면 숨김
  el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden'
}

onMounted(async () => {
  await nextTick()
  autoGrow()
})

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<style lang="scss" scoped>
:global(:root) {
  --mood-accent-rgb: 0, 0, 0;
  --mood-glow-soft: rgba(0, 0, 0, 0);
  --mood-glow-strong: rgba(0, 0, 0, 0);
}
.prompt-container {
  width: 100%;
  max-width: 1460px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
}

.page-header {
  padding-top: 16px;
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(var(--mood-accent-rgb), 0.22),
    rgba(var(--mood-accent-rgb), 0.08),
    transparent
  );
  border-bottom: 1px solid rgba(var(--mood-accent-rgb), 0.24);
  box-shadow: 0 12px 30px rgba(var(--mood-accent-rgb), 0.18);
}

/* ✅ 검은 블러 막 (불꽃 위, 컨텐츠 아래) */
.right-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;

  /* 검은 막 + 살짝 그라데이션(더 고급짐) */
  background: radial-gradient(
    circle at 50% 30%,
    rgba(0, 0, 0, 0.35),
    rgba(0, 0, 0, 0.72) 70%,
    rgba(0, 0, 0, 0.82)
  );

  /* 블러 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  pointer-events: none; // ✅ 클릭 방해 금지
}

.player-container {
  width: 210px;
  height: 400px;
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translate(-50%, -10%);
}

.page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 18% 0%, var(--mood-glow-soft, rgba(34, 197, 94, 0.1)), transparent 36%),
    radial-gradient(circle at 82% 6%, var(--mood-glow-soft, rgba(34, 197, 94, 0.1)), transparent 36%),
    linear-gradient(180deg, #0b0f18 0%, #05070e 55%, #04060c 100%);
}

.main-container {
  width: 100%;
  display: flex;
  flex: 1;
  padding-bottom: 150px;
  position: relative;
}

.main-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 0%,
    var(--mood-glow-strong, rgba(34, 197, 94, 0.18)),
    transparent 52%
  );
  pointer-events: none;
  z-index: 0;
}

.friend-container {
  z-index: 3;
  flex: 0 0 340px;
  align-self: stretch;
  display: flex;
}

.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 32px;
  padding: 32px 16px;
  position: relative;
  z-index: 1;
}

.mood-card {
  width: 100%;
  max-width: 1460px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.prompt {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.prompt__label {
  font-size: 22px;
  font-weight: 700;
  color: white;
}

.prompt__col {
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid #3d444d;
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 0.75rem;
  overflow: hidden;

  &:focus-within {
    border: 0.0625rem solid #1f6feb;
  }
}

.prompt__row {
  width: 100%;
  display: flex;
}

.file-upload-form {
  width: 65%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

.file-upload-label {
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: #000;
  padding: 18px 28px;
  border-radius: 16px;
  border: 2px dashed #666;
  box-shadow: 0px 0px 200px -50px rgba(0, 0, 0, 0.5);
  color: #eee;
  user-select: none;
}

.file-upload-label input {
  display: none;
}

.file-upload-label:has(.preview) {
  padding: 0;
}

.file-upload-label.has-preview {
  padding: 0;
}

.file-upload-design {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
}

.file-upload-design svg {
  height: 46px;
  width: 46px;
  fill: #666;
  margin-bottom: 10px;
}

.browse-button {
  background-color: #666;
  padding: 6px 14px;
  border-radius: 10px;
  color: #eee;
  transition: all 0.3s;
}

.browse-button:hover {
  background-color: #888;
  color: #fff;
}

/* preview */
.preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  display: block;
}

.upload-area {
  color: rgba(244, 244, 245, 0.55);
}

.preview-actions {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: flex;
  gap: 8px;
  z-index: 2;
}

.prompt__desc {
  font-size: 12px;
  line-height: 1.4;
  color: rgba(244, 244, 245, 0.55);
  margin-top: 2px;

  display: inline-block;
}

.chip {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(20, 20, 26, 0.62);
  color: rgba(255, 255, 255, 0.9);
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.chip--danger {
  border-color: rgba(255, 107, 107, 0.35);
}

/* ===== Textarea ===== */
.prompt__input {
  width: 100%;
  min-height: 120px;
  max-height: 220px;
  border: none;
  background-color: transparent;
  color: rgba(244, 244, 245, 0.92);
  font-size: 14px;
  padding: 14px 16px 12px;
  outline: none;
  resize: none;
  line-height: 1.5;
  overflow-y: hidden;

  &::placeholder {
    color: rgba(244, 244, 245, 0.45);
  }
}

/* Scrollbar */
.prompt__input::-webkit-scrollbar {
  width: 8px;
}
.prompt__input::-webkit-scrollbar-track {
  background: transparent;
}
.prompt__input::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
}
.prompt__input::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.28);
}

/* Firefox */
.prompt__input {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.22) transparent;
}

.prompt-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background-color: inherit;
  padding: 12px 12px 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.content-1 {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  width: 100%;
  flex: 1 1 0;
}

.prompt__helper {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(244, 244, 245, 0.55);
}

.prompt-footer-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-version {
  font-size: 14px;
  font-weight: 400;
  color: rgb(145, 152, 161);
}

.send-button {
  display: flex;
  align-items: center;
  background: none;
  outline: none;
  border: none;
  color: rgb(145, 152, 161);
  width: fit-content;
  cursor: pointer;
}

.send-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.send-button--active {
  color: #22c55e;
}

.send-button--loading {
  color: #9ca3af;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #22c55e;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Skeleton styles */
.skeleton {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: translateX(-100%);
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.skeleton-upload {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.skeleton-textarea {
  width: 100%;
  height: 200px;
  border-radius: 0 0 12px 12px;
}

.player-spacer {
  width: 100%;
  min-height: 48px;
  padding: 8px 0 0;
}

.rec-wrapper {
  position: relative;
}

.rec-list {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 330px;
  gap: 18px;
  overflow-x: hidden;
  padding: 4px 36px;
}

.rec-card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;
}

.rec-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 16px;
}

.rec-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  text-align: left;
}

.rec-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rec-artist {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.3;
}

.rec-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

.rec-card.active {
  background: rgba(var(--mood-accent-rgb), 0.12);
  box-shadow: 0 10px 32px rgba(var(--mood-accent-rgb), 0.28);
  border: 1px solid rgba(var(--mood-accent-rgb), 0.36);
}

.rec-heading {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px 4px;
}

.rec-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 64px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 10, 12, 0.8);
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.rec-nav:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-50%) scale(1.05);
}

.rec-nav--prev {
  left: 4px;
}

.rec-nav--next {
  right: 4px;
}
</style>
