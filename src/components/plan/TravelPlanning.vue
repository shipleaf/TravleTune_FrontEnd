<template>
  <div v-if="trips.length === 0" class="travel-empty">
    <div class="travel-empty__inner">
      <p class="travel-empty__text">
        You don't have any trips yet. Create a new itinerary and start your next journey!
      </p>

      <button class="btn-purple" type="button">
        <Plus class="btn-purple__icon" />
        Create New Trip
      </button>
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
        <NewPlanModal v-model="open" @accept="onAccept" @decline="onDecline" />
      </div>

      <p v-if="upcomingTrips.length === 0" class="muted">
        아직 일정이 없어요 일정 만들기를 통해 새로운 여행을 떠나보세요!
      </p>

      <div v-else class="trip-grid">
        <TripCard v-for="trip in upcomingTrips" :key="trip.id" :trip="trip" />
      </div>
    </section>

    <section class="travel-section">
      <h2 class="travel-section__title travel-section__title--with-gap">지난 일정</h2>

      <p v-if="pastTrips.length === 0" class="muted">No past trips yet.</p>

      <div v-else class="trip-grid">
        <TripCard v-for="trip in pastTrips" :key="trip.id" :trip="trip" :isPast="true" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TripCard from './TripCard.vue'
import { Plus } from 'lucide-vue-next'
import NewPlanModal from './NewPlanModal.vue'

const mockTrips = [
  {
    id: '1',
    title: 'Summer Adventure in Greece',
    destination: 'Santorini, Greece',
    startDate: '2024-06-15',
    endDate: '2024-06-25',
    image: '/src/assets/img/santorini-sunset.png',
    participants: [
      { id: '1', name: 'Sarah Chen', avatar: '/src/assets/img/IMG＿5083.jpg' },
      { id: '2', name: 'Mike Johnson', avatar: '/src/assets/img/IMG＿5083.jpg' },
      { id: '3', name: 'Emma Davis', avatar: '/src/assets/img/IMG＿5083.jpg' },
    ],
  },
  {
    id: '2',
    title: 'Tokyo Food Tour',
    destination: 'Tokyo, Japan',
    startDate: '2025-03-10',
    endDate: '2025-03-20',
    image: '/src/assets/img/tokyo-japan-neon-night.jpg',
    participants: [
      { id: '1', name: 'David Park', avatar: '/src/assets/img/IMG＿5083.jpg' },
      { id: '2', name: 'Lisa Wong', avatar: '/src/assets/img/IMG＿5083.jpg' },
    ],
  },
  {
    id: '3',
    title: 'Northern Lights Experience',
    destination: 'Reykjavik, Iceland',
    startDate: '2025-02-01',
    endDate: '2025-02-07',
    image: '/src/assets/img/reykjavik-iceland-northern-lights.jpg',
    participants: [
      { id: '1', name: 'Alex Smith', avatar: '/src/assets/img/IMG＿5083.jpg' },
      { id: '2', name: 'Jordan Lee', avatar: '/src/assets/img/IMG＿5083.jpg' },
      { id: '3', name: 'Casey Morgan', avatar: '/src/assets/img/IMG＿5083.jpg' },
      { id: '4', name: 'Riley Taylor', avatar: '/src/assets/img/IMG＿5083.jpg' },
    ],
  },
  {
    id: '4',
    title: 'Beach Getaway',
    destination: 'Bali, Indonesia',
    startDate: '2024-08-05',
    endDate: '2024-08-15',
    image: '/src/assets/img/bali-beach.png',
    participants: [{ id: '1', name: 'Chris Anderson', avatar: '/src/assets/img/IMG＿5083.jpg' }],
  },
]

const trips = ref(mockTrips)

const today = new Date()

const pastTrips = computed(() => trips.value.filter((trip) => new Date(trip.endDate) < today))

const upcomingTrips = computed(() =>
  trips.value.filter((trip) => new Date(trip.startDate) >= today),
)

const open = ref(false)
</script>

<style lang="scss" scoped>
.travel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 48px;
  overflow-y: auto;
  padding: 32px;

  @media (min-width: 1024px) {
    padding: 48px;
  }
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
    text-align: center;
    max-width: 520px;
  }

  &__text {
    margin: 0;
    font-size: 18px;
    color: rgba(244, 244, 245, 0.7);
  }
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
