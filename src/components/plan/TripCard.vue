<template>
  <div :class="['trip-card', isPast ? 'is-past' : '']">
    <div class="trip-image">
      <img :src="tripImage" :alt="destinationText" class="trip-image__img" />
      <div class="trip-image__gradient" />
    </div>

    <!-- Trip Info -->
    <div class="trip-body">
      <h3 class="trip-title">{{ trip.title }}</h3>

      <div class="trip-row">
        <MapPin class="trip-icon trip-icon--accent" />
        <span>{{ destinationText }}</span>
      </div>

      <div class="trip-row">
        <Calendar class="trip-icon trip-icon--primary" />
        <span>{{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}</span>
      </div>

      <!-- Participants -->
      <div class="participants">
        <div class="participants__stack">
          <div
            v-for="m in visibleMembers"
            :key="m.member_id"
            class="participants__item"
            @mouseenter="hoveredMemberId = m.member_id"
            @mouseleave="hoveredMemberId = null"
          >
            <img
              :src="m.profile_image || '/placeholder.svg'"
              :alt="m.nickname"
              class="participants__avatar"
            />
            <div v-if="hoveredMemberId === m.member_id" class="participants__tooltip">
              {{ m.nickname }}
            </div>
          </div>

          <div v-if="hasMoreMembers" class="participants__more">
            +{{ (trip.trip_members?.length || 0) - maxVisibleMembers }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar, MapPin } from 'lucide-vue-next'

const props = defineProps({
  trip: {
    type: Object,
    required: true,
  },
  isPast: {
    type: Boolean,
    default: false,
  },
})

const hoveredMemberId = ref(null)

const destinationText = computed(() => {
  const s = props.trip?.sido_name ?? ''
  const g = props.trip?.gungu_name ?? ''
  return [s, g].filter(Boolean).join(' ')
})

const tripImage = computed(() => props.trip?.image || '/placeholder.svg')

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}

const maxVisibleMembers = 3

const hasMoreMembers = computed(() => (props.trip.trip_members?.length || 0) > maxVisibleMembers)

const visibleMembers = computed(() => (props.trip.trip_members || []).slice(0, maxVisibleMembers))
</script>

<style lang="scss" scoped>
.trip-card {
  position: relative;
  // overflow: hidden;
  border-radius: 14px;
  background: var(--card, #0b0b10);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: rgba(124, 58, 237, 0.65); // primary 느낌
    box-shadow: 0 14px 40px rgba(124, 58, 237, 0.12);
  }

  &.is-past {
    opacity: 0.75;
  }
}

.trip-image {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .trip-card:hover &__img {
    transform: scale(1.05);
  }

  &__gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
    pointer-events: none;
  }

  &__badge {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(20, 20, 26, 0.75);
    color: rgba(255, 255, 255, 0.78);
    font-size: 12px;
    font-weight: 600;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}

.trip-body {
  padding: 18px 18px 20px;
}

.trip-title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground, #f4f4f5);
}

.trip-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(244, 244, 245, 0.75);
  margin-bottom: 10px;
}

.trip-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;

  &--accent {
    color: var(--accent-purple, #a78bfa);
  }
  &--primary {
    color: var(--primary, #7c3aed);
  }
}

.participants {
  margin-top: 12px;

  &__stack {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  // -space-x-2 느낌
  &__item {
    position: relative;

    &:not(:first-child) {
      margin-left: -8px;
    }
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    object-fit: cover;
    border: 2px solid var(--card, #0b0b10);
    transition:
      transform 0.15s ease,
      z-index 0.15s ease;
  }

  &__item:hover &__avatar {
    transform: scale(1.1);
    z-index: 10;
    position: relative;
  }

  &__tooltip {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    padding: 6px 10px;
    border-radius: 10px;
    background: rgba(28, 28, 34, 0.92);
    color: rgba(255, 255, 255, 0.92);
    font-size: 12px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 20;
  }

  &__more {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: rgba(244, 244, 245, 0.7);
    background: rgba(255, 255, 255, 0.06);
    border: 2px solid var(--card, #0b0b10);
    margin-left: -8px;
  }
}
</style>
