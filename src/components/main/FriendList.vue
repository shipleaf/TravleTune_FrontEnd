<template>
  <section class="friend-panel">
    <header class="panel-header">
      <h3 class="panel-title">친구</h3>
      <button class="friend-button" @click="navigateToFriend">
        <span class="panel-sub">전체 보기</span>
        <ChevronRight size="14" />
      </button>
    </header>

    <div class="panel-block">
      <div class="block-header">
        <div class="block-title">받은 친구 요청</div>
        <div class="block-meta">
          <span v-if="reqLoading" class="badge">로딩중</span>
          <span v-else class="badge">{{ receivedRequests.length }}</span>
        </div>
      </div>

      <div class="block-body scroll" role="list">
        <div v-if="reqError" class="state state--error">{{ reqError }}</div>
        <div v-else-if="!reqLoading && receivedRequests.length === 0" class="state">
          받은 요청이 없습니다
        </div>

        <div v-for="r in receivedRequests" :key="r.friend_id" class="row" role="listitem">
          <img :src="r.profile_image || defaultAvatar" alt="profile" class="avatar" />
          <div class="row-info">
            <div class="row-title">{{ r.nickname }}</div>
            <div class="row-sub">요청 · {{ formatDate(r.created_at) }}</div>
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

    <div class="panel-block">
      <div class="block-header">
        <div class="block-title">친구 목록</div>
        <div class="block-meta">
          <span v-if="friendsLoading" class="badge">로딩중</span>
          <span v-else class="badge">{{ friends.length }}</span>
        </div>
      </div>

      <div class="block-body scroll" role="list">
        <div v-if="friendsError" class="state state--error">{{ friendsError }}</div>
        <div v-else-if="!friendsLoading && friends.length === 0" class="state">
          아직 친구가 없습니다
        </div>

        <div v-for="f in friends" :key="f.friend_id" class="row" role="listitem">
          <img :src="f.profile_image || defaultAvatar" alt="profile" class="avatar" />
          <div class="row-info">
            <div class="row-title">{{ f.nickname }}</div>
            <div class="row-sub" v-if="f.member_id">member_id: {{ f.member_id }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getReceiveddRequest, getFriends } from '@/api/friendApi'
import { ChevronRight, Check, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const receivedRequests = ref([])
const friends = ref([])
const router = useRouter()
const reqLoading = ref(false)
const friendsLoading = ref(false)
const reqError = ref('')
const friendsError = ref('')
const defaultAvatar = 'https://via.placeholder.com/40?text=F'

const loadReceivedRequests = async () => {
  reqLoading.value = true
  reqError.value = ''
  try {
    const res = await getReceiveddRequest()
    const payload = res?.data ?? res
    if (payload?.success === true) {
      receivedRequests.value = payload.data ?? []
    } else {
      receivedRequests.value = []
      reqError.value = payload?.error?.message ?? '요청 목록을 불러오지 못했습니다.'
    }
  } catch (e) {
    receivedRequests.value = []
    reqError.value = '요청 목록 로딩 중 오류가 발생했습니다.'
    console.error(e)
  } finally {
    reqLoading.value = false
  }
}

const navigateToFriend = () => {
  router.push('/friend')
}

const loadFriends = async () => {
  friendsLoading.value = true
  friendsError.value = ''
  try {
    const res = await getFriends()
    const payload = res?.data ?? res
    if (payload?.success === true) {
      friends.value = payload.data ?? []
    } else {
      friends.value = []
      friendsError.value = payload?.error?.message ?? '친구 목록을 불러오지 못했습니다.'
    }
  } catch (e) {
    friends.value = []
    friendsError.value = '친구 목록 로딩 중 오류가 발생했습니다.'
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
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffHour < 24) {
    if (diffHour <= 0) return diffMin <= 1 ? '방금 전' : `${diffMin}분 전`
    return `${diffHour}시간 전`
  }
  if (diffDay < 30) return `${diffDay}일 전`
  if (diffMonth < 12) return `${diffMonth}개월 전`
  return `${diffYear}년 전`
}

onMounted(async () => {
  await Promise.all([loadReceivedRequests(), loadFriends()])
})
</script>

<style lang="scss" scoped>
.friend-panel {
  width: 450px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  padding: 14px;
  backdrop-filter: blur(10px);
}

.panel-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 4px 2px;
}

.panel-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
}

.panel-sub {
  font-size: 12px;
  color: rgba(244, 244, 245, 0.65);
}

.panel-block {
  display: flex;
  flex-direction: column;
  gap: 10px;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  padding: 12px;

  min-height: 0;
  flex: 1;
}

.block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.block-title {
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
}

.badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  color: #1f6feb;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(0, 0, 0, 0.18);
}

.friend-button {
  background: none;
  outline: none;
  border: none;
  width: fit-content;
  display: flex;
  gap: 4px;
  cursor: pointer;
  color: rgba(244, 244, 245, 0.65);
}

.block-body {
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px;
  background: rgba(0, 0, 0, 0.16);

  transition:
    transform 0.12s ease,
    border-color 0.12s ease,
    background 0.12s ease;
}

.row:hover {
  background: rgba(0, 0, 0, 0.5);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
}

.row-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.row-title {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
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

.row-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn {
  padding: 4px;
  height: 32px;
  border-radius: 100%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  transition:
    transform 0.12s ease,
    border-color 0.12s ease,
    background 0.12s ease,
    color 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.26);
  }
}

.btn--accept {
  border-color: rgba(34, 197, 94, 0.35);

  &:hover {
    color: #1f6feb;
  }
}

.btn--reject {
  border-color: rgba(239, 68, 68, 0.32);

  &:hover {
    color: #fff;
  }
}

.state {
  padding: 10px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  color: rgba(244, 244, 245, 0.65);
  font-size: 12px;
}

.state--error {
  border-style: solid;
  border-color: rgba(239, 68, 68, 0.35);
  color: rgba(255, 255, 255, 0.9);
  background: rgba(239, 68, 68, 0.12);
}

.scroll {
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
</style>
