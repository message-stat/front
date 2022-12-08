<template>
  <VuePlotly class="chart" :data="data" :layout="layout" @plotly-relayout="onZoom" />
</template>


<script setup lang="ts">
import VuePlotly from '@/components/VuePlotly.vue'
import { computed } from '@vue/reactivity';
import axios from 'axios';
import { AxisType, Data, Layout } from 'plotly.js';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { serverColor, userColor } from '../constants';
import { LoadChartResult } from '../core/analytics/defaultChart';
import { userIdHash } from '../storage/user';

const props = defineProps<{
  url: string;
  type: 'bar' | 'line';
  dataProcessor?: (data: LoadChartResult) => Data[];
  params?: any;
  yaxis?: AxisType;
}>()

const emit = defineEmits<{
  (event: 'update:loading', value: boolean): void,
  (event: 'update:elapsed', value: number): void,
}>()

const layout = ref<Partial<Layout>>({
  height: 500,
  margin: { t: 20, b: 10, l: 40, r: 10 },
  barmode: 'overlay',
  legend: {
    orientation: 'h',
    yanchor: 'bottom',
    y: 1.02,
    xanchor: 'left',
    x: 0,
  },
  xaxis: {
    autorange: true,
    rangeslider: {
      thickness: 0.1
    },
    type: 'date'
  },
  yaxis: {
    autorange: true,
    type: props.yaxis || 'linear'
  }
})

const data = ref<Data[]>([])

function onZoom(e) {
  console.log(e);
}

const chartType = computed(() => {
  if (props.type === 'bar') {
    return 'bar'
  }
  return 'scatter'
})

watchEffect(async () => {
  load()
})

let loadedData: LoadChartResult = null

async function load() {
  emit('update:loading', true)

  const res = await axios.get(`${import.meta.env.VITE_API_URL}${props.url}`, { params: { userId: userIdHash.value, ...props.params } })
  loadedData = res.data as LoadChartResult

  if (props.dataProcessor) {
    data.value = props.dataProcessor(loadedData)
    emit('update:elapsed', res.data.elapsed)
    emit('update:loading', false)
    return
  }

  const { server, user } = loadedData

  data.value = [{
    x: server.map(t => t.x),
    y: server.map(t => t.y),
    type: chartType.value,
    line: { color: serverColor, shape: 'spline' },
    marker: { color: serverColor },
    name: 'Общий',
  }]

  if (user) {
    data.value.push({
      x: user.map(t => t.x),
      y: user.map(t => t.y),
      type: chartType.value,
      line: { color: userColor, shape: 'spline' },
      marker: { color: userColor },
      name: 'Вы',
    })
  }

  emit('update:elapsed', res.data.elapsed)
  emit('update:loading', false)
}

function reprocessData() {
  if (props.dataProcessor) {
    data.value = props.dataProcessor(loadedData)
  }
}

defineExpose({
  reprocessData
})

</script>

<style scoped>

</style>
