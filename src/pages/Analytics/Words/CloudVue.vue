<template>
  <div id="app">
    <cloud :data="words" :fontSizeMapper="fontSizeMapper" />
  </div>
</template>
 
<script>
import Cloud from 'vue-d3-cloud'

export default {
  name: 'app',
  data() {
    return {
      words: [
        { text: 'Vue', value: 1000 },
        { text: 'js', value: 200 },
        { text: 'is', value: 800 },
        { text: 'very cool', value: 1000000 },
        { text: 'lunch', value: 100 },
      ],
      fontSizeMapper: word => Math.log2(word.value) * 5,
    }
  },
  components: {
    Cloud,
  },
}
</script>
