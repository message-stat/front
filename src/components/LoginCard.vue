<template>
  <Teleport to="body" v-if="props.show">
    <div class="abs-full backgraund" @click="onClose">
      <div class="card" @click.stop="">
        <button class="btn close" @click="onClose">
          <p>x</p>
        </button>
        <h1>Вход в систему</h1>
        <p>Вход в систему необходим для отображения персональных графиков</p>

        <div class="file wrapper">
          <p v-if="isFileOpen" class="wait">Подождите...</p>
          <FileInput class="file" action-text="Для входа" @input="onOpenFile"
            :style="{ visibility: isFileOpen ? 'hidden' : '' }" />
        </div>
        <br>
        <p><b>ИЛИ</b></p>
        <br>
        <button class="btn vk">Авторизуйтесь через VK</button>
      </div>
    </div>
  </Teleport>
</template>


<script setup lang="ts">
import { ref, Teleport } from 'vue';
import { userIdByArchive } from '../core/messages/utils';
import { userId } from '../storage/user';
import FileInput from './FileInput.vue';

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', show: boolean): void
}>()

const isFileOpen = ref(false);

async function onOpenFile(file: File) {
  isFileOpen.value = true;
  userId.value = await userIdByArchive(file)

  emit('update:show', false)
  isFileOpen.value = false;
}

function onClose() {
  emit('update:show', false)
  isFileOpen.value = false;
}

</script>

<style scoped lang="scss">
.backgraund {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    position: relative;
    text-align: center;
    padding: 20px 30px;

    .close {
      position: absolute;
      top: 10px;
      right: 10px;

      width: 30px;
      height: 30px;
      border-radius: 50%;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .wrapper {
      position: relative;

      .wait {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }
    }

    .file {
      height: 100px;
      margin: 20px 0 0 0;
    }
  }
}
</style>
