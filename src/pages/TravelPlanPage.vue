<template>
  <div class="page">
    <HeaderBar />
    <TravelPlanning />
  </div>
</template>

<script setup>
import HeaderBar from '@/components/common/HeaderBar.vue'
import TravelPlanning from '@/components/plan/TravelPlanning.vue'
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
}
</style>
