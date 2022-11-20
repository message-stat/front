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
import { ref, watchEffect } from 'vue';
const date = ref("2022-01-01")
const isShow = ref(false)

function show() { isShow.value = true }
function hide() { isShow.value = false }

watchEffect(() => {
  console.log(date.value);

})

</script>
