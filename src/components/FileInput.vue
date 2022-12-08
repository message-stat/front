<template>
  <div class="dropzone" ref="dropzone" :class="isOverDropZone ? 'drop' : ''">
    <p class="dropzone-text">{{ props.actionText }} перетащите сюда или <span @click="fileInput.click()">выберите</span>
      архив в ZIP формате</p>
    <input type="file" ref="fileInput" @input="onInput" />
  </div>
</template>

<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { ref } from 'vue';

const fileInput = ref<HTMLInputElement>();
const dropzone = ref<HTMLElement>();

const props = defineProps<{
  actionText: string;
}>();

const emit = defineEmits<{
  (e: 'input', file: File): void
}>()

const { isOverDropZone } = useDropZone(dropzone, (file) => {
  emit('input', file[0])
});

function onInput(e) {
  emit('input', e.target.files[0])
}

</script>


<style scoped lang="scss">
.dropzone {
  background-color: rgba(163, 163, 163, 0.191);


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
