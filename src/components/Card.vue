<template>
  <div class="card">
    <div v-if="prop.loading" class="horizontal-bar-wrap">
      <div class="bar"></div>
    </div>
    <slot></slot>
    <p v-if="prop.elapsed" class="elapsed">e: {{ prop.elapsed }} </p>
  </div>
</template>

<script setup lang="ts">
const prop = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  elapsed: {
    type: Number,
    default: null
  }
})
</script>

<style scoped lang="scss">
@keyframes barWidth {
  0% {
    width: 0%;
  }

  50% {
    width: 100%;
  }

  100% {
    width: 0%;
  }
}

.elapsed {
  font-size: 0.8em;
  color: #aaa;
  text-align: right;
  position: absolute;
  bottom: 0px;
  right: 10px;
}

.card {
  position: relative;

  .horizontal-bar-wrap {
    height: 2px;
    display: block;
    position: absolute;
    top: 0;
    left: 10px;
    right: 10px;

    .bar {
      will-change: width;
      position: relative;
      width: 0%;
      height: 100%;
      margin: 0 auto;
      animation: barWidth;
      animation-duration: 5s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      border-radius: 1px;

      background: var(--server-color);
    }
  }
}
</style>
