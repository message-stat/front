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

export declare type LoadChartResult<T = { x: number, y: number }> = {
  server: T[],
  user?: T[],
  elapsed: number,
}

export function groupBy<T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) {
  return array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] })
}

