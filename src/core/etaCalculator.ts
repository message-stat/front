import { computed, readonly, ref } from "vue"

let enabled = false
async function tick() {
  while (enabled) {
    await new Promise(resolve => setTimeout(resolve, 100))
    timeSpent.value = Date.now() - beginTime.value
  }
}


const beginTime = ref(0)
const timeSpent = ref(0)
const eta = ref(0)

function begin() {
  beginTime.value = Date.now()
  if (!enabled) {
    enabled = true
    tick()
  }
}

function stop() {
  enabled = false
}

let lastProgress = 0
let lastTime = 0
function updateProgress(progress: number) {
  const progressDelta = progress - lastProgress
  const timeDelta = Date.now() - lastTime
  const speed = speedAvg(progressDelta / timeDelta)

  if (speed > 0) {
    eta.value = (1 - progress) / speed
  } else {
    eta.value = -1
  }

  lastProgress = progress
  lastTime = Date.now()
}


const AVG_WINDOW = 20
let lastSpeeds = []
let sumSpeed = 0
function speedAvg(speed: number): number {
  lastSpeeds.push(speed)
  sumSpeed += speed
  if (lastSpeeds.length <= AVG_WINDOW) return -1

  return sumSpeed / lastSpeeds.length
}

export function useETACalculator() {
  return {
    begin,
    stop,
    updateProgress,
    eta: readonly(eta),
    beginTime: readonly(beginTime),
    timeSpent: readonly(timeSpent),
  }
}
