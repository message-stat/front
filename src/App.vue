<template>
  <div>
    <h1>My App</h1>
    <div class="dropzone" ref="dropzone" :class="isOverDropZone ? 'drop' : ''"></div>
    <button @click="onStop">STOP</button>
    <div>
      <p>Всего диалогов: {{ processor.archiveInfo.value.conerstationCount }}</p>
      <p>Всего сообщений: {{ processor.archiveInfo.value.messageCount - processor.archiveInfo.value.conerstationCount *
          25
      }} (погрешность +- {{ processor.archiveInfo.value.conerstationCount * 25 }})</p>
    </div>
    <hr>
    <div>
      <p>Обработано диалогов: {{ processor.processedInfo.value.conerstationCount }}</p>
      <p>Обработано сообщений: {{ processor.processedInfo.value.messageCount }}</p>
      <p>Обработано исходящих сообщений: {{ processor.processedInfo.value.inboxMessageCount }}</p>
      <p>Обработано исходящих слов: {{ processor.processedInfo.value.words }}</p>
      <p v-if="spentTime > 0">Времени затрачено: {{ spentTime }}</p>
      <p>Времени осталось: {{ displayEta }}</p>
      <progress max="100" :value="progressValue"> </progress>

      <p v-if="processor.sending.value">ИДËТ ОТПРАВКА, ПОДОЖДИТЕ</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { useDropZone } from '@vueuse/core'

import { useProcessor } from './core/messages/processArchive';
import { computed } from '@vue/reactivity';


const file = ref<File | null>(null);
const dropzone = ref<HTMLElement | null>(null);
const endTime = ref(0)
const eta = ref(0)

let beginTime = 0
const timeSpent = ref(0)

const { isOverDropZone } = useDropZone(dropzone, (file) => {
  process(file[0])
});

const processor = useProcessor()

async function process(file: File) {
  beginTime = Date.now()
  processor.processArchive(file)
}

const progressValue = computed(() => processor.processedInfo.value.messageCount == 0 ? 0 : processor.processedInfo.value.messageCount / processor.archiveInfo.value.messageCount * 100)

let lastETAComputed = {
  date: 0,
  count: 0,
  eta: 0
}

const displayEta = computed(() => {
  return Math.floor(eta.value / 1000)
})

const spentTime = computed(() => {
  if (timeSpent.value / 1000 > 100000) return 0
  return Math.floor(timeSpent.value / 1000)
})

watch(() => processor.processedInfo.value.messageCount, (messageCount) => {
  if (messageCount == 0) {
    lastETAComputed = {
      date: 0,
      count: 0,
      eta: 0
    }
    return
  }

  if (lastETAComputed.date + 5000 < Date.now()) {
    const speed = (messageCount - lastETAComputed.count) / (Date.now() - lastETAComputed.date) * 1000

    lastETAComputed = {
      date: Date.now(),
      count: messageCount,
      eta: (processor.archiveInfo.value.messageCount - messageCount) / speed
    }
    endTime.value = Date.now() + lastETAComputed.eta * 1000
  }

  if (endTime.value - Date.now() > 1000000) {
    eta.value = 0
  } else {
    eta.value = endTime.value - Date.now()
  }
})

watch(() => processor.processedInfo.value.messageCount, () => {
  if (processor.sending)
    timeSpent.value = Date.now() - beginTime
})


function onStop() {
  processor.stop()
}
</script>


<style scoped lang="scss">
.dropzone {
  background-color: rgba(163, 163, 163, 0.191);
  width: 500px;
  height: 500px;

  border-radius: 20px;


  border: 4px dashed #ccc;

  &.drop {
    border: 4px dashed #000;
  }
}
</style>
