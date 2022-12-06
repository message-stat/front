import { Layout } from "plotly.js-basic-dist"


export const lineLayout: Partial<Layout> = {
  height: 500,
  margin: { t: 20, b: 20, l: 40, r: 10 },
  legend: {
    orientation: 'h',
    yanchor: 'bottom',
    y: 1.02,
    xanchor: 'left',
    x: 0,
  },
  xaxis: {
    autorange: true,
    fixedrange: true,
    type: 'linear'
  },
  yaxis: {
    autorange: true,
    fixedrange: true,
    type: 'linear'
  }
}

export declare type LoadChartResult = {
  server: {
    x: number
    y: number
  }[],
  user?: {
    x: number
    y: number
  }[],
  elapsed: number,
}
