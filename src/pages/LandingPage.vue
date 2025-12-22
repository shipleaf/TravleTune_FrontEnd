<template>
  <div class="landing">
    <div class="landing__content">
      <NavBar />
      <HeroComponent />
      <!-- 
      <HowWeWork />
      <InnovativeServices />
      <ROICalculatorHome />
      <AnimatedFooter /> -->
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/landing/NavBar.vue'
import HeroComponent from '@/components/landing/HeroComponent.vue'
// import HowWeWork from '@/components/how-we-work/HowWeWork.vue'
// import InnovativeServices from '@/components/innovative-services/InnovativeServices.vue'
// import ROICalculatorHome from '@/components/roi-calculator-home/ROICalculatorHome.vue'
// import AnimatedFooter from '@/components/animated-footer/AnimatedFooter.vue'
</script>

<style lang="scss" scoped>
.landing {
  width: 100%;
  position: relative;
  min-height: 100vh;
  background: #000;
}

.landing__content {
  width: 100%;
  position: relative;
  z-index: 10;
}
</style>
