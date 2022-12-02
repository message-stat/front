<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script setup lang="ts">
import AppLayoutDefault from '../layouts/AppLayoutDefault.vue';
import AnalyticsLayout from '../layouts/AnalyticsLayout.vue';
import { markRaw, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

const layout = shallowRef(markRaw(AppLayoutDefault))
const route = useRoute()

const preloadLayout = {
  'AnalyticsLayout': AnalyticsLayout
}

watch(() => route.meta,
  async meta => {
    try {

      if (!meta.layout) throw new Error('Layout not found');

      const layoutName = meta.layout as string;

      if (preloadLayout[layoutName]) {
        layout.value = markRaw(preloadLayout[layoutName])
        return;
      }

      const component = await import(/* @vite-ignore */`@/layouts/${meta.layout}.vue`)
      layout.value = component?.default || AppLayoutDefault

    } catch (e) {
      layout.value = AppLayoutDefault
    }

  },
  {
    immediate: true
  })
</script>
