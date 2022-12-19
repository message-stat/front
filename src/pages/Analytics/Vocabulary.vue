<template>
  <div>
    <div class="card">
      <h2>Параметры</h2>
      <div class="desc">
        Группировать по:
        <select v-model="groupVariant">
          <option value="word">слову</option>
          <option value="lemma">инфинитиву</option>
          <option value="stem">корню</option>
        </select>
      </div>

      <div class="desc">
        Минимальное количество раз использования слова:
        <input type="number" min="0" max="1000" v-model="minWordCount">
      </div>
    </div>
    <Card :loading="chart1.loading.value" :elapsed="chart1.elapsed.value">
      <h2>Словарный запас</h2>
      <VuePlotly class="chart" :data="chart1.data.value" :layout="layout" />
    </Card>

    <Card :loading="loadingByTime" :elapsed="elapsedByTime">
      <h2>Словарный запас по времени</h2>
      <TimeSeriesChart url="/load/wordDistributionByTime" type="line" :data-processor="processor" :params="params"
        ref="timeSeries" @update:elapsed="e => elapsedByTime = e" @update:loading="e => loadingByTime = e" />

      <div class="desc slider">
        <input type="range" id="volume" name="volume" min="5" max="100" v-model="percent">
        <label for="volume">{{ percent }}% речи</label>
      </div>

    </Card>
  </div>

</template>


<script setup lang="ts">
import axios from 'axios';
import { Data } from 'plotly.js-basic-dist';
import { computed, ref, watch, watchEffect } from 'vue';
import Card from '../../components/Card.vue';
import VuePlotly from '../../components/VuePlotly.vue';
import { serverColor, userColor } from '../../constants';
import { groupBy, lineLayout, LoadChartResult } from '../../core/analytics/defaultChart';
import { userIdHash } from '../../storage/user';
import { refDebounced, watchDebounced } from '@vueuse/core'
import { useChartLoader } from './useLoader';
import {
  ma, dma, ema, sma, wma
} from 'moving-averages'
import TimeSeriesChart from '../../components/TimeSeriesChart.vue';



const groupVariant = ref<'word' | 'lemma' | 'stem'>('stem');
const minWordCount = ref<string>('0');
const percent = ref(70);
const minWordCountDebounced = refDebounced(minWordCount, 700);

const timeSeries = ref<InstanceType<typeof TimeSeriesChart> | null>(null);

const loadingByTime = ref(false);
const elapsedByTime = ref(0);

const layout: typeof lineLayout = {
  ...lineLayout,
  yaxis: {
    type: 'log',
    autorange: true,
    fixedrange: true,
  }
}

const params = computed(() => {
  return {
    userId: userIdHash.value,
    minWordCount: Number.parseInt(minWordCountDebounced.value) ?? 0,
    groupVariant: groupVariant.value,
  }
})

const chart1 = useChartLoader({
  url: 'wordDistribution',
  params,
  process: (r) => ({
    x: r.map(t => t.x),
    y: r.map(t => t.y)
  }),
  userAddition: {
    name: 'Вы',
    line: { color: userColor, shape: 'spline' }
  },
  serverAddition: {
    name: 'Общий',
    line: { color: serverColor, shape: 'spline' }
  },
  autoReload: false,
})

watch(userIdHash, () => {
  chart1.load()
}, { immediate: true })


watchDebounced([minWordCount, groupVariant], () => {
  chart1.load()
}, { debounce: 700, maxWait: 10000 })


watch(percent, (v) => {
  timeSeries.value.reprocessData()
})

function processor(data: LoadChartResult): Partial<Data>[] {
  const server = data.server as any as { x: number, y: string, date: string }[]
  const grouped = groupBy(server, (t) => `${t.x}`)
  const number = `${percent.value}`

  if (!grouped[number]) return []

  const res = [{
    x: grouped[number].map(t => t.date),
    y: ma(grouped[number].map(t => Number.parseInt(t.y)), 5),
    name: 'Общий',
    line: { shape: 'spline', color: serverColor }
  }]

  const user = data.user as any as { x: number, y: string, date: string }[]
  if (user) {
    const grouped = groupBy(user, (t) => `${t.x}`)
    if (!grouped[number]) return res
    res.push({
      x: grouped[number].map(t => t.date),
      y: ma(grouped[number].map(t => Number.parseInt(t.y)), 5),
      name: 'Вы',
      line: { shape: 'spline', color: userColor }
    })
  }

  return res
}


</script>


<style scoped lang="scss">
.card {
  .chart {
    margin: 10px;
  }
}

.slider {
  display: flex;

  input {
    flex: 1;
  }

  label {
    min-width: 80px;
  }
}
</style>
