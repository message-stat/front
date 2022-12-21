<template>
  <div>
    <Card :loading="chart1.loading.value" :elapsed="chart1.elapsed.value">
      <h2>График Y собеседников составляет X% общения</h2>
      <div class="desc">
        Общение это число отправленных:
        <select v-model="sumVariant">
          <option value="message">сообщений</option>
          <option value="word">слов</option>
          <option value="symbols">символов</option>
        </select>
      </div>

      <VuePlotly class="chart" :data="chart1.data.value" :layout="layout" />
    </Card>

    <div class="card">
      <h2>Кол во собеседников по времени. (C% общения происходим с Y людими по времени X)</h2>
      <p class="desc"><b>[В разработке]</b></p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import Card from '../../components/Card.vue';
import VuePlotly from '../../components/VuePlotly.vue';
import { serverColor, userColor } from '../../constants';
import { lineLayout } from '../../core/analytics/defaultChart';
import { userIdHash } from '../../storage/user';
import { useChartLoader } from './useLoader';

const layout: typeof lineLayout = {
  ...lineLayout,
  yaxis: {
    type: 'log',
    autorange: true,
    fixedrange: true,
  }
}

const sumVariant = ref<'message' | 'word' | 'symbols'>('message')

const params = computed(() => {
  return {
    userId: userIdHash.value,
    variant: sumVariant.value
  }
})


const chart1 = useChartLoader({
  url: 'messageDistribution',
  params,
  process: (r) => ({
    x: r.map(t => t.x),
    y: r.map(t => t.y)
  }),
  userAddition: {
    name: 'Вы',
    line: { color: userColor, shape: 'hvh' }
  },
  serverAddition: {
    name: 'Общий',
    line: { color: serverColor, shape: 'hvh' }
  },
  autoReload: true,
})

</script>


<style scoped lang="scss">
.card {
  .chart {
    margin: 10px;
  }
}
</style>
