<template>
  <div :id="plotlyId" ref="graphDiv"></div>
</template>
  
<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import Plotly from 'plotly.js-dist';
import { onMounted, ref, watch } from 'vue';
import { useDebounceFn, useResizeObserver } from '@vueuse/core';

const plotlyId = `plotly-${uuidv4()}`
const graphDiv = ref(null)


const props = defineProps<{ data: any, layout: any, config?: any, options?: any }>()
const emit = defineEmits<{
  (e: 'plotly-click', event: PointerEvent): void
  (e: 'plotly-hover', event: PointerEvent): void
  (e: 'plotly-relayout', data: any): void
}>()

onMounted(() => {
  setGraph()
})


const onResize = useDebounceFn(() => {
  setGraph()
}, 100)

useResizeObserver(graphDiv, onResize)

watch(() => props.data, () => setGraph())
watch(() => props.layout, () => setGraph())
watch(() => props.config, () => setGraph())

function setGraph() {
  Plotly.newPlot(plotlyId, props.data, props.layout, props.config);

  graphDiv.value.on('plotly_relayout', (data) => {
    emit('plotly-relayout', data);
  });
}
</script>
