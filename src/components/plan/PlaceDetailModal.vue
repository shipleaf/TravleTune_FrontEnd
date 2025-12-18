<template>
  <div
    class="modal"
    :style="{ left: `${pos.left}px`, top: `${pos.top}px` }"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <button class="close" @click="$emit('close')" aria-label="close">×</button>

    <div class="head">
      <div class="title">{{ place.name }}</div>
      <div class="sub">{{ place.category }}</div>
    </div>

    <div class="thumb">
      <!-- 실제 이미지 연결 전 placeholder -->
      <div class="thumb__ph">Photo</div>
    </div>

    <p class="desc">
      상세 설명이 들어갈 영역입니다. (나중에 API로 place detail 받아서 넣으시면 됩니다.)
    </p>

    <div class="music">
      <div class="music__label">추천 음악</div>
      <div class="tracks">
        <div class="track" v-for="t in mockTracks" :key="t.id">
          <div class="album" />
          <div class="tinfo">
            <div class="tname">{{ t.title }}</div>
            <div class="tartist">{{ t.artist }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, reactive, watch } from 'vue'

const props = defineProps({
  place: { type: Object, required: true },
  position: { type: Object, required: true }, // {x,y}
})

defineEmits(['close', 'mouseenter', 'mouseleave'])

const mockTracks = [
  { id: 't1', title: 'Track Title 1', artist: 'Artist 1' },
  { id: 't2', title: 'Track Title 2', artist: 'Artist 2' },
  { id: 't3', title: 'Track Title 3', artist: 'Artist 3' },
]

/** ✅ 화면 밖으로 안 나가게 위치 보정 */
const pos = reactive({ left: 0, top: 0 })
const MODAL_W = 320
const MODAL_H = 420
const GAP = 14

const recalc = () => {
  const vw = window.innerWidth
  const vh = window.innerHeight

  // 기본: 커서 오른쪽 + 아래
  let left = props.position.x + GAP
  let top = props.position.y + GAP

  // 우측 넘치면 왼쪽으로
  if (left + MODAL_W > vw - 8) left = props.position.x - MODAL_W - GAP
  // 아래 넘치면 위로
  if (top + MODAL_H > vh - 8) top = props.position.y - MODAL_H - GAP

  // 그래도 음수면 clamp
  left = Math.max(8, Math.min(left, vw - MODAL_W - 8))
  top = Math.max(8, Math.min(top, vh - MODAL_H - 8))

  pos.left = left
  pos.top = top
}

watch(
  () => [props.position.x, props.position.y],
  () => recalc(),
  { immediate: true },
)

const onResize = () => recalc()
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  width: 320px;
  height: 420px;
  overflow: auto;
  border-radius: 16px;
  background: rgba(20, 25, 40, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  padding: 14px;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 18px;
}

.head {
  padding-right: 36px;

  .title {
    font-size: 15px;
    font-weight: 900;
  }
  .sub {
    margin-top: 6px;
    font-size: 12px;
    opacity: 0.75;
  }
}

.thumb {
  margin-top: 12px;
  border-radius: 14px;
  overflow: hidden;
  height: 140px;
  background: rgba(255, 255, 255, 0.06);

  &__ph {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    font-weight: 800;
  }
}

.desc {
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.4;
  opacity: 0.8;
  height: 60px;
  overflow: hidden;
}

.music {
  margin-top: 10px;

  &__label {
    font-size: 12px;
    font-weight: 900;
    margin-bottom: 10px;
  }
}

.tracks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.track {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
}

.album {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
}

.tinfo {
  min-width: 0;
}

.tname {
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tartist {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
}
</style>
