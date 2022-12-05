<template>
  <Card :loading="loading" :elapsed="elapsed">
    <h2>Общее количество слов</h2>
    <TimeSeriesChart url="/load/wordCountByTime" type="bar" @update:loading="e => loading = e"
      @update:elapsed="e => elapsed = e" />
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from '../../../components/Card.vue';
import TimeSeriesChart from '../../../components/TimeSeriesChart.vue';

const loading = ref(true);
const elapsed = ref(0);

</script>
