<template>
  <div class="card">
    <h1>Выгрузка архива</h1>
    <div v-if="processor.processStatus.value == ProcessStatus.notStarted">
      <FileInput class="file" action-text="Для начала выгрузки" @input="process" />
      <p>
        <i>Повторная выгрузка архива обрабатывает все сообщения, но отправляет на сервер только новые</i>
      </p>
    </div>

    <div class="process" v-if="processor.processStatus.value != ProcessStatus.notStarted">
      <p class="warning">Идёт процесс выгрузки, не закрывайте страницу</p>

      <div>
        <p>Обработано диалогов: <span class="num">{{ processor.processedInfo.value.conerstationCount
        }}/{{ processor.archiveInfo.value.conerstationCount }}</span></p>
        <p>Обработано сообщений: <span class="num">{{ processor.processedInfo.value.messageCount }}/{{
            processor.archiveInfo.value.messageCount -
            processor.archiveInfo.value.conerstationCount * 25
        }}</span></p>
        <p>Обработано исходящих сообщений: {{ processor.processedInfo.value.outboxMessageCount }}</p>
        <p>Отправленно исходящих слов: {{ processor.processedInfo.value.words }}</p>


        <ProgressBar :progress="progressValue" :color="progressBarColor" />
        <p v-if="etaCalculator.timeSpent.value > 0">Времени затрачено: {{ Math.floor(etaCalculator.timeSpent.value /
            1000)
        }}</p>
        <p>Времени осталось: {{ Math.floor(etaCalculator.eta.value / 1000) }}</p>

        <hr>
        <button @click="onStop" class="btn"
          v-if="processor.processStatus.value == ProcessStatus.processing">Остановить</button>
        <button @click="onReset" class="btn" v-else>Новая выгрузка</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';

import { ProcessStatus, useProcessor } from '../../core/messages/processArchive';
import { computed } from '@vue/reactivity';
import { useETACalculator } from '../../core/etaCalculator';

import ProgressBar from '../../components/ProgressBar.vue';
import FileInput from '../../components/FileInput.vue';



const processor = useProcessor()
const etaCalculator = useETACalculator()

async function process(file: File) {
  etaCalculator.begin()
  processor.processArchive(file)
}

const progressValue = computed(() => processor.processedInfo.value.messageCount == 0 ? 0 : processor.processedInfo.value.messageCount / processor.archiveInfo.value.messageCount)

watch(progressValue, val => etaCalculator.updateProgress(val))
const progressBarColor = computed(() => {
  if (processor.processStatus.value == ProcessStatus.notStarted) return 'gray'
  if (processor.processStatus.value == ProcessStatus.processing) return '#007aff'
  if (processor.processStatus.value == ProcessStatus.stopped) return '#ff3b30'
  if (processor.processStatus.value == ProcessStatus.finished) return '#34c759'
})

watch(processor.processStatus, val => {
  if (val == ProcessStatus.finished) {
    etaCalculator.stop()
  }
})

function onStop() {
  processor.stop()
  etaCalculator.stop()
}

function onReset() {
  processor.reset()
}
</script>


<style scoped lang="scss">
.file {
  height: 200px;
}

.process {
  p {
    margin: 5px 0;

    &.warning {
      margin: 10px 0;
      font-weight: bold;
      color: #c79600;
      border-left: 4px solid #c79600;
      padding-left: 5px;
    }

  }

  progress {
    width: 100%;
  }

  .num {
    font-family: sans-serif;
  }
}

p {
  margin-top: 10px;
}
</style>
