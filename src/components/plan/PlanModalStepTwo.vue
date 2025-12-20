<template>
  <div class="page">
    <div class="select-region-header">
      <h3>여행 정보를 입력해 주세요.</h3>
    </div>
    <div>
      <div class="user-search-bar">
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
          class="lucide lucide-search-icon lucide-search"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
        <input v-model="inputUser" type="text" placeholder="사용자 검색" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'

const inputUser = ref('')

watch(inputUser, (newV) => {
  console.log(newV)
})
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 540px;
  color: black;

  display: flex;
  flex-direction: column;
}

.user-search-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
    color: #59636e;
  }

  input {
    outline: none;
    border: none;
    flex: 1;
  }

  &:focus-within {
    border-color: #3b82f6; // 파란색
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.4);
  }
}
</style>
