<template>
  <div>
    <SendArchive />
    <PrivacyCard />
    <HowGetArchive />
    <WhyIsSafe />
  </div>
</template>

<script setup lang="ts">
import PrivacyCard from './PrivacyCard.vue';
import HowGetArchive from './HowGetArchive.vue';
import SendArchive from './SendArchive.vue';
import WhyIsSafe from './WhyIsSafe.vue';


</script>


<style scoped lang="scss">
div {
  .card {
    padding: 15px;
  }
}
</style>
