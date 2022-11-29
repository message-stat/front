<template>
  <div>
    <div class="card">
      <h1>Выгрузка архива</h1>
      <div class="dropzone" ref="dropzone" :class="isOverDropZone ? 'drop' : ''"
        v-if="processor.processStatus.value == ProcessStatus.notStarted">
        <p class="dropzone-text">Для начала выгрузки перетащите сюда или <span
            @click="fileInput.click()">выбирете</span>
          архив в ZIP формате</p>
        <input type="file" ref="fileInput" />
      </div>

      <div class="process" v-if="processor.processStatus.value != ProcessStatus.notStarted">
        <div>
          <p>Обработано диалогов: <span class="num">{{ processor.processedInfo.value.conerstationCount
          }}/{{ processor.archiveInfo.value.conerstationCount }}</span></p>
          <p>Обработано сообщений: <span class="num">{{ processor.processedInfo.value.messageCount }}/{{
              processor.archiveInfo.value.messageCount -
              processor.archiveInfo.value.conerstationCount * 25
          }}</span></p>
          <p>Обработано исходящих сообщений: {{ processor.processedInfo.value.outboxMessageCount }}</p>
          <p>Отправленно исходящих слов: {{ processor.processedInfo.value.words }}</p>

          <progress max="100" :value="progressValue"> </progress>
          <p v-if="etaCalculator.timeSpent.value > 0">Времени затрачено: {{ Math.floor(etaCalculator.timeSpent.value /
              1000)
          }}</p>
          <p>Времени осталось: {{ Math.floor(etaCalculator.eta.value / 1000) }}</p>

          <button @click="onStop" v-if="processor.processStatus.value == ProcessStatus.processing">STOP</button>
          <button @click="onReset" v-else>Новая выгрузка</button>
        </div>
      </div>
    </div>
    <PrivacyCard />

    <HowGetArchive />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { useDropZone } from '@vueuse/core'
import PrivacyCard from './PrivacyCard.vue';
import HowGetArchive from './HowGetArchive.vue';


import { ProcessStatus, useProcessor } from '../../core/messages/processArchive';
import { computed } from '@vue/reactivity';
import { useETACalculator } from '../../core/etaCalculator';

const fileInput = ref<HTMLInputElement>();
const dropzone = ref<HTMLElement>();

const { isOverDropZone } = useDropZone(dropzone, (file) => {
  process(file[0])
});


const processor = useProcessor()
const etaCalculator = useETACalculator()

async function process(file: File) {
  etaCalculator.begin()
  processor.processArchive(file)
}

const progressValue = computed(() => processor.processedInfo.value.messageCount == 0 ? 0 : processor.processedInfo.value.messageCount / processor.archiveInfo.value.messageCount * 100)

watch(progressValue, val => {
  etaCalculator.updateProgress(val / 100)
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
.card {
  padding: 15px;
}

.num {
  font-family: sans-serif;
}

h1 {
  margin-bottom: 10px;
}

.process {
  p {
    margin: 5px 0;
  }

  progress {
    width: 100%;
  }
}

.dropzone {
  background-color: rgba(163, 163, 163, 0.191);
  height: 200px;

  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 4px dashed #ccc;

  &.drop {
    border: 4px dashed #213547;
  }

  .dropzone-text {
    margin: 40px;
    text-align: center;
    font-size: 16px;

    span {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  input[type="file"] {
    display: none;
  }
}
</style>
