<template>
  <VuePlotly class="chart" :data="data" :layout="layout" @plotly-relayout="onZoom" />
</template>


<script setup lang="ts">
import VuePlotly from '@/components/VuePlotly.vue'
import axios from 'axios';
import { Data, Layout } from 'plotly.js';
import { onMounted, ref, watchEffect } from 'vue';
import { serverColor, userColor } from '../constants';
import { userIdHash } from '../storage/user';

const props = defineProps<{
  url: string;
}>()

const layout = ref<Partial<Layout>>({
  height: 500,
  margin: { t: 20, b: 10, l: 40, r: 10 },
  barmode: 'overlay',
  xaxis: {
    autorange: true,
    rangeslider: {
      thickness: 0.1
    },
    type: 'date'
  },
  yaxis: {
    autorange: true,
    type: 'linear'
  }
})

const data = ref<Data[]>([])

function onZoom(e) {
  console.log(e);
}

watchEffect(async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}${props.url}`, { params: { userId: userIdHash.value } })
  const { server, user } = res.data
  console.log(res);

  data.value = [{
    x: server.data.map(t => t.x),
    y: server.data.map(t => t.y),
    type: 'bar',
    line: { color: serverColor, shape: 'spline' },
    marker: { color: serverColor },
    name: 'Сервер',

  }]

  if (user) {
    data.value.push({
      x: user.data.map(t => t.x),
      y: user.data.map(t => t.y),
      type: 'bar',
      line: { color: userColor, shape: 'spline' },
      marker: { color: userColor },
      name: 'Вы',
    })
  }

})

</script>

<style scoped>
.chart {
  /* margin: 10px; */
}
</style>
