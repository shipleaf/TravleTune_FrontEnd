<template>
  <aside class="sidebar">
    <div class="sidebar-inner">
      <!-- 검색 영역 -->
      <div class="sidebar-search">
        <div class="sidebar-search-input-wrapper">
          <input
            v-model="keyword"
            type="text"
            class="sidebar-search-input"
            placeholder="떠나고 싶은 관광지를 입력해 주세요"
          />
          <button class="setting-btn" type="button" @click="openRegionModal">
            <span class="bar bar1"></span>
            <span class="bar bar2"></span>
            <span class="bar bar1"></span>
          </button>
        </div>
      </div>

      <!-- 검색 결과 리스트 -->
      <div class="sidebar-list">
        <SpotCard
          v-for="spot in mockSpots"
          :key="spot.attraction_id"
          :spot="spot"
          @click="handleSelectSpot(spot)"
        />
      </div>
    </div>
  </aside>

  <Teleport to="body">
    <div v-if="showRegionModal" class="region-overlay" @click.self="closeRegionModal">
      <SiGunguSelectForm @close="closeRegionModal" />
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SpotCard from './SpotCard.vue'
import SiGunguSelectForm from './SiGunguSelectForm.vue'
import { useSpotStore } from '@/stores/spot'

const store = useSpotStore()

const { setSelectedSpot } = store

const keyword = ref('')

// 🔹 모달 열림 상태
const showRegionModal = ref(false)

const openRegionModal = () => {
  showRegionModal.value = true
}

const closeRegionModal = () => {
  showRegionModal.value = false
}

// 🔹 ESC 키로 닫기
const handleKeydown = (e) => {
  if (e.key === 'Escape' && showRegionModal.value) {
    closeRegionModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const mockSpots = ref([
  {
    attraction_id: 1,
    title: '경복궁',
    image:
      'https://media.istockphoto.com/id/1676101015/ko/%EC%82%AC%EC%A7%84/%EA%B2%BD%EB%B3%B5%EA%B6%81%EC%9D%80-%EC%84%9D%EC%96%91%EC%9D%B4-%EC%95%84%EB%A6%84%EB%8B%B5%EA%B3%A0-%EC%84%9C%EC%9A%B8-%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD.jpg?s=612x612&w=0&k=20&c=gKZvvJAShxWls229xvzBJlCHJMJF9rOJn-yOYn1ACeA=',
    description:
      '공주시 원도심에 자리 잡은 가가상점은 공주 지역에서 활동하는 예술가 단체, 화가, 공방들이 기획하고 제작한 로컬 굿즈를 판매하고 있으며, 여행자와 방문자를 위한 추천 도서와 관련 상품들도 판매하고 있다. 굿즈들은 엽서, 스티커, 마스킹테이프, 책갈피, 그립톡 등 다양한 제품이 준비되어 있으며 아기자기한 디자인으로 시간 가는 줄 모르고 구경하게 된다.',
    addr1: '서울특별시 종로구',
    addr2: '사직동',
    latitude: 37.579617,
    longitude: 126.977041,
  },
  {
    attraction_id: 2,
    title: '북촌 한옥마을',
    image:
      'https://media.triple.guide/triple-cms/c_limit,f_auto,h_1024,w_1024/62a8d636-234e-4903-b4fb-5dd079c7bee3.jpeg',
    description: '전통 한옥 골목과 감성적인 풍경',
    addr1: '서울특별시 종로구',
    addr2: '계동',
    latitude: 37.582604,
    longitude: 126.983998,
  },
  {
    attraction_id: 3,
    title: '해운대 해수욕장',
    image:
      'https://i.namu.wiki/i/hkDOgJHC40yiIFKQDRz7YjHpzWrL9vCTT7mve4TF6Lj-GpGsBpvT8WlXbwOT_To1Ndl1zKrVLQ-SiwaGNFOgQA.webp',
    description: '파도 소리와 야경이 예쁜 부산 대표 해변',
    addr1: '부산광역시 해운대구',
    addr2: '우동',
    latitude: 35.158699,
    longitude: 129.160384,
  },
  {
    attraction_id: 4,
    title: '감천문화마을',
    image:
      'https://cdn.sanity.io/images/nxpteyfv/goguides/d47e6af783f73cb63ef98a6153f1029064348ebf-1600x1066.jpg',
    description: '알록달록 벽화와 골목 뷰 맛집',
    addr1: '부산광역시 사하구',
    addr2: '감천동',
    latitude: 35.097263,
    longitude: 129.010202,
  },
  {
    attraction_id: 5,
    title: '성산일출봉',
    image:
      'https://www.telltrip.com/wp-content/uploads/2025/08/seongsan-ilchulbong-jeju-unesco3.webp',
    description: '일출로 유명한 제주 대표 자연 명소',
    addr1: '제주특별자치도 서귀포시',
    addr2: '성산읍',
    latitude: 33.458889,
    longitude: 126.9425,
  },
  {
    attraction_id: 6,
    title: '안동 하회마을',
    image: 'https://cdn.ardentnews.co.kr/news/photo/202506/6639_31472_5340.jpg',
    description: '한국적인 정취가 살아있는 전통 마을',
    addr1: '경상북도 안동시',
    addr2: '풍천면',
    latitude: 36.538611,
    longitude: 128.518333,
  },
  {
    attraction_id: 7,
    title: '경주 불국사',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHh7SfRmRY-QnIhGSAUooX6TTLVBw23IApEQ&s',
    description: '천년 고도 경주의 대표 사찰',
    addr1: '경상북도 경주시',
    addr2: '진현동',
    latitude: 35.79,
    longitude: 129.3316,
  },
  {
    attraction_id: 8,
    title: '남이섬',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqW0IT7Zat4O4TgoH9Hgv-rk2Z_BH39VYmxw&s',
    description: '사계절 내내 산책하기 좋은 섬',
    addr1: '강원특별자치도 춘천시',
    addr2: '남산면',
    latitude: 37.7917,
    longitude: 127.525,
  },
])

const handleSelectSpot = (spot) => {
  setSelectedSpot(spot)
}
</script>

<style scoped>
.sidebar {
  position: relative;
  width: 30%;
  min-width: 500px;
  height: 70%;
  overflow-y: auto;
  overflow-x: visible;
  background: color-mix(in oklch, var(--sidebar) 80%, transparent);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.sidebar-inner {
  overflow-x: visible;

  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
}

.sidebar-search {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-search-input-wrapper {
  position: relative;
  display: flex;
  gap: 12px;
}

.sidebar-search-input {
  display: flex;
  flex: 1;
  border-radius: 12px;
  border: 1px solid var(--input);
  padding: 14px;
  background: color-mix(in oklch, var(--background) 60%, transparent);
  color: var(--foreground);
  font-size: 14px;

  &:focus {
    outline: none;
  }
}

.sidebar-search-input::placeholder {
  color: var(--muted-foreground);
}

.sidebar-search-button {
  width: 100%;
  border-radius: 12px;
  border: none;
  padding: 10px 14px;
  background: var(--sidebar-primary);
  color: var(--sidebar-primary-foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(56, 189, 248, 0.3);
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.sidebar-search-button:hover {
  background: color-mix(in oklch, var(--sidebar-primary) 90%, white 10%);
  box-shadow: 0 12px 30px rgba(56, 189, 248, 0.4);
  transform: translateY(-1px);
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
  display: flex;
  flex-direction: column;
}

/* 시군구 토글 버튼 */
.setting-btn {
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border-radius: 10px;
  cursor: pointer;
  border: none;
}
.bar {
  width: 50%;
  height: 2px;
  background-color: rgb(229, 229, 229);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 2px;
}
.bar::before {
  content: '';
  width: 2px;
  height: 2px;
  background-color: rgb(126, 117, 255);
  position: absolute;
  border-radius: 50%;
  border: 2px solid white;
  transition: all 0.3s;
  box-shadow: 0px 0px 5px white;
}
.bar1::before {
  transform: translateX(-4px);
}
.bar2::before {
  transform: translateX(4px);
}
.setting-btn:hover .bar1::before {
  transform: translateX(4px);
}
.setting-btn:hover .bar2::before {
  transform: translateX(-4px);
}

/* 🔹 전체 화면 오버레이 */
.region-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>
