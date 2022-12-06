<template>
  <div>
    <WordCloud />

    <Card :loading="loading4" :elapsed="elapsed4">
      <h2>Распределение длины слов (количество от длины)</h2>
      <VuePlotly class="chart" :data="data4" :layout="layout4" />
    </Card>

    <Card :loading="loading3" :elapsed="elapsed3">
      <h2>Длина слов по времени</h2>
      <TimeSeriesChart url="/load/wordLengthByTime" type="line" @update:loading="e => loading3 = e"
        @update:elapsed="e => elapsed3 = e" />
      <p class="desc">На этом графике отображается средняя длина слова за определённый период</p>
    </Card>
  </div>

</template>


<script setup lang="ts">
import axios from 'axios';
import { Data } from 'plotly.js';
import { ref, watchEffect } from 'vue';
import Card from '../../../components/Card.vue';
import TimeSeriesChart from '../../../components/TimeSeriesChart.vue';
import VuePlotly from '../../../components/VuePlotly.vue';
import { serverColor, userColor } from '../../../constants';
import { lineLayout, LoadChartResult } from '../../../core/analytics/defaultChart';
import { userIdHash } from '../../../storage/user';
import WordCloud from './WordCloud.vue';



const loading3 = ref(true);
const elapsed3 = ref(0);

const loading4 = ref(true);
const elapsed4 = ref(0);
const data4 = ref<Data[]>([])
const layout4: typeof lineLayout = {
  ...lineLayout,
  yaxis: {
    autorange: true,
    fixedrange: true,
  }
}

watchEffect(async () => {
  loading3.value = true;
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/load/wordLengthDistribution`, { params: { userId: userIdHash.value } })

  const { server, user } = res.data as LoadChartResult

  console.log(server, user);


  data4.value = [
    {
      x: server.map(t => t.x),
      y: server.map(t => t.y),
      name: 'Общий',
      type: 'bar',
      marker: { color: serverColor },
    }]

  if (user) {
    data4.value.push({
      x: user.map(t => t.x),
      y: user.map(t => t.y),
      name: 'Вы',
      type: 'bar',
      marker: { color: userColor },
    })
  }

  loading4.value = false;
  elapsed4.value = res.data.elapsed;
})

</script>


<style scoped lang="scss">

</style>
