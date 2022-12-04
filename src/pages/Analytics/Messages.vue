<template>
  <div>
    <Card :loading="true">
      <h2>Количество по времени</h2>
    </Card>
    <Card>
      <h2>Средняя длина сообщения</h2>
      <p>слов/символов</p>
      <p>круговая диаграмма</p>
    </Card>
    <Card>
      <h2>Длина сообщений по времени</h2>
      <p>слов/символов</p>
    </Card>
  </div>

</template>


<script setup lang="ts">
import Card from '../../components/Card.vue';


</script>


<style scoped lang="scss">
.card {
  .chart {
    margin: 10px;
  }
}
</style>
