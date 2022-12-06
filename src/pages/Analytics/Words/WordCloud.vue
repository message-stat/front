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
  </Card>
</template>

<script setup lang="ts">

import { onMounted, ref, shallowRef, watchEffect } from 'vue';
import Card from '../../../components/Card.vue';
import * as d3 from "d3";
import * as cloud from 'd3-cloud';
import { useDebounceFn, useElementSize } from '@vueuse/core';
import axios from 'axios';
import { userIdHash } from '../../../storage/user';

const loading = ref(true);
const elapsed = ref(0);
const container = ref<HTMLElement>();

const variant = ref<'server' | 'user'>('server');

const wordsResult = shallowRef()

var layout = cloud()
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


function draw(words) {
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
}, 500)

watchEffect(() => onResize(width.value))

watchEffect(async () => {
  loading.value = true
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/load/topWords`, { params: { userId: variant.value == 'user' ? userIdHash.value : undefined } })
  const { words } = res.data

  // layout.words(words.map(d => ({ text: d.x, size: Math.log(d.y * 200) * 50 })))
  layout.words(words.map(d => ({ text: d.x, size: d.y * 2000 })))
  layout.size([width.value, 600])
  layout.start();

  elapsed.value = res.data.elapsed

})


</script>
