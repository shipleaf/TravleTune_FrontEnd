<template>
  <div class="mood-card">
    <div class="prompt">
      <label class="prompt__label">뜨는 관광지</label>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.mood-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.prompt {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prompt__label {
  font-size: 22px;
  font-weight: 700;
  color: white;
}
.prompt__desc {
  font-size: 12px;
  line-height: 1.4;
  color: rgba(244, 244, 245, 0.55);
  margin-top: 2px;

  display: inline-block;
}
</style>
