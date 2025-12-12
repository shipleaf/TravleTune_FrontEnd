<template>
  <div class="card">
    <div class="card-body">
      <div class="card-title-row">
        <div class="card-texts">
          <p class="card-title">지역 선택하기</p>
        </div>
      </div>

      <!-- 선택된 시도/시군구 표시 영역 -->
      <div class="card-meta">
        <template v-if="currentSido || currentGungu">
          <div class="pill-row">
            <button v-if="currentSido" type="button" class="pill" @click="clearSido">
              {{ currentSido.sido_name }}
              <span class="pill-x">×</span>
            </button>

            <button v-if="currentGungu" type="button" class="pill" @click="clearGungu">
              {{ currentGungu.gungu_name }}
              <span class="pill-x">×</span>
            </button>
          </div>
        </template>
        <template v-else> 시도와 시군구를 선택해 주세요. </template>
      </div>

      <!-- 공용 dropdown: phase에 따라 시도/시군구 목록이 바뀜 -->
      <div
        class="dropdown"
        :class="{
          open: isOpen,
          filled: !!selectedLabel,
        }"
      >
        <span @click.stop="toggleDropdown">
          {{ selectedLabel || placeholder }}
        </span>
        <ul>
          <li
            v-for="opt in dropdownOptions"
            :key="phase === 'sido' ? opt.sido_code : opt.gungu_code"
            :class="{ active: isActiveOption(opt) }"
          >
            <a href="#" @click.prevent.stop="selectOption(opt)">
              {{ phase === 'sido' ? opt.sido_name : opt.gungu_name }}
            </a>
          </li>
        </ul>
      </div>

      <div class="card-actions">
        <button class="btn-primary" @click="handleConfirm">선택</button>
        <button class="btn-secondary" @click="close">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getSido, getGungu } from '@/api/siGunguApi'
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useSiGunguStore } from '@/stores/sigungu'
import { storeToRefs } from 'pinia'

const store = useSiGunguStore()
const { currentSido, currentGungu } = storeToRefs(store)
const { setSido, setGungu } = store

const emit = defineEmits(['close'])

const close = () => emit('close')

const options = ref([]) // 시도 목록
const gunguOptions = ref([]) // 시군구 목록

const isOpen = ref(false)
const phase = ref('sido')

const placeholder = computed(() => (phase.value === 'sido' ? '시도 선택하기' : '시군구 선택하기'))

// 드롭다운에 표시되는 텍스트
const selectedLabel = computed(() => {
  if (phase.value === 'sido') {
    return currentSido.value ? currentSido.value.sido_name : ''
  }
  if (phase.value === 'gungu') {
    return currentGungu.value ? currentGungu.value.gungu_name : ''
  }
  return ''
})

// 현재 phase에 따라 options 변경
const dropdownOptions = computed(() =>
  phase.value === 'sido' ? options.value : gunguOptions.value,
)

// active 클래스 판별
const isActiveOption = (opt) => {
  if (phase.value === 'sido') {
    return currentSido.value && currentSido.value.sido_code === opt.sido_code
  }
  return currentGungu.value && currentGungu.value.gungu_code === opt.gungu_code
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 선택 로직
const selectOption = (opt) => {
  if (phase.value === 'sido') {
    // 시도 선택
    setSido(opt)
    setGungu(null)
    phase.value = 'gungu' // 다음엔 시군구 단계로
  } else {
    // 시군구 선택
    setGungu(opt)
  }

  isOpen.value = false
}

// 시도 변경 → 시군구 목록 갱신
watch(currentSido, (newVal) => {
  if (!newVal) {
    gunguOptions.value = []
    return
  }
  gunguOptions.value = getGungu(newVal.sido_code)
})

const handleClickOutside = (e) => {
  const dropdownEl = document.querySelector('.card .dropdown')
  if (!dropdownEl) return
  if (!dropdownEl.contains(e.target)) {
    isOpen.value = false
  }
}

// chip X 버튼
const clearSido = () => {
  setSido(null)
  setGungu(null)
  gunguOptions.value = []
  phase.value = 'sido'
}

const clearGungu = () => {
  setGungu(null)
  phase.value = 'gungu'
}

// "선택" 버튼 클릭 → 코드 저장/emit or store
const handleConfirm = () => {
  if (!currentSido.value || !currentGungu.value) {
    // 둘 다 선택 안 돼 있으면 그냥 리턴하거나 토스트 띄워도 됨
    console.log('시도와 시군구를 모두 선택해 주세요')
    return
  }

  const payload = {
    sidoCode: currentSido.value.sido_code,
    gunguCode: currentGungu.value.gungu_code,
  }

  console.log('선택된 지역:', payload)
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  // 시도 api
  const res = await getSido()
  options.value = res.data
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.card {
  position: absolute;
  z-index: 1001;
  left: 25vw;
  top: 10vh;
  max-width: 24rem;
  min-width: 20rem;
  padding-bottom: 20px;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.icon {
  width: 2.5rem;
  height: 2.5rem;
}

.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.card-texts {
  flex: 1;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-subtitle {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-badges {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.badge {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #4b5563;
}

.card-meta {
  font-size: 0.75rem;
  color: #6b7280;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-size: 1rem;
  cursor: pointer;
}

.pill:hover {
  background: #e5e7eb;
}

.pill-x {
  font-size: 0.8rem;
  line-height: 1;
}

/* actions */
.card-actions {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: #111827;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-primary:hover {
  background: #1f2937;
}

.btn-secondary {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

/* footer */
.card-footer {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
  border-top: 1px solid #f3f4f6;
  text-align: center;
}

/* =========================
   dropdown 스타일 (Vue용)
   ========================= */

.dropdown {
  --max-scroll: 8;
  --text: #3f4656;
  --border: #2f3545;
  --borderActive: #23c4f8;
  --background: #151924;
  --arrow: #6c7486;
  --arrowActive: #e4ecfa;
  --listText: #99a3ba;
  --listBackground: #f5f9ff;
  --listActive: #e4ecfa;
  --listTextActive: #6c7486;
  --listBorder: none;
  --textFilled: #99a3ba;
  width: 220px;
  position: relative;

  &.light {
    --text: #cdd9ed;
    --border: #cdd9ed;
    --borderActive: #23c4f8;
    --background: #fff;
    --arrow: #99a3ba;
    --arrowActive: #6c7486;
    --listText: #99a3ba;
    --listBackground: #fff;
    --listActive: #f5f9ff;
    --listTextActive: #6c7486;
    --listBorder: #e4ecfa;
    --textFilled: #6c7486;
  }

  > span {
    cursor: pointer;
    padding: 9px 16px;
    border-radius: 6px;
    display: block;
    position: relative;
    color: var(--text);
    border: 1px solid var(--border);
    background: var(--background);
    transition: all 0.3s ease;
  }

  > span::before,
  > span::after {
    content: '';
    display: block;
    position: absolute;
    width: 8px;
    height: 2px;
    border-radius: 1px;
    top: 50%;
    right: 15px;
    background: var(--arrow);
    transition: all 0.3s ease;
  }

  > span::before {
    margin-right: 4px;
    transform: scale(0.96, 0.8) rotate(50deg);
  }

  > span::after {
    transform: scale(0.96, 0.8) rotate(-50deg);
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    max-height: calc(var(--max-scroll) * 42px);
    top: 42px;
    left: 0;
    right: 0;
    z-index: 10;
    background: var(--listBackground);
    border-radius: 6px;
    overflow-x: hidden;
    overflow-y: auto;
    transform-origin: 0 0;
    transition:
      opacity 0.2s ease,
      visibility 0.2s ease,
      transform 0.3s cubic-bezier(0.4, 0.6, 0.5, 1.32);
    transform: scale(0.8) translate(0, 4px);
    border: 1px solid var(--listBorder);

    li {
      opacity: 0;
      transform: translate(6px, 0);
      transition: all 0.3s ease;

      a {
        cursor: pointer;
        display: block;
        padding: 10px 16px;
        color: var(--listText);
        text-decoration: none;
        outline: none;
        position: relative;
        transition: all 0.3s ease;

        &:hover {
          color: var(--listTextActive);
        }
      }

      &.active a {
        color: var(--listTextActive);
        background: var(--listActive);
      }

      &:first-child a {
        border-radius: 6px 6px 0 0;
      }

      &:last-child a {
        border-radius: 0 0 6px 6px;
      }
    }
  }

  &.filled > span {
    color: var(--textFilled);
  }

  &.open {
    > span {
      border-color: var(--borderActive);

      &::before,
      &::after {
        background: var(--arrowActive);
      }

      &::before {
        transform: scale(0.96, 0.8) rotate(-50deg);
      }

      &::after {
        transform: scale(0.96, 0.8) rotate(50deg);
      }
    }

    ul {
      opacity: 1;
      visibility: visible;
      transform: scale(1) translate(0, 12px);
      transition:
        opacity 0.3s ease,
        visibility 0.3s ease,
        transform 0.3s cubic-bezier(0.4, 0.6, 0.5, 1.32);

      li {
        opacity: 1;
        transform: translate(0, 0);
      }
    }
  }
}
</style>
