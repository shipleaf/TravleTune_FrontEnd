<template>
  <div class="scene-wrapper" ref="wrapperRef">
    <!-- Three.js 캔버스 -->
    <canvas ref="canvasRef" id="scene"></canvas>

    <!-- 플레이어 UI (오버레이) -->
    <div ref="playerUIRef" id="player-ui" class="player-ui">
      <div class="player-header">
        <button class="back-btn" @click="resetSelection">Back</button>
      </div>
      <div class="player-body">
        <!-- 곡 정보 등 원하는 UI 넣기 -->
        <div class="progress-bar-outer">
          <div ref="progressRef" id="progress" class="progress-bar-inner"></div>
        </div>
      </div>
    </div>

    <!-- 실제 오디오 -->
    <audio ref="audioRef" id="audio" src="/audio/sample.mp3"></audio>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'

// ====== 템플릿 ref ======
const canvasRef = ref(null)
const playerUIRef = ref(null)
const progressRef = ref(null)
const audioRef = ref(null)
const wrapperRef = ref(null)

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
let initialCameraPosition = null

// ====== 앨범 데이터 ======
const albums = [
  { texture: '/src/assets/img/album1.jpg' },
  { texture: '/src/assets/img/album2.jpg' },
  { texture: '/src/assets/img/album3.jpg' },
  { texture: '/src/assets/img/album4.jpg' },
  { texture: '/src/assets/img/album5.jpg' },
  { texture: '/src/assets/img/album6.jpg' },
  { texture: '/src/assets/img/album7.jpg' },
  { texture: '/src/assets/img/album8.jpg' },
  { texture: '/src/assets/img/album9.jpg' },
  { texture: '/src/assets/img/album10.jpg' },
]

// ====== 초기화 함수들 ======
function initThree() {
  const canvas = canvasRef.value
  const wrapper = wrapperRef.value
  if (!canvas || !wrapper) return

  const { clientWidth, clientHeight } = wrapper

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(clientWidth, clientHeight)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  camera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 100)
  camera.position.set(0, 1.6, 6)
  scene.add(camera)

  initialCameraPosition = camera.position.clone()

  light = new THREE.DirectionalLight(0xffffff, 1.4)
  light.position.set(2, 4, 5)
  scene.add(light)
}

function createAlbums() {
  const loader = new THREE.TextureLoader()

  albums.forEach((album, idx) => {
    const tex = loader.load(album.texture)
    const geo = new THREE.PlaneGeometry(1, 1)
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    })

    const mesh = new THREE.Mesh(geo, mat)

    const spacing = 0.6
    const startX = -((albums.length - 1) * spacing) / 2
    const baseY = 1.5

    mesh.position.set(startX + idx * spacing, baseY, 0)

    mesh.userData.originalPosition = mesh.position.clone()
    mesh.userData.baseY = baseY
    mesh.userData.index = idx

    scene.add(mesh)
    albumMeshes.push(mesh)
  })
}

function createLP() {
  scene.add(lpGroup)

  const texLoader = new THREE.TextureLoader()
  const tex = texLoader.load('/textures/lp.png', () => {
    console.log('LP 텍스처 로드 완료')
  })

  const lpGeo = new THREE.CircleGeometry(0.8, 128)
  const lpMat = new THREE.MeshStandardMaterial({
    map: tex,
    metalness: 0.7,
    roughness: 0.45,
    transparent: true,
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
    lpGroup.position.set(1.5, 1.5, 0.5)
  } else {
    // 보통 비율 → 살짝 오른쪽/위
    lpGroup.position.set(0.8, 1.5, 0.5)
  }

  lpGroup.visible = false
}

// ====== LP 회전 ======
function startVinylRotation() {
  lpGroup.visible = true
  console.log('lpGroup visible?', lpGroup.visible, lpGroup.position)

  gsap.fromTo(lpGroup.position, { x: -1 }, { x: -0.1, duration: 1.5, ease: 'power3.out' })

  if (lpSpinTween) {
    lpSpinTween.kill()
  }

  lpSpinTween = gsap.to(lpGroup.rotation, {
    z: '-=6.283', // 2π
    duration: 2.0,
    repeat: -1,
    ease: 'none',
    modifiers: {
      z: gsap.utils.wrap(0, Math.PI * 2),
    },
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
      x: -0.5,
      y: 1.55,
      z: 2.0,
      duration: 0.8,
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

  // 4) 플레이어 UI 등장 + 음악 재생
  const playerUI = playerUIRef.value
  const audio = audioRef.value

  tl.to(
    playerUI,
    {
      opacity: 1,
      transform: 'translateX(0)',
      duration: 0.6,
      onStart() {
        // TODO: 선택된 앨범 텍스처를 LP 라벨에 입히고 싶으면 여기서 처리
        if (audio) {
          audio.play()
        }
      },
    },
    0.7,
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
function resetSelection() {
  if (!selectedMesh) return

  const audio = audioRef.value
  const playerUI = playerUIRef.value

  if (lpSpinTween) {
    lpSpinTween.kill()
    lpSpinTween = null
  }

  gsap.to(lpGroup.position, {
    x: -1,
    duration: 0.5,
    ease: 'power3.in',
    onComplete: () => {
      ;((lpGroup.visible = false), (lpGroup.rotation.z = 0))

      const originalPos = selectedMesh.userData.originalPosition
      if (originalPos) {
        gsap.to(selectedMesh.position, {
          x: originalPos.x,
          y: originalPos.y,
          z: originalPos.z,
          duration: 0.6,
          ease: 'power3.inOut',
        })
      }

      // 앨범 opacity 복구
      gsap.to(
        albumMeshes.map((m) => m.material),
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.02,
        },
      )

      // 카메라 복구
      if (initialCameraPosition) {
        gsap.to(camera.position, {
          x: initialCameraPosition.x,
          y: initialCameraPosition.y,
          z: initialCameraPosition.z,
          duration: 0.6,
          ease: 'power3.inOut',
        })
      }

      // UI 숨기고 음악 정지
      if (playerUI) {
        gsap.to(playerUI, {
          opacity: 0,
          transform: 'translateX(20px)',
          duration: 0.4,
        })
      }
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }

      selectedMesh = null
    },
  })
}

// ====== 애니메이션 루프 ======
function animate() {
  animationId = requestAnimationFrame(animate)
  updateProgress()
  renderer.render(scene, camera)
}

// ====== 라이프사이클 ======
onMounted(() => {
  initThree()
  createAlbums()
  createLP()
  animate()

  window.addEventListener('click', handleClick)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClick)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)

  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.scene-wrapper {
  position: relative;
  width: 100%;
}

canvas#scene {
  width: 100%;
  height: 100%;
  display: block;
}

/* 간단한 플레이어 UI 스타일 예시 */
.player-ui {
  position: absolute;
  right: 40px;
  bottom: 40px;
  width: 260px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  opacity: 0;
  transform: translateX(20px);
  pointer-events: auto;
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
