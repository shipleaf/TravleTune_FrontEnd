<template>
  <div class="page">
    <div class="select-region-header">
      <h3>여행 정보를 입력해 주세요.</h3>
    </div>
    <div class="travel-main">
      <div class="travel-title">
        <label for="trip-title">제목</label>
        <input
          v-model="tripTitle"
          id="trip-title"
          type="text"
          placeholder="여행 제목을 입력해 주세요."
        />
      </div>

      <div class="travel-description">
        <label for="trip-desc">설명</label>
        <textarea
          v-model="tripDescription"
          id="trip-desc"
          placeholder="여행에 대한 설명을 입력해 주세요."
        />
      </div>
    </div>
    <div class="user-invite-container">
      <div class="invite-title">초대하기</div>

      <Transition name="invite-slide" mode="out-in">
        <span v-if="invitedUsers.length === 0" key="desc" class="invite-desc">
          사용자를 검색 후 여행에 초대하실 수 있어요.
        </span>

        <div v-else key="chips" class="invited-chips">
          <button
            v-for="u in invitedUsers"
            :key="u.member_id"
            type="button"
            class="invited-chip"
            @click="removeInvite(u.member_id)"
          >
            <span class="invited-chip-name">{{ u.nickname }}</span>
            <span class="invited-chip-x">×</span>
          </button>
        </div>
      </Transition>

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

    <div class="find-mates-result-container" v-if="inputUser">
      <div class="find-mates-result" ref="resultRef" @scroll.passive="onScrollResult">
        <div class="load-spinner-conatiner" v-if="isLoading && users.length === 0">
          <LoadSpinner />
        </div>

        <div
          v-else
          class="find-mates-piece"
          :class="{ 'find-mates-piece--selected': isInvited(user.member_id) }"
          v-for="user in users"
          :key="user.member_id"
          @click="toggleInvite(user)"
        >
          <img
            v-if="user.profile_image"
            :src="user.profile_image"
            alt="Avatar"
            class="profile-image"
          />
          <div v-else class="profile-image">
            <User />
          </div>

          <div class="user-info">
            <div>{{ user.nickname }}</div>
            <span>{{ user.email }}</span>
          </div>
        </div>

        <div class="load-spinner-conatiner" v-if="isScrollLoading">
          <LoadSpinner />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import LoadSpinner from '../common/LoadSpinner.vue'
import { useTripStore } from '@/stores/trip'

// import { mockSearchUser as searchUserApi } from '@/api/friendApi'
import { storeToRefs } from 'pinia'
import { searchUser as searchUserApi } from '@/api/friendApi'
import { User } from 'lucide-vue-next'

const store = useTripStore()

const { tripTitle, tripDescription, invitedUsers } = storeToRefs(store)

const inputUser = ref('')

const users = ref([])
const isLoading = ref(false)
const isScrollLoading = ref(false)
const errorMsg = ref('')

const page = ref(0)
const size = ref(5)
const hasNext = ref(false)

const resultRef = ref(null)

const isInvited = (memberId) => {
  return invitedUsers.value.some((u) => u.member_id === memberId)
}

const toggleInvite = (user) => {
  const idx = invitedUsers.value.findIndex((u) => u.member_id === user.member_id)
  if (idx >= 0) invitedUsers.value.splice(idx, 1)
  else invitedUsers.value.push(user)
}

const removeInvite = (memberId) => {
  invitedUsers.value = invitedUsers.value.filter((u) => u.member_id !== memberId)
}

let debounceTimer = null
let requestId = 0
const currentKeyword = ref('') // ✅ “현재 검색어” 고정용

const fetchUsers = async ({ keyword, nextPage, append }) => {
  const currentId = ++requestId

  if (append) isScrollLoading.value = true
  else isLoading.value = true

  errorMsg.value = ''

  try {
    const res = await searchUserApi(keyword, nextPage, size.value)
    if (currentId !== requestId) return

    if (res?.data?.success) {
      // ✅ 실제 데이터는 res.data.data 안에 있음
      const pageData = res?.data?.data ?? {}

      console.log(pageData)

      const members = pageData.members ?? []
      hasNext.value = !!pageData.has_next
      page.value = pageData.page ?? nextPage

      users.value = append ? [...users.value, ...members] : members
    } else {
      if (!append) users.value = []
      errorMsg.value = res?.error?.message ?? '검색에 실패했어요.'
    }
  } catch (e) {
    if (currentId !== requestId) return
    if (!append) users.value = []
    errorMsg.value = '네트워크 오류가 발생했어요.'
    console.error(e)
  } finally {
    if (currentId === requestId) {
      if (append) isScrollLoading.value = false
      else isLoading.value = false
    }
  }
}

// ✅ 디바운스 검색(검색어 바뀌면 초기화)
watch(inputUser, (newV) => {
  clearTimeout(debounceTimer)

  const keyword = newV.trim()

  if (!keyword) {
    users.value = []
    isLoading.value = false
    errorMsg.value = ''
    page.value = 0
    hasNext.value = false
    currentKeyword.value = ''
    return
  }

  debounceTimer = setTimeout(async () => {
    currentKeyword.value = keyword
    page.value = 0
    await fetchUsers({ keyword, nextPage: 0, append: false })
  }, 300)
})

// ✅ 무한 스크롤: 아래 닿으면 다음 페이지
const onScrollResult = async () => {
  const el = resultRef.value
  if (!el) return

  if (isScrollLoading.value) return
  if (!hasNext.value) return
  if (!currentKeyword.value) return

  const threshold = 24
  const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold
  if (!reachedBottom) return

  await fetchUsers({
    keyword: currentKeyword.value,
    nextPage: page.value + 1,
    append: true,
  })
}

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style lang="scss" scoped>
.profile-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #3d444db3;
  border-radius: 100%;

  svg {
    color: #3d444db3;
  }
}

.travel-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 공통 input / textarea 스타일 */
.travel-title,
.travel-description {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #374151;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px 12px;
    font-size: 0.9rem;
    border: 1px solid #d1d9e0;
    border-radius: 8px;
    outline: none;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;

    &::placeholder {
      color: #9ca3af;
      font-size: 0.85rem;
    }

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.4);
    }
  }
}

.travel-description {
  textarea {
    min-height: 80px;
    resize: vertical; // 필요 없으면 none으로
    line-height: 1.5;
  }
}

.page {
  width: 100%;
  height: 540px;
  min-height: 0;
  color: black;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.select-region-header {
  min-height: 60px;
}

.user-invite-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-search-bar {
  display: flex;
  align-items: center;
  position: relative;
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

.invite-title {
  font-size: 1rem;
  font-weight: 600;
}

.invite-desc {
  font-size: 0.8rem;
}

.find-mates-result-container {
  display: flex;
  /* flex: 1; */
  background: none;
  border: none;
  min-height: 0;
}

.find-mates-result {
  background: #fff;
  border: 0.0625rem solid #d1d9e0;
  border-radius: 0.375rem;
  box-shadow:
    0px 1px 1px 0px #25292e1a,
    0px 3px 6px 0px #25292e1f;
  font-size: 0.8125rem;
  list-style: none;
  min-height: 0;
  min-width: 100%;
  overflow-y: auto;
  z-index: 99;
  display: flex;
  flex-direction: column;
}

.find-mates-piece {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
}

.profile-image {
  width: 48px;
  height: 48px;
  border-radius: 100%;
}

.user-info {
  div {
    font-size: 0.9rem;
    font-weight: 500;
  }
  span {
    font-size: 0.8rem;
    font-weight: 400;
    color: #59636e;
  }
}

.load-spinner-conatiner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

/* 왼쪽에서 들어오고, 왼쪽으로 나가기 */
.invite-slide-enter-active,
.invite-slide-leave-active {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}

.invite-slide-enter-from,
.invite-slide-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

.invite-slide-enter-to,
.invite-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* 초대된 유저 칩 컨테이너 */
.invited-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.invited-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid #d1d9e0;
  border-radius: 999px;
  background: #fff;
  cursor: pointer;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.25);
    transform: translateY(-1px);
  }
}

.invited-chip-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

.invited-chip-x {
  font-size: 1rem;
  line-height: 1;
  color: #6b7280;
}

/* ✅ 선택된 사용자 스타일(클래스만 추가해둠) */
.find-mates-piece--selected {
  background: #ddf4ff !important;
  color: #0969da !important;

  span {
    color: #0969da !important;
  }

  /* 선택된 느낌 더 주고 싶으면(선택) */
  outline: 1px solid rgba(59, 130, 246, 0.35);
}

/* Firefox */
.find-mates-result {
  scrollbar-width: thin;
  scrollbar-color: #d1d9e0 transparent;
}

/* Chrome / Edge / Safari */
.find-mates-result::-webkit-scrollbar {
  width: 6px; // 스크롤바 두께
}

.find-mates-result::-webkit-scrollbar-track {
  background: transparent;
}

.find-mates-result::-webkit-scrollbar-thumb {
  background-color: #d1d9e0; // 파란 계열
  border-radius: 999px; // 완전 둥글게
  transition: background-color 0.15s ease;
}

.find-mates-result::-webkit-scrollbar-thumb:hover {
  background-color: #d1d9e0;
}
</style>
