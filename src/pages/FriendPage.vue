<template>
  <div class="page">
    <header class="page-header">
      <HeaderBar />
    </header>

    <main class="page-main">
      <div class="invite-wrapper" ref="inviteRef">
        <div class="user-invite-container">
          <div class="invite-title">친구 추가</div>
          <div class="user-search-bar" @click.stop>
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
              class="lucide lucide-search"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <input
              v-model="inputUser"
              type="text"
              placeholder="사용자 검색"
              @compositionstart="isComposing = true"
              @compositionend="onCompositionEnd"
            />
          </div>
          <div class="separtor"></div>
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
              <div class="user">
                <img
                  :src="user.profile_image"
                  alt="Avatar"
                  class="profile-image"
                  v-if="user.profile_image"
                />
                <div v-else class="profile-image">
                  <User />
                </div>

                <div class="user-info">
                  <div class="user-nickname">{{ user.nickname }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </div>
              <button class="plus-button" @click="handlePlusFriend">
                <UserRoundPlus />
              </button>
            </div>

            <div class="load-spinner-conatiner" v-if="isScrollLoading">
              <LoadSpinner />
            </div>
          </div>
        </div>
      </div>
      <section class="friend-panel panel-block--fit">
        <div class="block-header">
          <div class="block-title">받은 친구 요청</div>
          <div class="block-meta">
            <span v-if="reqLoading" class="badge">로딩…</span>
            <span v-else class="badge">{{ receivedRequests.length }}</span>
          </div>
        </div>
        <div class="panel-block">
          <div class="block-body scroll" role="list">
            <div v-if="reqError" class="state state--error">{{ reqError }}</div>
            <div v-else-if="!reqLoading && receivedRequests.length === 0" class="state">
              받은 요청이 없어요.
            </div>

            <div v-for="r in receivedRequests" :key="r.friend_id" class="row" role="listitem">
              <img :src="r.profile_image" alt="profile" class="avatar" />

              <div class="row-info">
                <div class="row-title">{{ r.nickname }}</div>
                <div class="row-sub">요청일: {{ formatDate(r.created_at) }}</div>
              </div>

              <div class="row-actions">
                <button class="btn btn--accept" type="button" @click="acceptRequest(r.friend_id)">
                  <Check size="20" />
                </button>
                <button class="btn btn--reject" type="button" @click="declineRequest(r.friend_id)">
                  <X size="20" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="block-header">
          <div class="block-title">친구 목록</div>
          <div class="block-meta">
            <span v-if="friendsLoading" class="badge">로딩…</span>
            <span v-else class="badge">{{ friends.length }}</span>
          </div>
        </div>
        <div class="panel-block panel-block--fill">
          <div class="block-body scroll" role="list">
            <div v-if="friendsError" class="state state--error">{{ friendsError }}</div>
            <div v-else-if="!friendsLoading && friends.length === 0" class="state">
              아직 친구가 없어요.
            </div>

            <div v-for="f in friends" :key="f.friend_id" class="row" role="listitem">
              <img :src="f.profile_image" alt="profile" class="avatar" />

              <div class="row-info">
                <div class="row-title">{{ f.nickname }}</div>
                <div class="row-sub">member_id: {{ f.member_id }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'
import LoadSpinner from '@/components/common/LoadSpinner.vue'
import { useTripStore } from '@/stores/trip'

// import { mockSearchUser as searchUserApi } from '@/api/friendApi'
import { storeToRefs } from 'pinia'
import { searchUser as searchUserApi } from '@/api/friendApi'
import HeaderBar from '@/components/common/HeaderBar.vue'
import {
  getReceivedRequestMock as getReceivedRequests,
  getFriendsMock as getFriends,
} from '@/api/friendApi'
import { User, UserRoundPlus, Check, X } from 'lucide-vue-next'

const inviteRef = ref(null)

const handleClickOutside = (e) => {
  if (!inviteRef.value) return

  // invite-wrapper 바깥을 클릭했을 때
  if (!inviteRef.value.contains(e.target)) {
    users.value = [] // 결과 제거
    isLoading.value = false
    isScrollLoading.value = false
    hasNext.value = false
    currentKeyword.value = ''
  }
}

const reqLoading = ref(false)

const reqError = ref('')
const friendsError = ref('')
const isComposing = ref(false)

const onCompositionEnd = () => {
  isComposing.value = false
  // 조합 끝난 값으로 즉시 검색 트리거
  triggerSearch(inputUser.value)
}

const triggerSearch = (v) => {
  clearTimeout(debounceTimer)
  const keyword = v.trim()
  if (!keyword) {
    users.value = []
    isLoading.value = false
    errorMsg.value = ''
    page.value = 0
    hasNext.value = false
    currentKeyword.value = ''
    return
  }
  debounceTimer = setTimeout(() => {
    currentKeyword.value = keyword
    page.value = 0
    fetchUsers({ keyword, nextPage: 0, append: false })
  }, 300)
}

const loadReceivedRequests = async () => {
  reqLoading.value = true
  reqError.value = ''

  try {
    const res = await getReceivedRequests()
    if (res?.success) {
      receivedRequests.value = res.data ?? []
    } else {
      receivedRequests.value = []
      reqError.value = res?.error?.message ?? '요청 목록을 불러오지 못했어요.'
    }
  } catch (e) {
    receivedRequests.value = []
    reqError.value = '요청 목록 로딩 중 오류가 발생했어요.'
    console.error(e)
  } finally {
    reqLoading.value = false
  }
}

const loadFriends = async () => {
  friendsLoading.value = true
  friendsError.value = ''

  try {
    const res = await getFriends()
    if (res?.success) {
      friends.value = res.data ?? []
    } else {
      friends.value = []
      friendsError.value = res?.error?.message ?? '친구 목록을 불러오지 못했어요.'
    }
  } catch (e) {
    friends.value = []
    friendsError.value = '친구 목록 로딩 중 오류가 발생했어요.'
    console.error(e)
  } finally {
    friendsLoading.value = false
  }
}

const acceptRequest = (friendId) => {
  receivedRequests.value = receivedRequests.value.filter((r) => r.friend_id !== friendId)
}

const declineRequest = (friendId) => {
  receivedRequests.value = receivedRequests.value.filter((r) => r.friend_id !== friendId)
}

const formatDate = (iso) => {
  if (!iso) return '-'

  const now = new Date()
  const target = new Date(iso)
  if (Number.isNaN(target.getTime())) return '-'

  const diffMs = now - target
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffHour < 24) {
    return diffHour <= 0 ? '방금 전' : `${diffHour}시간 전`
  }

  if (diffDay < 30) {
    return `${diffDay}일 전`
  }

  if (diffMonth < 12) {
    return `${diffMonth}달 전`
  }

  return `${diffYear}년 전`
}

onMounted(async () => {
  await Promise.all([loadReceivedRequests(), loadFriends()])
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const store = useTripStore()

const { invitedUsers } = storeToRefs(store)

const inputUser = ref('')

const receivedRequests = ref([])
const friends = ref([])

const receivedLoading = ref(false)
const friendsLoading = ref(false)

const users = ref([])
const isLoading = ref(false)
const isScrollLoading = ref(false)
const errorMsg = ref('')

const page = ref(0)
const size = ref(5)
const hasNext = ref(false)

const resultRef = ref(null)

watch(inputUser, (newV) => {
  if (isComposing.value) return
  triggerSearch(newV)
})

const isInvited = (memberId) => {
  return invitedUsers.value.some((u) => u.member_id === memberId)
}

const toggleInvite = (user) => {
  const idx = invitedUsers.value.findIndex((u) => u.member_id === user.member_id)
  if (idx >= 0) invitedUsers.value.splice(idx, 1)
  else invitedUsers.value.push(user)
}

// const removeInvite = (memberId) => {
//   invitedUsers.value = invitedUsers.value.filter((u) => u.member_id !== memberId)
// }

const fetchReceivedRequests = async () => {
  receivedLoading.value = true
  const res = await getReceivedRequests()
  receivedRequests.value = res.success ? res.data : []
  receivedLoading.value = false
}

const fetchFriends = async () => {
  friendsLoading.value = true
  const res = await getFriends()
  friends.value = res.success ? res.data : []
  friendsLoading.value = false
}

onMounted(() => {
  fetchReceivedRequests()
  fetchFriends()
})

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
/* ===== layout ===== */
.page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
}

.page-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
}

.find-mates-result-container {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 75%;
  background-color: #0d1117;
  z-index: 200;
}

.invite-wrapper {
  position: relative;
  padding: 14px;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
}

.friend-panel {
  padding: 14px;
  width: 100%;
  max-width: 800px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-invite-container {
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.invite-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(244, 244, 245, 0.92);
}

.user-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #3d444d;
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
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: rgba(244, 244, 245, 0.82);
    font-size: 14px;
    font-weight: 500;

    &::placeholder {
      color: rgba(244, 244, 245, 0.4);
      font-weight: 400;
    }
  }

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.4);
  }
}

/* ===== friend panel ===== */
.friend-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(10px);
}

/* 카드 2개 */
.panel-block {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.find-mates-result {
  background: transparent;
  border: 0.0625rem solid #3d444db3;
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
.separtor {
  border-bottom: 1.5px solid #42434a;
  margin-top: 12px;
}

.find-mates-piece {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  &:hover {
    background-color: #000;
  }
}

.user {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

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

/* ✅ 받은 요청: 내용만큼만 */
.panel-block--fit {
  flex: 0 0 auto;
}

/* ✅ 친구목록: 남는 높이 채우고 스크롤 */
.panel-block--fill {
  flex: 1 1 auto;
}

/* 헤더 */
.block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.block-title {
  font-size: 16px;
  font-weight: 700;
  color: rgba(244, 244, 245, 0.92);
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}

.user-nickname {
  color: #3b82f6;
  font-size: 1rem;
  font-weight: 700;
}

.user-email {
  color: #9198a1;
  font-size: 0.75rem;
}

.plus-button {
  display: flex;
  align-items: center;
  background: none;
  outline: none;
  border: 1px solid #3d444db3;
  border-radius: 6px;
  padding: 5px;
  width: 34px;
  height: 32px;
  cursor: pointer;

  svg {
    color: #fff;
  }
}

.badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  color: #1f6feb;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(0, 0, 0, 0.18);
}

/* 리스트 바디 */
.block-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 친구목록만 스크롤 */
.scroll {
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.28) transparent;
}

.scroll::-webkit-scrollbar {
  width: 8px;
}
.scroll::-webkit-scrollbar-track {
  background: transparent;
}
.scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.35);
}

/* row */
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  transition: background 0.12s ease;
}

.row:hover {
  background: rgba(0, 0, 0, 0.28);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.row-title {
  font-size: 13px;
  font-weight: 700;
  color: rgba(244, 244, 245, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-sub {
  font-size: 12px;
  color: rgba(244, 244, 245, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* actions */
.row-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.load-spinner-conatiner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.btn {
  height: 32px;
  width: 32px;
  border-radius: 999px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.55);
  transition:
    transform 0.12s ease,
    color 0.12s ease,
    background 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.06);
  }
}

.btn--accept:hover {
  color: #1f6feb;
}

.btn--reject:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* 상태 메시지 */
.state {
  padding: 10px;
  border-radius: 10px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  color: rgba(244, 244, 245, 0.65);
  font-size: 12px;
}

.state--error {
  border-style: solid;
  border-color: rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.12);
  color: rgba(255, 255, 255, 0.92);
}

/* ✅ 선택된 사용자 스타일(클래스만 추가해둠) */
.find-mates-piece--selected {
  background: #ddf4ff !important;
  color: #0969da !important;
  span {
    color: #0969da !important;
  }
  outline: 1px solid rgba(59, 130, 246, 0.35);
}
.find-mates-result {
  scrollbar-width: thin;
  scrollbar-color: #d1d9e0 transparent;
}
.find-mates-result::-webkit-scrollbar {
  width: 6px;
}
.find-mates-result::-webkit-scrollbar-track {
  background: transparent;
}
.find-mates-result::-webkit-scrollbar-thumb {
  background-color: #d1d9e0;
  // 파란 계열
  border-radius: 999px; // 완전 둥글게
  transition: background-color 0.15s ease;
}
.find-mates-result::-webkit-scrollbar-thumb:hover {
  background-color: #d1d9e0;
}
</style>
