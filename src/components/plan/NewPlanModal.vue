<template>
  <div v-if="modelValue" class="modal" role="dialog" aria-modal="true" :aria-label="title">
    <div class="modal__overlay" @click="close" />
    <article class="modal-container" @click.stop>
      <header class="modal-container-header">
        <div class="modal-container-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-calendar-plus-icon lucide-calendar-plus"
          >
            <path d="M16 19h6" />
            <path d="M16 2v4" />
            <path d="M19 16v6" />
            <path d="M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5" />
            <path d="M3 10h18" />
            <path d="M8 2v4" />
          </svg>
          <span>새로운 여행</span>
        </div>

        <button class="icon-button" type="button" aria-label="Close" @click="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              fill="currentColor"
              d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
            />
          </svg>
        </button>
      </header>

      <section class="modal-container-body rtf">
        <Transition name="slide-left" mode="out-in">
          <div class="step-wrapper" :key="createModalStep">
            <div class="select-region-header" v-if="createModalStep === 1">
              <h3>날짜를 선택해 주세요.</h3>
            </div>
            <VDatePicker
              v-if="createModalStep === 1"
              v-model.range="range"
              borderless
              expanded
              :rows="2"
              class="my-calendar"
            />
            <PlanModalStepOne v-else-if="createModalStep === 2" />
            <PlanModalStepTwo v-else-if="createModalStep === 3" />
          </div>
        </Transition>
      </section>

      <footer class="modal-container-footer">
        <button v-if="createModalStep > 1" class="button is-ghost" type="button" @click="prevStep">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-move-left-icon lucide-move-left"
          >
            <path d="M6 8L2 12L6 16" />
            <path d="M2 12H22" />
          </svg>
          이전
        </button>
        <button
          class="button is-primary"
          type="button"
          :disabled="!canGoNext"
          @click="createModalStep === 3 ? createTrip() : nextStep()"
        >
          {{ createModalStep === 3 ? '여행 생성' : '다음' }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-plus-icon lucide-plus"
            v-if="createModalStep === 3"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-move-right-icon lucide-move-right"
            v-else
          >
            <path d="M18 8L22 12L18 16" />
            <path d="M2 12H22" />
          </svg>
        </button>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import PlanModalStepOne from './PlanModalStepOne.vue'
import PlanModalStepTwo from './PlanModalStepTwo.vue'
import { useTripStore } from '@/stores/trip'
import { storeToRefs } from 'pinia'
import { createTrip as createTripApi } from '@/api/tripApi'

const store = useTripStore()

const { selectedSido, selectedGungu, tripTitle, tripDescription, invitedUsers, image_url } =
  storeToRefs(store)

const range = ref({
  start: '',
  end: '',
})

/**
 * ✅ start만 선택된 경우(end가 비었으면) end를 start로 자동 세팅
 * (VDatePicker가 Date 객체를 줄 수도 있어서 그대로 복사)
 */
watch(
  () => range.value.start,
  (s) => {
    if (s && !range.value.end) {
      range.value.end = s
    }
  },
)

const canGoNext = computed(() => {
  // step 1: 날짜 필수
  if (createModalStep.value === 1) {
    return !!range.value.start && !!range.value.end
  }

  // step 2: 시도 필수(군구 optional)
  if (createModalStep.value === 2) {
    return !!selectedSido.value
  }

  // step 3: 제목 + 설명 필수
  if (createModalStep.value === 3) {
    return !!tripTitle.value?.trim() && !!tripDescription.value?.trim()
  }

  return true
})

defineProps({
  modelValue: { type: Boolean, default: true },
})

const createModalStep = ref(1)

const emit = defineEmits(['update:modelValue', 'accept', 'decline', 'close'])

const prevStep = () => {
  createModalStep.value -= 1
}

const nextStep = () => {
  if (!canGoNext.value) return
  createModalStep.value += 1
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
  createModalStep.value = 1
  console.log(createModalStep.value)
  store.reset()
  range.value = { start: '', end: '' }
}

const formatDate = (v) => {
  if (!v) return ''
  if (typeof v === 'string') return v // 이미 "2025-05-01" 형태면 그대로
  const d = new Date(v)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const createTrip = async () => {
  if (!canGoNext.value) return

  const data = {
    title: tripTitle.value?.trim(),
    start_date: formatDate(range.value.start),
    end_date: formatDate(range.value.end),
    sido_code: Number(selectedSido.value),
    gungu_code: selectedGungu.value ? Number(selectedGungu.value) : null,
    description: tripDescription.value?.trim(),
    image_url: image_url.value || null, // base64 (data:image/... 포함)
  }

  try {
    const res = await createTripApi(data)

    // 예: 생성 성공 후 trip_id가 온다고 가정
    // const tripId = res?.data?.data?.trip_id

    // 초대 멤버 처리(별도 API가 있다면 여기서)
    console.log('createTrip success:', res?.data)

    // 모달 닫기 + 초기화
    close()
  } catch (error) {
    console.error('createTrip failed:', error)
  }
}
</script>

<style lang="scss" scoped>
.modal-container-body :deep(.vc-header button) {
  background: none;
}

.select-region-header {
  color: black;
  flex: 0 0 auto;
}

.modal {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: grid;
  place-items: center;
}

.modal__overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(#000, 0.25);
}

.modal-container {
  position: relative;
  z-index: 1;

  min-height: 700px;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 30px 0 rgba(#000, 0.25);

  @media (max-width: 600px) {
    width: 90%;
  }
}

.modal-backdrop-button {
  position: fixed;
  inset: 0;
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
}

/* 원본 style.scss에서 modal~ 이하를 그대로 이식 */
.modal-container {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  height: 900px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 30px 0 rgba(#000, 0.25);

  @media (max-width: 600px) {
    width: 90%;
  }
}

.modal-container-header {
  padding: 16px 32px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
}

.modal-container-title {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
  font-weight: 700;
  font-size: 1.25rem;
}

.modal-container-body {
  padding: 24px 32px 51px;
  overflow-y: auto;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.modal-container-footer {
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #ddd;
  gap: 12px;
  position: relative;

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: -51px;
    left: 24px;
    right: 24px;
    height: 50px;
    flex-shrink: 0;
    background-image: linear-gradient(to top, rgba(#fff, 0.75), transparent);
    pointer-events: none;
  }
}

.button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: transparent;
  border: 0;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s ease;

  &.is-ghost {
    &:hover,
    &:focus {
      background-color: #dfdad7;
    }
  }

  &.is-primary {
    background-color: #750550;
    color: #fff;

    &:hover,
    &:focus {
      background-color: #4a0433;
    }
  }
}

.icon-button {
  padding: 0;
  border: 0;
  background-color: transparent;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.15s ease;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover,
  &:focus {
    background-color: #dfdad7;
  }
}
.step-wrapper {
  width: 100%;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.button.is-primary:disabled {
  background-color: #d1d9e0;
  color: #6b7280;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.button.is-primary:disabled:hover,
.button.is-primary:disabled:focus {
  background-color: #d1d9e0;
}
</style>
