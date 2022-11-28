<template>
  <div :id="plotlyId" ref="graphDiv"></div>
</template>
  
<script>
import { v4 as uuidv4 } from 'uuid';
import Plotly from 'plotly.js-dist';
let timeOutFunctionId;
export default {
  name: 'VuePlotly',
  data() {
    return {
      plotlyId: `plotly-${uuidv4()}`,
    };
  },
  props: ['data', 'layout', 'config'],
  emits: ['plotly-click', 'plotly-hover', 'plotly-relayout'],
  watch: {
    data() { this.setGraph(); },
    layout() { this.setGraph(); },
    config() { this.setGraph(); },
  },
  mounted() {
    this.setGraph();
    this.resizeObserver = new ResizeObserver(() => {
      clearTimeout(timeOutFunctionId); // debounce the reset
      timeOutFunctionId = setTimeout(this.setGraph, 100);
    });
    this.resizeObserver.observe(document.getElementById(this.plotlyId));
  },
  beforeUnmount() { this.resizeObserver.disconnect(); },
  methods: {
    setGraph() {
      Plotly.newPlot(this.plotlyId, this.data, this.layout, this.config);

      this.$refs.graphDiv.on('plotly_relayout', (data) => {
        this.$emit('plotly-relayout', data);
      });
    },
  },
};
</script>
