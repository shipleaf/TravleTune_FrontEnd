<template>
  <main class="right">
    <div class="card">
      <div class="mobile-brand">
        <div class="logo mobile">
          <div class="logo-dot white"></div>
        </div>
        <h1 class="brand-name dark">TravleTune</h1>
      </div>

      <div class="content">
        <div class="header">
          <h2 class="title">Create Account</h2>
          <p class="subtitle">필수 정보를 입력해 회원가입을 완료해 주세요.</p>
        </div>

        <div class="field">
          <label class="label">프로필 사진</label>
          <span class="pofile-msg"
            >프로필 사진을 선택하지 않으면 기본 프로필 사진으로 설정됩니다.</span
          >

          <div class="row">
            <div class="avatar-wrap">
              <div class="avatar">
                <img
                  v-if="inputProfileImage"
                  :src="inputProfileImage"
                  alt="Profile preview"
                  class="avatar-img"
                />
                <svg v-else viewBox="0 0 24 24" class="user-icon" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.02-8 4.5A1.5 1.5 0 0 0 5.5 20h13A1.5 1.5 0 0 0 20 18.5C20 16.02 16.42 14 12 14Z"
                  />
                </svg>
              </div>

              <input
                ref="fileInputRef"
                class="hidden-input"
                type="file"
                id="profile-upload"
                accept="image/*"
                @change="handleImageUpload"
              />
            </div>

            <label for="profile-upload" class="upload-btn">
              <svg viewBox="0 0 24 24" class="upload-icon" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M19 15v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4h2v4h10v-4Zm-7-1V7.83l2.59 2.58L16 9l-4-4-4 4 1.41 1.41L12 7.83V14Z"
                />
              </svg>
              <span class="upload-text">업로드</span>
            </label>
          </div>
        </div>
        <!-- Form Fields -->
        <div class="fields">
          <div class="field">
            <label class="label" for="name">이름</label>
            <input
              id="name"
              v-model.trim="inputName"
              class="input"
              type="text"
              placeholder="이름을 입력해 주세요"
              autocomplete="name"
            />
            <p v-if="errors.name" class="error">{{ errors.name }}</p>
          </div>

          <div class="field">
            <label class="label" for="nickname">닉네임</label>
            <div class="nickname-container">
              <input
                id="nickname-input"
                v-model.trim="inputNickname"
                class="nickname-input"
                type="text"
                placeholder="닉네임을 입력해 주세요"
                autocomplete="nickname"
              />
              <button class="check-nickname-duplication" @click="checkDuplicated">중복확인</button>
            </div>
            <p v-if="errors.nickname" class="error">{{ errors.nickname }}</p>
            <p v-if="checkDuplication" class="pass">사용 가능한 닉네임입니다.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { checkNickname } from '@/api/memberApi'
import { useSignupStore } from '@/stores/signup'
// import { mockCheckNickname } from '@/api/memberApi'
import { ref, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'

const store = useSignupStore()

const { name, profileImage, nickname } = storeToRefs(store)

const inputName = ref('')
const inputNickname = ref('')
const inputProfileImage = ref('')
const checkDuplication = ref(false)

const handleImageUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = () => {
    inputProfileImage.value = reader.result
  }
  reader.readAsDataURL(file)
}

watch(name, () => {
  errors.name = ''
})

watch(nickname, () => {
  errors.nickname = ''
  checkDuplication.value = false
})

const errors = reactive({
  name: '',
  nickname: '',
})

const resetErrors = () => {
  errors.name = ''
  errors.nickname = ''
}

const checkDuplicated = async () => {
  resetErrors()
  try {
    if (!inputNickname.value) {
      errors.nickname = '닉네임을 입력해 주세요.'
      return
    }
    const response = await checkNickname(inputNickname.value)
    if (!response.data.data.has_nickname) checkDuplication.value = true
    else {
      errors.nickname = '이미 존재하는 닉네임입니다.'
      checkDuplication.value = false
    }
    return
  } catch {
    checkDuplication.value = false
    return
  }
}

const validateStepTwo = () => {
  console.log('refs:', { name, profileImage, nickname })
  resetErrors()
  let ok = true

  if (!inputName.value) {
    errors.name = '이름을 입력해 주세요.'
    ok = false
  }

  if (!inputNickname.value) {
    errors.nickname = '닉네임을 입력해 주세요.'
    ok = false
  } else if (!checkDuplication.value) {
    errors.nickname = '중복확인을 체크해 주세요.'
    ok = false
  }

  if (ok) {
    name.value = inputName.value
    profileImage.value = inputProfileImage.value
    nickname.value = inputNickname.value
  }
  return ok
}

defineExpose({ validateStepTwo })
</script>

<style lang="scss" scoped>
$page-blue: oklch(0.75 0.15 195);
$border: rgba(255, 255, 255, 0.14);
$text: rgba(255, 255, 255, 0.92);
$muted: rgba(255, 255, 255, 0.68);

.page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  background: oklch(0.12 0.01 240); // 검은 배경 전제
}

.right {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: oklch(0.12 0.01 240);
}

.card {
  width: 100%;
  max-width: 420px;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #fff;
  display: grid;
  place-items: center;

  &.mobile {
    background: $page-blue;
  }

  .logo-dot {
    width: 16px;
    height: 16px;
    border-radius: 6px;
    background: $page-blue;

    &.white {
      background: #fff;
    }
  }
}

.mobile-brand {
  display: block;
  text-align: center;
  margin-bottom: 24px;

  @media (min-width: 1024px) {
    display: none;
  }

  .brand-name {
    margin: 0;
    font-size: 20px;
    font-weight: 600;

    &.dark {
      color: #fff;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header {
  text-align: center;
  display: grid;
  gap: 8px;

  .title {
    margin: 0;
    font-size: 30px;
    color: #fff;
    font-weight: 500;
  }

  .subtitle {
    margin: 0;
    color: $muted;
    font-size: 14px;
    line-height: 1.6;
  }
}

.fields {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 8px;
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: $text;
}

.pofile-msg {
  font-size: 12px;
  color: $page-blue;
}

.input-wrap {
  position: relative;
}

.nickname-container {
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border: 1px solid $border;
  border-radius: 12px;
  outline: none;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: none;
  font-size: 14px;
  color: #fff;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  &:focus-within {
    border-color: $page-blue;
  }

  &.pr {
    padding-right: 44px;
  }
}

.nickname-input {
  display: flex;
  flex: 1;
  background: none;
  border: none;
  color: #fff;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  &:focus {
    outline: none;
  }
}

.input {
  height: 48px;
  width: 100%;
  padding: 0 14px;
  border: 1px solid $border;
  border-radius: 12px;
  outline: none;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: none;
  font-size: 14px;
  color: #fff;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  &:focus {
    border-color: $page-blue;
  }

  &.pr {
    padding-right: 44px;
  }
}

.check-nickname-duplication {
  height: 36px;
  background: none;
  color: white;
  cursor: pointer;
  border: 1px solid $border;
  border-radius: 12px;
}

.icon-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 48px;
  width: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.icon {
  width: 18px;
  height: 18px;
  color: #fff;

  &.muted {
    color: rgba(255, 255, 255, 0.65);
  }
}

.row {
  display: grid;
  gap: 8px;
}

.agree {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: $muted;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: $page-blue;
  }
}

.error {
  margin: 0;
  font-size: 12px;
  color: $page-blue;
  opacity: 0.95;
}

.pass {
  margin: 0;
  font-size: 12px;
  color: $page-blue;
  opacity: 0.95;
}

.primary {
  height: 48px;
  width: 100%;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: $page-blue;
  color: #000;
  font-weight: 700;
  font-size: 14px;

  &:hover {
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.switch {
  text-align: center;
  font-size: 13px;
  color: $muted;
  margin-top: 2px;

  .link {
    margin-left: 6px;
    border: none;
    background: transparent;
    color: $page-blue;
    cursor: pointer;
    padding: 0;

    &:hover {
      opacity: 0.85;
    }

    &.strong {
      font-weight: 600;
    }
  }
}

.field {
  display: grid;
  gap: 12px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrap {
  position: relative;
}

.avatar {
  width: 96px; // w-24
  height: 96px; // h-24
  border-radius: 9999px;
  background: #18181b; // zinc-900
  border: 2px solid #27272a; // zinc-800
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-icon {
  width: 40px;
  height: 40px;
  color: #52525b; // zinc-600
}

.hidden-input {
  display: none;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  background: #18181b; // zinc-900
  border: 1px solid #27272a; // zinc-800
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;

  &:hover {
    background: #27272a; // zinc-800
  }
}

.upload-icon {
  width: 16px;
  height: 16px;
  color: #fff;
}

.upload-text {
  font-size: 14px;
  color: #fff;
}
</style>
