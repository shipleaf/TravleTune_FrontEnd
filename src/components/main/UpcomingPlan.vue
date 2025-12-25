<template>
  <section class="hero-slider hero-style">
    <button class="custom-nav custom-prev">
      <ChevronLeft :size="28" />
    </button>
    <button class="custom-nav custom-next">
      <ChevronRight :size="28" />
    </button>
    <Swiper
      class="swiper"
      :modules="modules"
      :loop="true"
      :speed="1000"
      :parallax="true"
      :autoplay="{ delay: 6500, disableOnInteraction: false }"
      :navigation="{
        prevEl: '.custom-prev',
        nextEl: '.custom-next',
      }"
      :watchSlidesProgress="true"
      @progress="onProgress"
      @touchStart="onTouchStart"
      @setTransition="onSetTransition"
    >
      <SwiperSlide v-for="trip in upcomingTrips" :key="trip.trip_id">
        <div
          class="slide-inner slide-bg-image"
          :style="{ backgroundImage: `url(${trip.image_url})` }"
        >
          <div class="image-overlay"></div>
          <div class="slide-content">
            <div class="container">
              <div data-swiper-parallax="300" class="slide-title">
                <h2>{{ trip.title }}</h2>
              </div>
              <div data-swiper-parallax="400" class="slide-text">
                <p>{{ trip.memo }}</p>
              </div>
              <div class="clearfix"></div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation, Parallax } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { ref, onMounted } from 'vue'
import { getTripsMock } from '@/api/tripApi'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const upcomingTrips = ref([])
const isLoading = ref(false)
const errorMsg = ref('')

const toISODate = (d = new Date()) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const formatDate = (iso) => {
  if (!iso) return ''
  const [, m, d] = iso.split('-')
  return `${m}.${d}`
}

const getHostName = (members = []) => {
  const host = members.find((m) => m.role === 'HOST')
  return host?.nickname ?? members[0]?.nickname ?? ''
}

const loadUpcomingTrips = async () => {
  isLoading.value = true
  errorMsg.value = ''

  try {
    const todayISO = toISODate()

    const res = await getTripsMock()
    if (!res?.success) {
      errorMsg.value = res?.error?.message ?? '여행 목록을 불러오지 못했어요.'
      upcomingTrips.value = []
      return
    }

    const upcoming = (res.data ?? [])
      .filter((t) => t.start_date >= todayISO)
      .sort((a, b) => a.start_date.localeCompare(b.start_date))

    upcomingTrips.value = upcoming
  } catch (e) {
    console.error(e)
    errorMsg.value = '네트워크 오류가 발생했어요.'
    upcomingTrips.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUpcomingTrips()
})
const modules = [Autoplay, Pagination, Navigation, Parallax]

const interleaveOffset = 0.5

const onProgress = (swiper) => {
  for (let i = 0; i < swiper.slides.length; i++) {
    const slideEl = swiper.slides[i]
    const slideProgress = slideEl.progress
    const innerOffset = swiper.width * interleaveOffset
    const innerTranslate = slideProgress * innerOffset
    const inner = slideEl.querySelector('.slide-inner')
    if (inner) inner.style.transform = `translate3d(${innerTranslate}px, 0, 0)`
  }
}

const onTouchStart = (swiper) => {
  for (let i = 0; i < swiper.slides.length; i++) {
    swiper.slides[i].style.transition = ''
  }
}

const onSetTransition = (swiper, speed) => {
  for (let i = 0; i < swiper.slides.length; i++) {
    const slideEl = swiper.slides[i]
    slideEl.style.transition = `${speed}ms`
    const inner = slideEl.querySelector('.slide-inner')
    if (inner) inner.style.transition = `${speed}ms`
  }
}
</script>

<style lang="scss" scoped>
/* hero-slider가 기준이 되도록 */
.hero-slider {
  position: relative;
}

/* ✅ 기본: 안 보임 + 클릭도 안 됨 */
.custom-nav {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(0);
  z-index: 10;

  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.35);
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(6px);
  transition:
    opacity 0.25s ease,
    visibility 0.25s ease,
    transform 0.25s ease,
    background 0.25s ease;
}

.custom-prev {
  left: 20px;
}

.custom-next {
  right: 20px;
}

.slide-inner {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
}

/* ✅ 사진 위 오버레이 */
.image-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;

  /* 원하는 분위기로 조절 */
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.45),
    rgba(0, 0, 0, 0.35),
    rgba(0, 0, 0, 0.6)
  );
}

/* ✅ 텍스트는 오버레이 위 */
.slide-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.container {
  width: 1200px;
  padding: 0 15px;
  margin: 0 auto;
}

.hero-slider {
  width: 70%;
  height: 600px;
  display: flex;
  position: relative;

  z-index: 0;
}

.swiper {
  width: 100%;
  height: 100%;
}

/* Swiper 내부 구조는 swiper/vue가 자동 생성 */
.hero-slider :deep(.swiper-slide) {
  position: relative; /* ✅ slide-inner absolute의 기준 */
  overflow: hidden;
  color: #fff;
}

.slide-inner {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 1;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
}

.hero-slider:hover .custom-nav {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.custom-prev {
  left: 20px;
  transform: translateY(-50%) translateX(-8px); /* 숨겨질 때 살짝 왼쪽으로 */
}

.custom-next {
  right: 20px;
  transform: translateY(-50%) translateX(8px); /* 숨겨질 때 살짝 오른쪽으로 */
}

/* ✅ navigation/pagination 클래스는 Swiper가 만들어줌 -> deep으로 스타일 적용 */
// .hero-slider :deep(.swiper-button-prev),
// .hero-slider :deep(.swiper-button-next) {
//   background: transparent;
//   width: 55px;
//   height: 55px;
//   line-height: 53px;
//   margin-top: -30px;
//   text-align: center;
//   border: 2px solid #d4d3d3;
//   border-radius: 55px;
//   opacity: 0;
//   visibility: hidden;
//   transition: all 0.3s ease;
// }

// .hero-slider:hover :deep(.swiper-button-prev),
// .hero-slider:hover :deep(.swiper-button-next) {
//   transform: translateX(0);
//   opacity: 1;
//   visibility: visible;
// }

.hero-slider:hover .custom-prev {
  transform: translateY(-50%) translateX(0);
}
.hero-slider:hover .custom-next {
  transform: translateY(-50%) translateX(0);
}

.hero-slider :deep(.swiper-button-prev) {
  left: 25px;
  transform: translateX(50px);
}
.hero-slider :deep(.swiper-button-next) {
  right: 25px;
  transform: translateX(-50px);
}

/* ✅ FontAwesome 없이도 되게 간단 chevron 대체(원하면 lucide로도 가능) */
.chev {
  display: inline-block;
  margin-right: 6px;
  font-size: 22px;
  transform: translateY(2px);
}

/* pagination */
.hero-slider :deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  opacity: 0.3;
  background: #fff;
  transition: all 0.2s ease;
}
.hero-slider :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
}
.hero-slider :deep(.swiper-pagination) {
  text-align: left;
}
.custom-nav:hover {
  background: rgba(0, 0, 0, 0.55);
  transform: translateY(-50%) scale(1.06);
}
/* 나머지 당신 CSS는 그대로 이어 붙여도 됩니다 */
</style>
