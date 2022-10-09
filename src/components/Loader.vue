<template>
  <div>
    <p>apiKey: </p>
    <input type="text" v-model="apiKey">
    <button @click="load">Load</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoader } from '../core/useLoader';

const apiKey = ref('')

function load() {
  useLoader({
    token: apiKey.value,
  })
}

</script>
