<template>
  <button class="u-btn" type="button" :style="{ '--clr': clr }" @click="onClick">
    <span class="u-btn__icon-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 14 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="u-btn__icon-svg"
        width="10"
      >
        <path
          d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
          fill="currentColor"
        />
      </svg>

      <svg
        viewBox="0 0 14 15"
        fill="none"
        width="10"
        xmlns="http://www.w3.org/2000/svg"
        class="u-btn__icon-svg u-btn__icon-svg--copy"
      >
        <path
          d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
          fill="currentColor"
        />
      </svg>
    </span>

    <span class="u-btn__label">
      {{ label }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, default: 'Explore All' },
  clr: { type: String, default: '#7808d0' },
})

const emit = defineEmits(['click'])

const onClick = (e) => emit('click', e)
</script>

<style scoped lang="scss">
.u-btn {
  line-height: 1;
  text-decoration: none;
  display: inline-flex;
  border: none;
  cursor: pointer;
  align-items: center;
  gap: 0.75rem;

  background-color: var(--clr);
  color: #fff;
  border-radius: 10rem;
  font-weight: 600;

  padding: 0.75rem 1.5rem;
  padding-left: 20px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: background-color 0.3s;

  &:hover {
    background-color: #000;
  }

  &:hover .u-btn__icon-wrapper {
    color: #000;
  }

  &:hover .u-btn__icon-svg:first-child {
    transition: transform 0.3s ease-in-out;
    transform: translate(150%, -150%);
  }

  &:hover .u-btn__icon-svg--copy {
    transition: transform 0.3s ease-in-out 0.1s;
    transform: translate(0);
  }
}

.u-btn__icon-wrapper {
  flex-shrink: 0;
  width: 25px;
  height: 25px;
  position: relative;

  color: var(--clr);
  background-color: #fff;

  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.u-btn__icon-svg--copy {
  position: absolute;
  transform: translate(-150%, 150%);
}

.u-btn__label {
  display: inline-block;
  font-size: 0.95rem;
  font-weight: 700;
}
</style>
