<template>
  <div v-if="modelValue" class="modal" role="dialog" aria-modal="true" :aria-label="title">
    <!-- 배경(오버레이): 여기 클릭하면 닫힘 -->
    <div class="modal__overlay" @click="close" />
    <article class="modal-container" @click.stop>
      <header class="modal-container-header">
        <h1 class="modal-container-title">
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
              d="M14 9V4H5v16h6.056c.328.417.724.785 1.18 1.085l1.39.915H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8v1h-7zm-2 2h9v5.949c0 .99-.501 1.916-1.336 2.465L16.5 21.498l-3.164-2.084A2.953 2.953 0 0 1 12 16.95V11zm2 5.949c0 .316.162.614.436.795l2.064 1.36 2.064-1.36a.954.954 0 0 0 .436-.795V13h-5v3.949z"
            />
          </svg>
          {{ title }}
        </h1>

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

      <section class="modal-container-body rtf"></section>

      <footer class="modal-container-footer">
        <button class="button is-ghost" type="button" @click="$emit('decline')">Decline</button>
        <button class="button is-primary" type="button" @click="$emit('accept')">Accept</button>
      </footer>
    </article>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: true },
  title: { type: String, default: 'Terms and Services' },
})

const emit = defineEmits(['update:modelValue', 'accept', 'decline', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style lang="scss" scoped>
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

/* 컨텐츠는 overlay 위에 */
.modal-container {
  position: relative;
  z-index: 1;

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
  font-size: 1.125;

  svg {
    width: 32px;
    height: 32px;
    color: #750550;
  }
}

.modal-container-body {
  padding: 24px 32px 51px;
  overflow-y: auto;
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
</style>
