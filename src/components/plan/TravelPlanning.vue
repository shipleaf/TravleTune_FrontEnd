<template>
  <div v-if="trips.length === 0" class="travel-empty">
    <div class="travel-empty__inner">
      <p class="travel-empty__text">
        아직 일정이 없어요 일정 만들기를 통해 새로운 여행을 떠나보세요!
      </p>

      <div class="btn-container">
        <button class="btn-purple" type="button" @click="open = true">
          <Plus class="btn-purple__icon" />
          새로운 여행
        </button>
      </div>
      <NewPlanModal v-if="open" v-model="open" @accept="onAccept" @decline="onDecline" />
    </div>
  </div>

  <div v-else class="travel">
    <section class="travel-section">
      <div class="travel-section__head">
        <h2 class="travel-section__title">다가오는 일정</h2>

        <button class="btn-purple btn-purple--sm" type="button" @click="open = true">
          <Plus class="btn-purple__icon" />
          새로운 여행
        </button>
        <NewPlanModal v-if="open" v-model="open" @accept="onAccept" @decline="onDecline" />
      </div>

      <p v-if="upcomingTrips.length === 0" class="muted">
        아직 일정이 없어요 일정 만들기를 통해 새로운 여행을 떠나보세요!
      </p>

      <div v-else class="trip-grid">
        <TripCard
          v-for="trip in upcomingTrips"
          :key="trip.trip_id"
          :trip="trip"
          @click="movePlanDetail(trip.trip_id)"
        />
      </div>
    </section>

    <section class="travel-section">
      <h2 class="travel-section__title travel-section__title--with-gap">지난 일정</h2>

      <p v-if="pastTrips.length === 0" class="muted">No past trips yet.</p>

      <div v-else class="trip-grid">
        <TripCard
          v-for="trip in pastTrips"
          :key="trip.trip_id"
          :trip="trip"
          :isPast="true"
          @click="movePlanDetail(trip.trip_id)"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TripCard from './TripCard.vue'
import { Plus } from 'lucide-vue-next'
import NewPlanModal from './NewPlanModal.vue'
import { getTripImageMock, getTripsMock } from '@/api/tripApi'
import { useRouter } from 'vue-router'

const router = useRouter()

const trips = ref([])
const open = ref(false)

const movePlanDetail = (tripId) => {
  router.push({
    name: 'plan-detail',
    params: { plan_id: tripId },
  })
}

// TODO: 이미지 렌더링 최적화
const todayTs = new Date().setHours(0, 0, 0, 0)

const pastTrips = computed(() => trips.value.filter((t) => t._endTs < todayTs))
const upcomingTrips = computed(() => trips.value.filter((t) => t._startTs >= todayTs))

onMounted(async () => {
  const res = await getTripsMock()

  console.log(res)

  // const base = res.data.data.map((t) => ({
  const base = res.data.map((t) => ({
    ...t,
    _startTs: Date.parse(t.start_date),
    _endTs: Date.parse(t.end_date),
  }))

  const withImages = await Promise.all(
    base.map(async (trip) => {
      const imageRes = await getTripImageMock(trip.trip_id)
      return { ...trip, image: imageRes.data.image_url }
    }),
  )

  trips.value = withImages
})
</script>

<style lang="scss" scoped>
.travel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 48px;
  overflow-y: auto;
}

.travel-section {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: var(--foreground, #f4f4f5);

    &--with-gap {
      margin-bottom: 16px;
    }
  }
}

.trip-grid {
  display: grid;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.muted {
  color: rgba(244, 244, 245, 0.65);
  font-size: 14px;
}

.travel-empty {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;

  &__inner {
    text-align: left;
    max-width: 520px;
  }

  &__text {
    margin: 0;
    font-size: 18px;
    color: rgba(244, 244, 245, 0.7);
    text-align: left;
  }
}

.btn-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.btn-purple {
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  background: var(--accent-purple, #a78bfa);
  color: var(--accent-purple-foreground, #0b0b10);
  box-shadow: 0 14px 40px rgba(167, 139, 250, 0.2);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow: 0 18px 48px rgba(167, 139, 250, 0.3);
    transform: translateY(-1px);
  }

  &__icon {
    width: 16px;
    height: 16px;
  }

  &--sm {
    margin-top: 0;
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
