<template>
  <div class="card">
    <h2>Общее количество слов</h2>
    <TimeSeriesChart url="/load/wordCountByTime" />

  </div>
</template>

<script setup lang="ts">
import TimeSeriesChart from '../../../components/TimeSeriesChart.vue';



</script>
