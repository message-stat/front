<template>
  <div>
    <Card :loading="loading1" :elapsed="elapsed1">
      <h2>Количество по времени</h2>
      <TimeSeriesChart url="/load/messageCountByTime" type="bar" @update:loading="e => loading1 = e"
        @update:elapsed="e => elapsed1 = e" />
    </Card>

    <Card :loading="loading4" :elapsed="elapsed4">
      <h2>Длина сообщений по времени</h2>
      <div class="desc">
        Длина по:
        <select v-model="variant">
          <option value="word">словам</option>
          <option value="char">символам</option>
        </select>
      </div>
      <TimeSeriesChart url="/load/messageLengthByTime" type="line" @update:loading="e => loading4 = e"
        @update:elapsed="e => elapsed4 = e" :params="params" />
      <p class="desc">На этом графике отображается средняя длина сообщения в словах за определённый период</p>
    </Card>

  </div>

</template>


<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import Card from '../../components/Card.vue';
import TimeSeriesChart from '../../components/TimeSeriesChart.vue';

const variant = ref<'word' | 'char'>('char');
const params = computed(() => ({ variant: variant.value }));

watchEffect(() => {
  console.log(variant.value);
});

const loading1 = ref(true);
const elapsed1 = ref(0);

const loading4 = ref(true);
const elapsed4 = ref(0);
</script>


<style scoped lang="scss">
.card {
  .chart {
    margin: 10px;
  }
}
</style>
