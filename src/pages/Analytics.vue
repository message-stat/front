<template>
  <div>
    <button @click="show">OPEN</button>

    <div class="popup" v-if="isShow">
      <button @click="hide">CLOSE</button>

      {{ date }}
      <input type="date" v-model="date">
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
const date = ref<Date>(null)
const isShow = ref(false)

function show() { isShow.value = true }
function hide() { isShow.value = false }

</script>
