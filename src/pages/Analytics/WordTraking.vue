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

    <Card>
      <h2>Количество слов по времени</h2>

      <!-- <div class="desc">
        Масштаб:
        <select v-model="scale">
          <option value="absolute">абсолютный</option>
          <option value="relative">относительный</option>
        </select>
      </div> -->
      <TimeSeriesChart url="/load/wordTrakingByTime" type="line" :params="params"
        @update:elapsed="e => elapsedByTime = e" @update:loading="e => loadingByTime = e" />
    </Card>


    <!-- <div class="card">
      <h2>Количество слов по времени</h2>
    </div>
    <div class="card">
      <h2>Позиция слова</h2>
      <p>Круговая диаграмма расположения слова</p>
    </div> -->
  </div>
</template>


<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Card from '../../components/Card.vue';
import TimeSeriesChart from '../../components/TimeSeriesChart.vue';

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



</script>


<style scoped lang="scss">
.card {
  .chart {
    margin: 10px;
  }
}
</style>
