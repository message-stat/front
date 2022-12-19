<template>
  <Card :loading="loading" :elapsed="elapsed" ref="container">
    <h2>Облако слов</h2>
    <div class="cloud-container">
      <svg>
        <g></g>
      </svg>
    </div>
    <div class="desc">
      Для:
      <select v-model="variant">
        <option value="server">всех</option>
        <option value="user">Вас</option>
      </select>
    </div>
    <div class="desc">
      <label for="scales">Исключить предлоги и союзы:</label>
      <input type="checkbox" id="scales" name="scales" v-model="article">
    </div>
  </Card>
</template>

<script setup lang="ts">

import { onMounted, ref, shallowRef, watchEffect, watch } from 'vue';
import Card from '../../../components/Card.vue';
import * as d3 from "d3";
import Cloud from 'd3-cloud';
import { useDebounceFn, useElementSize } from '@vueuse/core';
import axios from 'axios';
import { userIdHash } from '../../../storage/user';

const loading = ref(true);
const elapsed = ref(0);
const container = ref<HTMLElement>();

const variant = ref<'server' | 'user'>('server');
const article = ref(true);

const wordsResult = shallowRef()

var layout = Cloud()
  .size([500, 500])
  .words([])
  .padding(0.5)
  .rotate(t => (Math.random() * 2 - 1) * 90)
  // .rotate(t => 0)
  .font("Impact")
  .timeInterval(20)
  .fontSize(d => { return d.size; })
  .on("end", t => {
    if (t.length != 0)
      loading.value = false
    wordsResult.value = t;
  });


function draw(words: any[]) {
  d3.select(".cloud-container > svg")
    .attr("width", layout.size()[0])
    .attr("height", layout.size()[1])
    .select("g")
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
    .data(words)
    .join("text")
    .style("font-size", d => d.size + "px")
    .style("font-family", "Impact")
    .attr("text-anchor", "middle")
    .style("fill", (d, i) => d3.schemeCategory10[i % 10])
    .attr("transform", d =>
      "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"
    )
    .text(d => d.text);
}

watchEffect(() => {
  if (wordsResult.value) {
    draw(wordsResult.value)
  }
})

const { width } = useElementSize(container)

const onResize = useDebounceFn((w) => {
  layout.size([w, 600])
  layout.start();
}, 100)

watchEffect(() => onResize(width.value))

watch(() => ({
  variant: variant.value,
  userIdHash: userIdHash.value,
  article: article.value
}), async (val) => {

  loading.value = true
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/load/topWords`, {
    params: {
      userId: val.variant == 'user' ? val.userIdHash : undefined,
      article: !val.article
    }
  })
  const words = res.data.words as { x: string, y: number }[]

  layout.words(words
    .map(d => ({ text: d.x, size: d.y * 4000 })))
  layout.size([width.value, 600])
  layout.start();

  elapsed.value = res.data.elapsed
}, {
  immediate: true
})


</script>
