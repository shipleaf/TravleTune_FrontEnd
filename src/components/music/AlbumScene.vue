<template>
  <div class="scene-wrapper" ref="wrapperRef">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>추천 음악을 불러오는 중...</p>
    </div>

    <button class="close-btn" type="button" @click="handleClose">×</button>

    <!-- Three.js 캔버스 -->
    <canvas ref="canvasRef" id="scene"></canvas>

    <div class="album-carousel-overlay">
      <CoverFlow
        v-if="!selectedTrack && tracks.length"
        :tracks="tracks"
        @select="handleTrackSelect"
      />
    </div>

    <div class="player-container" ref="playerContainerRef">
      <MusicPlayerContainer
        v-if="store.accessToken && showPlayerUI"
        :tracks="tracks"
        :selected-track-id="selectedTrack?.id"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import CoverFlow from './CoverFlow.vue'
import MusicPlayerContainer from './MusicPlayerContainer.vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { useSpotifyStore } from '@/stores/spotify'
import { useSpotStore } from '@/stores/spot'
import { storeToRefs } from 'pinia'
import axiosApi from '@/api/axiosApi'

const emit = defineEmits(['loaded', 'close'])

const store = useSpotifyStore()
const spotStore = useSpotStore()
const { selectedPlayerSpot } = storeToRefs(spotStore)

const tracks = ref([])

const selectedTrack = ref(null)
const loading = ref(true)

function handleTrackSelect(track) {
  selectedTrack.value = track
  spawnSelectedAlbumMesh(track)
}

function spawnSelectedAlbumMesh(track) {
  const loader = new THREE.TextureLoader()
  const tex = track.albumImage ? loader.load(track.albumImage) : null

  if (tex) {
    if ('colorSpace' in tex) {
      tex.colorSpace = THREE.SRGBColorSpace
    } else {
      tex.encoding = THREE.sRGBEncoding
    }
  }

  const geo = new THREE.PlaneGeometry(1, 1)
  const mat = new THREE.MeshBasicMaterial({
    map: tex || null,
    side: THREE.DoubleSide,
    transparent: true,
  })

  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(0, 1, 0)

  scene.add(mesh)

  onSelectAlbum(mesh)
}

// 🔹 Spotify 추천/검색 API 호출을 여기로 이동
async function loadTracks() {
  const attractionId = selectedPlayerSpot.value?.attraction_id
  if (!attractionId) {
    loading.value = false
    return
  }
  const applyPreferences = selectedPlayerSpot.value?.apply_preferences ?? false

  try {
    const res = await axiosApi.get('/recommendations', {
      params: { attraction_id: attractionId, size: 10, apply_preferences: applyPreferences },
    })
    const list = res?.data?.data ?? []

    tracks.value = list.map((t, idx) => ({
      pk: t.music_id ?? idx,
      id: t.spotify_id ?? t.music_id ?? idx,
      title: t.title ?? '',
      artist: t.artist_name ?? '',
      albumImage: t.album_image ?? '',
      previewUrl: t.preview_url ?? '',
      hasPreview: Boolean(t.preview_url),
      mood: 'recommendation',
      location: 'Spotify',
      spotifyUri: t.uri,
    }))
    emit('loaded')
  } catch (err) {
    console.error('Spotify fetch error:', err)
  } finally {
    loading.value = false
  }
}

const props = defineProps({
  selectedPlace: Object,
  selectedSpot: Object,
})

// ====== 템플릿 ref ======
const canvasRef = ref(null)
const progressRef = ref(null)
const audioRef = ref(null)
const wrapperRef = ref(null)

const showPlayerUI = ref(false)

const playerContainerRef = ref(null)

// ====== Three.js 관련 전역 변수 ======
let renderer
let scene
let camera
let light

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const albumMeshes = []
let selectedMesh = null
let hoveredMesh = null

// LP 그룹 관련
const lpGroup = new THREE.Group()
let lpSpinTween = null

// 애니메이션 프레임 id
let animationId = null

// 카메라 초기 위치 저장용
// let initialCameraPosition = null

// ====== 초기화 함수들 ======
function initThree() {
  const canvas = canvasRef.value
  const wrapper = wrapperRef.value
  if (!canvas || !wrapper) return

  const { clientWidth, clientHeight } = wrapper

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(clientWidth, clientHeight)

  if ('outputColorSpace' in renderer) {
    // three r150+ 정도
    renderer.outputColorSpace = THREE.SRGBColorSpace
  } else {
    // 구버전 (outputEncoding 쓰는 버전)
    renderer.outputEncoding = THREE.sRGBEncoding
  }

  renderer.toneMapping = THREE.NoToneMapping

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 100)
  camera.position.set(0, 1.6, 6)
  scene.add(camera)

  // initialCameraPosition = camera.position.clone()

  light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(2, 4, 5)
  scene.add(light)

  scene.background = null
  renderer.setClearColor(0x000000, 0)
}

function createLP() {
  scene.add(lpGroup)

  const texLoader = new THREE.TextureLoader()
  const tex = texLoader.load('/src/assets/textures/lp.png', () => {
    console.log('LP 텍스처 로드 완료')
  })

  const lpGeo = new THREE.CircleGeometry(0.8, 128)
  const lpMat = new THREE.MeshStandardMaterial({
    map: tex,
    metalness: 0.7,
    roughness: 0.45,
    transparent: true,
    side: THREE.DoubleSide,
  })

  if (renderer) {
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
  }

  const lpMesh = new THREE.Mesh(lpGeo, lpMat)
  lpMesh.position.set(0, 0, 0)
  lpGroup.add(lpMesh)

  const wrapper = wrapperRef.value
  if (!wrapper) return

  const aspect = wrapper.clientWidth / wrapper.clientHeight

  if (aspect > 1.5) {
    // 아주 와이드 모니터 → LP를 더 오른쪽으로 빼기
    lpGroup.position.set(0.6, 1.5, 0.5)
  } else {
    // 보통 비율 → 살짝 오른쪽/위
    lpGroup.position.set(0.2, 1.5, 0.5)
  }

  lpGroup.visible = false
}

// ====== LP 회전 ======
function startVinylRotation() {
  lpGroup.visible = true
  console.log('lpGroup visible?', lpGroup.visible, lpGroup.position)

  showPlayerUI.value = true

  gsap.fromTo(
    lpGroup.position,
    { x: -1.5 },
    {
      x: -1,
      duration: 0.8,
      ease: 'power3.out',

      onComplete: () => {
        startLPSpin() // LP 회전 시작
        revealPlayerUI() // 플레이어 등장
      },
    },
  )
}

function startLPSpin() {
  if (lpSpinTween) lpSpinTween.kill()

  lpSpinTween = gsap.to(lpGroup.rotation, {
    z: '-=6.283',
    duration: 2,
    repeat: -1,
    ease: 'none',
    modifiers: {
      z: gsap.utils.wrap(0, Math.PI * 2),
    },
  })
}

function revealPlayerUI() {
  console.log('store.accessToken:', store.accessToken)
  console.log('showPlayerUI:', showPlayerUI.value)
  showPlayerUI.value = true

  nextTick(() => {
    const el = playerContainerRef.value
    if (!el) return

    gsap.fromTo(
      el,
      {
        x: 200,
        opacity: 0,
      },
      {
        x: 0, // ✅ 제자리까지 당겨오기
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        onStart() {
          el.style.pointerEvents = 'auto'
        },
        onUpdate() {
          // 현재 opacity 확인
          console.log('current opacity:', el.style.opacity)
        },
      },
    )
  })
}

// ====== 플레이어 UI, 오디오 ======
function updateProgress() {
  const audio = audioRef.value
  const progressBar = progressRef.value
  if (!audio || !progressBar || !audio.duration) return

  const ratio = audio.currentTime / audio.duration
  progressBar.style.width = ratio * 100 + '%'
}

// ====== 앨범 선택 애니메이션 ======
function onSelectAlbum(mesh) {
  const tl = gsap.timeline()

  // 1) 다른 앨범 사라지기
  tl.to(
    albumMeshes.filter((m) => m !== mesh).map((m) => m.material),
    {
      opacity: 0,
      duration: 0.4,
      stagger: 0.03,
    },
    0,
  )

  // 2) 선택 앨범 이동
  tl.to(
    mesh.position,
    {
      x: -1,
      y: 1.55,
      z: 2.0,
      duration: 1,
      ease: 'power3.out',
      onComplete: () => {
        startVinylRotation()
      },
    },
    0.1,
  )

  // 3) 카메라 이동
  tl.to(
    camera.position,
    {
      x: 0.2,
      y: 1.6,
      z: 5.0,
      duration: 0.8,
      ease: 'power3.out',
    },
    0.1,
  )
}

function getNormalizedMouse(event) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()

  // 캔버스 안에서의 좌표 (0 ~ rect.width / rect.height)
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // -1 ~ 1 범위로 변환
  mouse.x = (x / rect.width) * 2 - 1
  mouse.y = -(y / rect.height) * 2 + 1
}

function handleClick(event) {
  if (!camera) return

  getNormalizedMouse(event)

  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObjects(albumMeshes)

  if (hits.length > 0 && !selectedMesh) {
    selectedMesh = hits[0].object
    onSelectAlbum(selectedMesh)
  }
}

function handleMouseMove(event) {
  if (!camera) return

  getNormalizedMouse(event)

  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObjects(albumMeshes)

  const hitMesh = hits.length > 0 ? hits[0].object : null
  // 이하 동일…

  if (hitMesh === hoveredMesh) return

  // 이전 호버 복원
  if (hoveredMesh && hoveredMesh !== selectedMesh) {
    const baseY = hoveredMesh.userData.baseY ?? hoveredMesh.userData.originalPosition.y
    gsap.to(hoveredMesh.position, {
      y: baseY,
      duration: 0.25,
      ease: 'power2.out',
    })
  }

  hoveredMesh = hitMesh

  // 새로 호버된 앨범 올리기
  if (hoveredMesh && hoveredMesh !== selectedMesh) {
    const baseY = hoveredMesh.userData.baseY ?? hoveredMesh.userData.originalPosition.y
    gsap.to(hoveredMesh.position, {
      y: baseY + 0.2,
      duration: 0.25,
      ease: 'power2.out',
    })
  }
}

function handleResize() {
  const wrapper = wrapperRef.value
  if (!camera || !renderer || !wrapper) return

  const { clientWidth, clientHeight } = wrapper
  camera.aspect = clientWidth / clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(clientWidth, clientHeight)
}

// ====== 되돌리기(Back 버튼) ======
// function resetSelection() {
//   if (!selectedMesh) return
//   const audio = audioRef.value
//   const playerUI = playerUIRef.value
//   if (lpSpinTween) {
//     lpSpinTween.kill()
//     lpSpinTween = null
//   }
//   gsap.to(lpGroup.position, {
//     x: -1,
//     duration: 0.5,
//     ease: 'power3.in',
//     onComplete: () => {
//       ;((lpGroup.visible = false), (lpGroup.rotation.z = 0))
//       const originalPos = selectedMesh.userData.originalPosition
//       if (originalPos) {
//         gsap.to(selectedMesh.position, {
//           x: originalPos.x,
//           y: originalPos.y,
//           z: originalPos.z,
//           duration: 0.6,
//           ease: 'power3.inOut',
//         })
//       }
//       // 앨범 opacity 복구
//       gsap.to(
//         albumMeshes.map((m) => m.material),
//         {
//           opacity: 1,
//           duration: 0.4,
//           stagger: 0.02,
//         },
//       )
//       // 카메라 복구
//       if (initialCameraPosition) {
//         gsap.to(camera.position, {
//           x: initialCameraPosition.x,
//           y: initialCameraPosition.y,
//           z: initialCameraPosition.z,
//           duration: 0.6,
//           ease: 'power3.inOut',
//         })
//       }
//       // UI 숨기고 음악 정지
//       if (playerUI) {
//         gsap.to(playerUI, {
//           opacity: 0,
//           transform: 'translateX(20px)',
//           duration: 0.4,
//         })
//       }
//       if (audio) {
//         audio.pause()
//         audio.currentTime = 0
//       }
//       selectedMesh = null
//     },
//   })
// }

// ====== 애니메이션 루프 ======
function animate() {
  animationId = requestAnimationFrame(animate)
  updateProgress()
  renderer.render(scene, camera)
}

// ====== 라이프사이클 ======
onMounted(async () => {
  initThree()

  await loadTracks() // ✅ 트랙 먼저 로드
  createLP()

  console.log('tracks after load:', tracks.value)
  console.log('selectedPlace in AlbumScene:', props.selectedPlace)

  animate()

  const canvas = canvasRef.value
  if (canvas) {
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('mousemove', handleMouseMove)
  }

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  const canvas = canvasRef.value
  if (canvas) {
    canvas.removeEventListener('click', handleClick)
    canvas.removeEventListener('mousemove', handleMouseMove)
  }
  window.removeEventListener('resize', handleResize)
  if (animationId) cancelAnimationFrame(animationId)
})

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.scene-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.album-carousel-overlay {
  height: 100%;
  width: 100%;
  position: absolute;
  inset: 0;
  pointer-events: auto;
}
canvas#scene {
  width: 100%;
  height: 100%;
  display: block;
}

.player-container {
  position: absolute;
  top: 50%;
  right: 5%;
  width: 600px;
  height: 500px;
  transform: translateY(-50%);
  opacity: 0;
  pointer-events: none; /* 클릭 방지 (원하면) */
  transition: none; /* CSS transition 제거 */
}

.loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.55);
  color: #e5e7eb;
}

.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 6;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.close-btn:hover {
  transform: scale(1.05);
  background: rgba(0, 0, 0, 0.75);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.back-btn {
  border: none;
  outline: none;
  background: #f97316;
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.8rem;
}

.progress-bar-outer {
  margin-top: 12px;
  width: 100%;
  height: 4px;
  background: rgba(148, 163, 184, 0.4);
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar-inner {
  width: 0;
  height: 100%;
  background: #f97316;
}
</style>
