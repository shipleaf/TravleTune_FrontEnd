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

        <div class="fields">
          <div class="field">
            <label class="label" for="email">이메일</label>
            <input
              id="email"
              v-model.trim="inputEmail"
              class="input"
              type="email"
              placeholder="이메일을 입력해 주세요"
              autocomplete="email"
              value="inputEmail"
            />
            <p v-if="errors.email" class="error">{{ errors.email }}</p>
          </div>

          <div class="field">
            <label class="label" for="password">비밀번호</label>
            <div class="input-wrap">
              <input
                id="password"
                v-model="inputPassword"
                class="input pr"
                :type="showPassword ? 'text' : 'password'"
                placeholder="비밀번호를 입력해 주세요"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="icon-btn"
                @click="showPassword = !showPassword"
                aria-label="Toggle password"
              >
                <svg viewBox="0 0 24 24" class="icon muted">
                  <path
                    fill="currentColor"
                    d="M12 5c5.5 0 10 4.5 11 7-1 2.5-5.5 7-11 7S2 14.5 1 12c1-2.5 5.5-7 11-7Zm0 2C7.6 7 4 10.4 3.1 12c.9 1.6 4.5 5 8.9 5s8-3.4 8.9-5c-.9-1.6-4.5-5-8.9-5Zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Z"
                  />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="error">{{ errors.password }}</p>
          </div>

          <div class="field">
            <label class="label" for="password2">비밀번호 확인</label>
            <input
              id="password2"
              v-model="inputPassword2"
              class="input"
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호를 다시 입력해 주세요"
              autocomplete="new-password"
            />
            <p v-if="errors.password2" class="error">{{ errors.password2 }}</p>
          </div>
        </div>
        <div class="switch">
          이미 계정이 있으신가요?
          <button type="button" class="link strong" @click="goToLogin">로그인 하기</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { checkEmail } from '@/api/memberApi'
import { useSignupStore } from '@/stores/signup'
import { storeToRefs } from 'pinia'

const router = useRouter()
const store = useSignupStore()

const { email, password } = storeToRefs(store)
const emit = defineEmits(['valid', 'inValid'])

const inputEmail = ref(email.value || '')
const inputPassword = ref(password.value || '')
const inputPassword2 = ref('')
const showPassword = ref(false)

const errors = reactive({
  email: '',
  password: '',
  password2: '',
})

const resetErrors = () => {
  errors.email = ''
  errors.password = ''
  errors.password2 = ''
}

const validateStepOne = async () => {
  resetErrors()
  let ok = true

  if (!inputEmail.value) {
    errors.email = '이메일을 입력해 주세요.'
    ok = false
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inputEmail.value)) {
      errors.email = '이메일 형식이 올바르지 않습니다.'
      ok = false
    }
  }

  if (!inputPassword.value) {
    errors.password = '비밀번호를 입력해 주세요.'
    ok = false
  }

  if (!inputPassword2.value) {
    errors.password2 = '비밀번호 확인을 입력해 주세요.'
    ok = false
  } else if (inputPassword.value !== inputPassword2.value) {
    errors.password2 = '비밀번호가 일치하지 않습니다.'
    ok = false
  }

  if (ok) {
    try {
      const response = await checkEmail(inputEmail.value)
      if (response.error) {
        errors.email = '이미 가입된 이메일입니다.'
        ok = false
      }
    } catch {
      errors.email = '이미 가입된 이메일입니다.'
      ok = false
    }
  }

  if (ok) {
    emit('valid')
    email.value = inputEmail
    password.value = inputPassword
  } else emit('inValid', { ...errors })

  // return true
  // TODO 주석 돌려놓기
  return ok
}

const goToLogin = () => {
  router.push('/login')
}

defineExpose({ validateStepOne })
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

.input-wrap {
  position: relative;
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
</style>
