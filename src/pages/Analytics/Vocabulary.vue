<template>
  <div>
    <div class="card">
      <h2>Параметры</h2>
      <p>по корню</p>
      <p>по лексеме</p>
      <p>минимальное кол-во слов (использовалось больше 1 раза)</p>
    </div>
    <Card :loading="loading" :elapsed="elapsed">
      <h2>Гистограмма? использования слов</h2>
      <VuePlotly class="chart" :data="data" :layout="layout" />
    </Card>
    <div class="card">
      <h2>Словарный запас по времени</h2>
      <p>процент использования</p>
    </div>
  </div>

</template>


<script setup lang="ts">
import axios from 'axios';
import { Data } from 'plotly.js-basic-dist';
import { ref, watchEffect } from 'vue';
import Card from '../../components/Card.vue';
import VuePlotly from '../../components/VuePlotly.vue';
import { serverColor, userColor } from '../../constants';
import { lineLayout, LoadChartResult } from '../../core/analytics/defaultChart';
import { userIdHash } from '../../storage/user';


const layout: typeof lineLayout = {
  ...lineLayout,
  yaxis: {
    type: 'log',
    autorange: true,
    fixedrange: true,
  }
}

const data = ref<Data[]>([])
const loading = ref(true);
const elapsed = ref(0);

watchEffect(async () => {
  loading.value = true;
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/load/wordDistribution`, { params: { userId: userIdHash.value } })

  const { server, user } = res.data as LoadChartResult

  data.value = [
    {
      x: server.map(t => t.x),
      y: server.map(t => t.y).reduce((a, b) => {
        a.length === 0 ? a.push(b) : a.push(a[a.length - 1] + b)
        return a
      }, []),
      name: 'Общий',
      line: { color: serverColor, shape: 'spline' }
    }]

  if (user) {
    data.value.push({
      x: user.map(t => t.x),
      y: user.map(t => t.y).reduce((a, b) => {
        a.length === 0 ? a.push(b) : a.push(a[a.length - 1] + b)
        return a
      }, []),
      name: 'Вы',
      line: { color: userColor, shape: 'spline' }
    })
  }

  loading.value = false;
  elapsed.value = res.data.elapsed;
})


</script>


<style scoped lang="scss">
.card {
  .chart {
    margin: 10px;
  }
}
</style>
