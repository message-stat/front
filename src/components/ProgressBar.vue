<template>
  <div class="progress-bar">
    <div class="progress-indicator" :style="{ width, backgroundColor: color }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { Color } from 'csstype';


const props = defineProps<{
  progress: number;
  color?: Color;
}>();

const width = computed(() => `${props.progress * 100}%`);


</script>

<style lang="scss">
.progress-bar {
  position: relative;
  width: 100%;
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;

  .progress-indicator {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #4caf50;
    border-radius: 5px;
    transition: width 0.5s ease;
    width: 0;
  }
}
</style>
