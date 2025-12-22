<template>
  <div class="page">
    <div class="page-header">
      <HeaderBar />
    </div>

    <main class="main-container">
      <div class="left">
        <!-- <FireWorks /> -->
        <!-- <ShootingStars class="bg" :count="40" /> -->
        <AttractionRecommendations />
      </div>

      <!--TODO: 컨테이너 아래로 내려가면서 음악 추천-->
      <section class="content-container">
        <div class="mood-card">
          <div class="prompt">
            <label class="prompt__label">무드 입력</label>
            <span class="prompt__desc"> 사진과 문장으로 어울리는 음악을 추천해요 </span>
            <div class="prompt__col">
              <div class="prompt__row">
                <div class="file-upload-form">
                  <label for="file" class="file-upload-label">
                    <div
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
                          <button class="chip" type="button" @click="openFileDialog">바꾸기</button>
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
                    />
                  </label>
                </div>

                <textarea
                  ref="textareaRef"
                  v-model="prompt"
                  class="prompt__input"
                  placeholder="예) 여행 중 찍은 사진이에요, 잔잔하고 감성적인 노래로 추천해 주세요."
                  @input="autoGrow"
                  @keydown.enter.exact.prevent="submit"
                />
              </div>
              <div class="prompt-footer">
                <p class="prompt__helper">팁: 업로드 한 사진의 분위기나 감정을 적어보세요</p>
                <div class="prompt-footer-right">
                  <div class="ai-version">GPT-4.0-mini</div>
                  <button type="button" class="send-button" :disabled="!canSubmit" @click="submit">
                    <SendHorizontal size="18" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TrendAttractions />
      </section>

      <div class="right">
        <!-- <FireWorks /> -->
        <!-- <ShootingStars class="bg" :count="40" /> -->
        <div class="friend-container">
          <FriendList />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AttractionRecommendations from '@/components/main/AttractionRecommendations.vue'
import ShootingStars from '@/components/main/ShootingStars.vue'
import FireWorks from '@/components/main/FireWorks.vue'
import TrendAttractions from '@/components/main/UpcomingAttractions.vue'
import FriendList from '@/components/main/FriendList.vue'
import { ref, computed, onBeforeUnmount, nextTick, onMounted } from 'vue'
import HeaderBar from '@/components/common/HeaderBar.vue'
import { SendHorizontal, ImageUp } from 'lucide-vue-next'

const fileInputRef = ref(null)
const textareaRef = ref(null)

const isDragging = ref(false)
const file = ref(null)
const previewUrl = ref('')
const prompt = ref('')

const canSubmit = computed(() => !!prompt.value.trim() && !!file.value)

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

function submit() {
  if (!canSubmit.value) return
  console.log('submit:', { prompt: prompt.value, file: file.value })
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
.page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  width: 100%;
  display: flex;
  flex: 1;
}

.left,
.right {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 25%;
}

.friend-container {
  position: absolute;
  inset: 0;
  left: 12px;
  top: 32px;
}

.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 32px;
  padding: 32px 16px;
}

.mood-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.prompt {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
</style>
