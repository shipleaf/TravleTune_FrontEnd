<template>
  <div class="spotify-button">
    <img v-if="!isOn" src="/src/assets/logo/Full_Logo_Black_CMYK.svg" alt="" width="120" />
    <img v-else src="/src/assets/logo/Full_Logo_Green_CMYK.svg" alt="" width="120" />
    <div class="switch-wrapper">
      <div class="switch">
        <input type="checkbox" id="toggle" v-model="isOn" />
        <label for="toggle">
          <i class="bulb">
            <span class="bulb-center"></span>
            <span class="filament-1"></span>
            <span class="filament-2"></span>
            <span class="reflections">
              <span></span>
            </span>
            <span class="sparks">
              <i class="spark1"></i>
              <i class="spark2"></i>
              <i class="spark3"></i>
              <i class="spark4"></i>
            </span>
          </i>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSpotifyStore } from '@/stores/spotify'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import axiosApi from '@/api/axiosApi'

const store = useSpotifyStore()
const { accessToken } = storeToRefs(store)
const { clearToken } = store

onMounted(() => {
  console.log(accessToken)
})

async function loginWithSpotify() {
  try {
    const res = await axiosApi.get('/spotify/login')
    if (res?.data?.success && res?.data?.data?.auth_url) {
      window.location.href = res.data.data.auth_url
    }
  } catch (e) {
    console.error(e)
  }
}

const isOn = computed({
  get() {
    return !!accessToken.value
  },
  set(value) {
    if (value && !accessToken.value) {
      loginWithSpotify()
    } else if (!value) {
      clearToken()
    }
  },
})
</script>

<style lang="scss" scoped>
$ts-speed: 0.7s;

.spotify-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.switch-wrapper {
  width: 50px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  overflow: visible;
}

.switch {
  position: relative;
  transform: scale(0.23);
  transform-origin: center;

  input {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    z-index: 100;
    cursor: pointer;
  }

  label {
    height: 110px;
    width: 220px;
    background-color: #39315a;
    border-radius: 100px;
    display: block;
    box-shadow:
      inset 0 0 20px rgba(#000, 0.2),
      inset 0 0 5px -2px rgba(#000, 0.4);

    .bulb {
      height: 90px;
      width: 90px;
      background-color: #4a426b;
      border-radius: 50%;
      position: relative;
      top: 10px;
      left: 10px;
      display: block;
      transition: $ts-speed;
      box-shadow:
        inset 0 0 1px 3px #4a426b,
        inset 0 0 6px 8px #423963,
        0 20px 30px -10px rgba(#000, 0.4);

      .bulb-center {
        position: absolute;
        display: block;
        height: 36px;
        width: 36px;
        background-color: #5a527b;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transition: $ts-speed;
        transform: translate(-50%, -50%);
        box-shadow: inset 0 0 0 4px #635a84;

        &:after {
          content: '';
          display: block;
          height: 14px;
          width: 14px;
          background-color: #7b7394;
          border-radius: 50%;
          position: absolute;
          transition: $ts-speed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 2px 4px #524a73;
        }
      }

      .filament-1,
      .filament-2 {
        position: absolute;
        display: block;
        height: 35px;
        width: 35px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        overflow: hidden;
        transform: translate(-50%, -50%) rotate(-45deg);

        &:after,
        &:before {
          content: '';
          display: block;
          height: 6px;
          width: 17px;
          border-radius: 50%;
          border: 2px solid #4a426b;
          position: absolute;
          transition: $ts-speed;
          top: -4px;
          left: -2px;
          transform: rotate(-10deg);
        }

        &:before {
          left: 15px;
          transform: rotate(10deg);
        }
      }

      .filament-2 {
        transform: translate(-50%, -50%) rotate(45deg) !important;
      }

      .reflections {
        height: 100%;
        width: 100%;
        display: block;
        border-radius: 50%;
        overflow: hidden;
        position: absolute;
        z-index: 90;
        perspective: 70px;

        span {
          height: 80px;
          width: 80px;
          border-radius: 50%;
          background-image: linear-gradient(-135deg, transparent 10%, rgba(#fff, 0.3));
          position: absolute;
          left: -40px;
          bottom: -45px;

          &:after {
            content: '';
            display: block;
            height: 35px;
            width: 20px;
            position: absolute;
            top: -36px;
            right: -40px;
            border-radius: 50%;
            box-shadow: 4px -2px 0 -3px rgba(#fff, 0.4);
            filter: blur(1px);
            transform: rotate(-10deg);
          }
        }

        &:after {
          content: '';
          display: block;
          height: 80px;
          width: 50px;
          background-image: linear-gradient(80deg, rgba(#fff, 0.05) 45%, rgba(#fff, 0.5));
          border-radius: 10% 20% 50% 30% / 30% 60% 30% 40%;
          position: absolute;
          transform-style: preserve-3d;
          transform: rotateX(-25deg) rotate(-35deg) skewx(-15deg) translate(10px, -20px);
          top: -8px;
          left: -5px;
        }

        &:before {
          content: '';
          display: block;
          position: absolute;
          height: 10px;
          width: 30px;
          background-image: linear-gradient(to right, transparent, rgba(#fff, 0.15));
          bottom: 10px;
          right: 0;
          transform: rotate(45deg);
        }
      }

      .sparks {
        .spark1,
        .spark2,
        .spark3,
        .spark4 {
          position: absolute;
          border-radius: 50%;
          transition: 0.4s;
          opacity: 0;
          background-color: #d1b82b;
        }

        .spark1 {
          height: 1px;
          width: 1px;
          right: -5px;
          bottom: 23px;
        }

        .spark2 {
          height: 3px;
          width: 3px;
          right: 20px;
          bottom: 80px;
        }

        .spark3 {
          height: 3px;
          width: 3px;
          left: 20px;
          bottom: 80px;
        }

        .spark4 {
          height: 3px;
          width: 3px;
          left: 20px;
          bottom: 20px;
        }
      }
    }
  }

  /* Checked 상태 */
  input:checked ~ label .bulb {
    left: 120px;
    background-color: #a7694a;
    box-shadow:
      inset 0 0 1px 3px #a56758,
      inset 0 0 6px 8px #6b454f,
      0 20px 30px -10px rgba(#000, 0.4),
      0 0 30px 50px rgba(#fdb843, 0.1);
  }

  input:checked ~ label .bulb > .bulb-center {
    background-color: #feed6b;
    box-shadow:
      inset 0 0 0 4px #fdec6a,
      0 0 12px 10px #bca83c,
      0 0 20px 14px #a1664a;

    &:after {
      background-color: #fef401;
      box-shadow: 0 0 2px 4px #fdb843;
    }
  }

  input:checked ~ label .bulb > .filament-1,
  input:checked ~ label .bulb > .filament-2 {
    &:before,
    &:after {
      border-color: #fef4d5;
    }
  }

  input:checked ~ label .bulb > .sparks {
    .spark1 {
      animation: spark1 2s ease-in-out;
      animation-delay: 0.4s;
    }
    .spark2 {
      animation: spark2 2.4s ease-in-out;
      animation-delay: 0.4s;
    }
    .spark3 {
      animation: spark3 2s ease-in-out;
      animation-delay: 0.9s;
    }
    .spark4 {
      animation: spark4 1.7s ease-in-out;
      animation-delay: 0.9s;
    }
  }
}

/* Keyframes 그대로 */
@keyframes spark1 {
  0% {
    right: -5px;
    height: 1px;
    width: 1px;
    opacity: 0;
  }
  20% {
    height: 3px;
    width: 3px;
    right: 0;
    opacity: 1;
  }
  30% {
    right: -5px;
    opacity: 1;
    height: 3px;
    width: 3px;
  }
  70% {
    height: 3px;
    width: 3px;
  }
  100% {
    right: -60px;
    bottom: 40px;
    opacity: 0;
  }
}

@keyframes spark2 {
  0% {
    height: 3px;
    width: 3px;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    right: -20px;
    bottom: 100px;
    opacity: 0;
  }
}

@keyframes spark3 {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 1;
    height: 2px;
    width: 2px;
  }
  100% {
    left: 0;
    bottom: 100px;
    opacity: 0;
    height: 3px;
    width: 3px;
  }
}

@keyframes spark4 {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 1;
    height: 2px;
    width: 2px;
  }
  100% {
    left: -20px;
    bottom: -10px;
    opacity: 0;
    height: 3px;
    width: 3px;
  }
}
</style>
