<template>
  <div>
    <div class="card">
      <h2>Параметры</h2>
      <div class="desc">
        Слово:
        <input type="text" v-model="serachWord">
      </div>
      <div class="desc">
        Искать по:
        <select v-model="groupVariant">
          <option value="word">слову</option>
          <option value="lemma">инфинитиву</option>
          <option value="stem">корню</option>
        </select>
      </div>

      <button class="btn" @click="update">Обновить</button>
    </div>

    <Card :elapsed="elapsedByTime" :loading="loadingByTime">
      <h2>Количество слов по времени</h2>

      <div class="desc">
        Масштаб:
        <select v-model="scale">
          <option value="absolute">абсолютный</option>
          <option value="relative">относительный</option>
        </select>
        <p v-if="scale == 'absolute'" class="desc">Абсолютный масштаб графика отображает истенное количетсво слов,
          однако, может ввести Вас в заблуждение, так как частота использования слов зависит от объёма общения. Если Вы
          стали меньше общаться, то и абсолютное количетсво использования слова уменьшится</p>
      </div>
      <TimeSeriesChart url="/load/wordTrakingByTime" type="line" :params="params" :data-processor="processor"
        @update:elapsed="e => elapsedByTime = e" @update:loading="e => loadingByTime = e" />

    </Card>

    <Card :elapsed="elapsedByTime" :loading="loadingByTime">
      <h2>Позиция слова</h2>
      <VuePlotly class="chart" :data="pieWordPosition.data.value" :layout="pieLayout" />
    </Card>
  </div>
</template>


<script setup lang="ts">
import { Data, Layout } from 'plotly.js';
import { computed, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Card from '../../components/Card.vue';
import TimeSeriesChart from '../../components/TimeSeriesChart.vue';
import { serverColor, serverColors, userColor, userColors } from '../../constants';
import { LoadChartResult } from '../../core/analytics/defaultChart';
import {
  ma, dma, ema, sma, wma
} from 'moving-averages'
import VuePlotly from '../../components/VuePlotly.vue';
import { useChartLoader } from './useLoader';
import { userIdHash } from '../../storage/user';
import { tree } from 'd3-hierarchy';

const elapsedByTime = ref(0);
const loadingByTime = ref(false);

const route = useRoute()
const router = useRouter()

const groupVariant = ref<'word' | 'lemma' | 'stem'>('stem');
const serachWord = ref<string>(route.params.word as string);
const scale = ref<'absolute' | 'relative'>('absolute');

const params = ref({
  word: serachWord.value,
  group: groupVariant.value,
  scale: scale.value
})

const pieWordPosition = useChartLoader<{ name: string, count: number }>({
  url: 'pieWordPosition',
  params: computed(() => ({ ...params.value, userId: userIdHash.value })),
  process: (r, isUser) => ({
    labels: r.map(t => t.name),
    values: r.map(t => t.count),
    type: 'pie',
    marker: { colors: isUser ? userColors.slice(0, r.length) : serverColors.slice(0, r.length) },
  }),
  userAddition: {
    name: 'Вы',
    domain: { column: 1 },
  },
  serverAddition: {
    name: 'Общий',
    domain: { column: 0 },
  },
  autoReload: true,
})

const pieLayout: Partial<Layout> = {
  height: 500,
  grid: { rows: 1, columns: 2 }
};


watch(serachWord, (val) => {
  if (val)
    router.replace('/analytics/word-traking/' + val)
  else
    router.replace('/analytics/word-traking')
})

function update() {
  params.value = {
    word: serachWord.value,
    group: groupVariant.value,
    scale: scale.value
  }
}

watch(scale, update)


function processor(data: LoadChartResult): Partial<Data>[] {
  const server = data.server as any as { x: string, y: number }[]

  const res = [{
    x: server.map(t => t.x),
    y: ma(server.map(t => t.y), 5),
    name: 'Сервер',
    line: { shape: 'spline', color: serverColor }
  }]

  const user = data.user as any as { x: string, y: number }[]
  if (user) {

    res.push({
      x: user.map(t => t.x),
      y: ma(user.map(t => t.y), 5),
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
</style>
