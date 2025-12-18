<template>
  <div class="page">
    <!--왼쪽-->
    <aside class="left">
      <div class="left-inner">
        <div class="brand" @click="navigateToHome">
          <div class="lp-container">
            <LpSpinner />
          </div>
          <h1 class="brand-name">TravleTune</h1>
        </div>

        <div class="left-center">
          <h2 class="left-title">Effortlessly manage your team and operations.</h2>
          <p class="left-desc">Log in to access your CRM dashboard and manage your team.</p>
        </div>
      </div>
    </aside>

    <!--오른쪽-->
    <main class="right">
      <div class="card">
        <div class="content">
          <div class="header">
            <button
              v-if="currentView === 'forgot'"
              class="back-btn"
              type="button"
              @click="setView('login')"
              aria-label="Back"
            >
              <svg viewBox="0 0 24 24" class="icon">
                <path
                  fill="currentColor"
                  d="M15.5 19a1 1 0 0 1-.7-.3l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 1 1 1.4 1.4L11.9 12l4.3 4.3A1 1 0 0 1 15.5 19z"
                />
              </svg>
            </button>

            <h2 class="title">
              <span v-if="currentView === 'login'">Welcome Back</span>
            </h2>

            <p class="subtitle">
              <span v-if="currentView === 'login'">
                가입하신 이메일 주소로 로그인하여 TravleTune의 서비스를 이용해 보세요!
              </span>
            </p>
          </div>

          <!-- Form Fields -->
          <div class="fields">
            <div class="field">
              <label class="label" for="email">이메일</label>
              <input
                v-model="email"
                id="email"
                class="input"
                type="email"
                placeholder="이메일을 입력해 주세요"
              />
            </div>

            <div v-if="currentView === 'login'" class="field">
              <label class="label" for="password">비밀번호</label>
              <div class="input-wrap">
                <input
                  v-model="password"
                  id="password"
                  class="input pr"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="비밀번호를 입력해 주세요"
                />
                <button
                  type="button"
                  class="icon-btn"
                  @click="showPassword = !showPassword"
                  aria-label="Toggle password"
                >
                  <template v-if="showPassword">
                    <!-- EyeOff -->
                    <svg viewBox="0 0 24 24" class="icon muted">
                      <path
                        fill="currentColor"
                        d="M2.1 3.51a1 1 0 0 1 1.41 0l17 17a1 1 0 1 1-1.41 1.41l-2.22-2.22A11.9 11.9 0 0 1 12 21C6.5 21 2 16.5 1 12c.45-2.02 1.72-3.96 3.52-5.55L2.1 4.93a1 1 0 0 1 0-1.42ZM12 19c1.5 0 2.91-.38 4.16-1.05l-1.65-1.65A4 4 0 0 1 7.7 9.49L6.13 7.92C4.61 9.21 3.51 10.59 3 12c.92 3.6 4.63 7 9 7Zm9-7c-.36 1.44-1.2 2.86-2.4 4.07l-1.46-1.46c.79-.78 1.38-1.67 1.72-2.61-.92-3.6-4.63-7-9-7-.88 0-1.72.13-2.5.38L6.24 4.26C8.01 3.46 9.97 3 12 3c5.5 0 10 4.5 11 9Zm-9-5a4 4 0 0 1 4 4c0 .56-.12 1.09-.33 1.58l-5.25-5.25c.49-.21 1.02-.33 1.58-.33Zm-4 4a4 4 0 0 0 4 4c.22 0 .44-.02.65-.06l-4.59-4.59c-.04.21-.06.43-.06.65Z"
                      />
                    </svg>
                  </template>
                  <template v-else>
                    <!-- Eye -->
                    <svg viewBox="0 0 24 24" class="icon muted">
                      <path
                        fill="currentColor"
                        d="M12 5c5.5 0 10 4.5 11 7-1 2.5-5.5 7-11 7S2 14.5 1 12c1-2.5 5.5-7 11-7Zm0 2C7.6 7 4 10.4 3.1 12c.9 1.6 4.5 5 8.9 5s8-3.4 8.9-5c-.9-1.6-4.5-5-8.9-5Zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Z"
                      />
                    </svg>
                  </template>
                </button>
              </div>
            </div>

            <div v-if="currentView === 'login'" class="row">
              <label class="remember">
                <input v-model="remember" type="checkbox" />
                <span>아이디 기억하기</span>
              </label>
            </div>
          </div>

          <!-- Primary Button -->
          <button class="primary" type="button" @click="handleLogin">
            <span>로그인</span>
          </button>

          <!-- Social + Divider (로그인 화면에만 유지) -->
          <template v-if="currentView === 'login'">
            <div class="divider">
              <div class="line"></div>
              <span class="divider-text">간편 로그인</span>
              <div class="line"></div>
            </div>

            <div class="social-login-container">
              <button class="social-btn" type="button" @click="handleKakaoLogin">
                <img
                  class="kakao-login-btn"
                  src="/src/assets/logo/kakao_login_medium_wide.png"
                  alt="kakao_login"
                />
              </button>
            </div>
          </template>

          <div class="switch">
            <template v-if="currentView === 'login'">
              아직 계정이 없으신가요?
              <button type="button" class="link strong" @click="navigateToSignUp">
                회원가입 하기
              </button>
            </template>

            <template v-else>
              Remember your password?
              <button type="button" class="link strong">Back to Login.</button>
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import LpSpinner from '@/components/auth/LpSpinner.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { login } from '@/api/memberApi'

const router = useRouter()

const apiKey = import.meta.env.VITE_KAKAO_REST_API_KEY
const redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT_URI

const email = ref('')
const password = ref('')

const showPassword = ref(false)
const remember = ref(false)

const currentView = ref('login')

function setView(view) {
  currentView.value = view
  showPassword.value = false
}

const navigateToHome = () => {
  router.push('/')
}

const navigateToSignUp = () => {
  router.push('/signup')
}

const handleLogin = async () => {
  const credentials = {
    email: email.value,
    password: password.value,
  }

  try {
    const response = await login(credentials)
    console.log(response)
  } catch {
    return
  }
}

const handleKakaoLogin = () => {
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirect_uri}&response_type=code`
}
</script>

<style lang="scss" scoped>
$page-blue: #3f3ff3;
$border: #e5e7eb;
$text: #111827;
$muted: #6b7280;
$bg: #ffffff;

.lp-container {
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lp-container > * {
  transform: scale(0.64);
}
.page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    'DM Sans',
    Arial,
    'Noto Sans',
    'Apple Color Emoji',
    'Segoe UI Emoji';
}

.left {
  display: none;
  width: 50%;
  position: relative;
  overflow: hidden;
  background: black;

  @media (min-width: 1024px) {
    display: block;
  }

  .left-inner {
    position: relative;
    z-index: 1;
    height: 100%;
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;

    .brand-name {
      color: #fff;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
  }

  .left-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;

    .left-title {
      color: #fff;
      font-size: 40px;
      line-height: 1.15;
      font-weight: 500;
      margin: 0;
      max-width: 520px;
    }

    .left-desc {
      color: rgba(255, 255, 255, 0.9);
      font-size: 18px;
      line-height: 1.6;
      margin: 0;
      max-width: 520px;
    }
  }

  .left-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;

    .policy {
      cursor: pointer;
      &:hover {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

.right {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: $bg;

  @media (min-width: 1024px) {
    width: 50%;
  }
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
      color: $text;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header {
  position: relative;
  text-align: center;
  display: grid;
  gap: 8px;

  .back-btn {
    position: absolute;
    left: 0;
    top: -8px;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: none;
    background: transparent;
    cursor: pointer;

    &:hover {
      background: #f3f4f6;
    }
  }

  .title {
    margin: 0;
    margin-bottom: 12px;
    font-size: 30px;
    color: $text;
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
  background: #fff;
  box-shadow: none;
  font-size: 14px;
  color: $text;

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
  color: $text;

  &.muted {
    color: $muted;
  }
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.remember {
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

.primary {
  height: 48px;
  width: 100%;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: oklch(0.75 0.15 195);
  color: #fff;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    opacity: 0.92;
  }
}

.divider {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin-top: 6px;

  .line {
    height: 1px;
    background: #e5e7eb;
  }

  .divider-text {
    font-size: 11px;
    text-transform: uppercase;
    color: $muted;
    background: #fff;
    padding: 0 8px;
    white-space: nowrap;
  }
}

/* .social {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
} */

.social-login-container {
  display: flex;
  justify-content: center;
}

.social-btn {
  width: fit-content;
  display: flex;
  justify-content: center;
  outline: none;
  border: none;
  cursor: pointer;
  height: 48px;
  background: none;
}

.kakao-login-btn {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.social-icon {
  width: 18px;
  height: 18px;
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
