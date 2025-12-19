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
        <button class="button is-ghost" type="button" @click="prevStep">
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
        <button class="button is-primary" type="button" @click="nextStep">
          다음
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
import { ref, watch } from 'vue'
import PlanModalStepOne from './PlanModalStepOne.vue'
import PlanModalStepTwo from './PlanModalStepTwo.vue'

const range = ref({
  start: '',
  end: '',
})

watch(
  range,
  (newVal) => {
    console.log('range 변경됨:', newVal.start, newVal.end)
  },
  { deep: true },
)

defineProps({
  modelValue: { type: Boolean, default: true },
})

const createModalStep = ref(1)

const emit = defineEmits(['update:modelValue', 'accept', 'decline', 'close'])

const prevStep = () => {
  createModalStep.value -= 1
}

const nextStep = () => {
  createModalStep.value += 1
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
  createModalStep.value = 1
}
</script>

<style lang="scss" scoped>
.modal-container-body :deep(.vc-header button) {
  background: none;
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

  min-height: 600px;
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
</style>
