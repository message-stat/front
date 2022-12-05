<template>
  <div>
    <div class="card">
      <h2>Облако слов</h2>
      <p>Кол-во топ слов</p>
    </div>
    <div class="card">
      <h2>Распределение длины слов (количество от длины)</h2>
    </div>
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
import { ref, watchEffect } from 'vue';
import Card from '../../components/Card.vue';
import TimeSeriesChart from '../../components/TimeSeriesChart.vue';

const loading3 = ref(true);
const elapsed3 = ref(0);


</script>


<style scoped lang="scss">

</style>
