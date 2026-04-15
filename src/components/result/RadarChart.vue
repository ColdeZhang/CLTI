<script setup lang="ts">
import { computed } from 'vue'
import { DIMENSIONS } from '../../data/dimensions'

const props = defineProps<{
  scores: Record<string, number>
}>()

const size = 240
const cx = size / 2
const cy = size / 2
const radius = 90
const labelRadius = radius + 24

const angles = DIMENSIONS.map((_, i) =>
  (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2
)

function toXY(angle: number, r: number): string {
  return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
}

const gridLevels = [0.25, 0.5, 0.75, 1.0]

const gridPolygons = computed(() =>
  gridLevels.map(level =>
    angles.map(a => toXY(a, radius * level)).join(' ')
  )
)

const axisLines = computed(() =>
  angles.map(a => ({ x2: cx + radius * Math.cos(a), y2: cy + radius * Math.sin(a) }))
)

const dataPolygon = computed(() =>
  DIMENSIONS.map((dim, i) => {
    const v = props.scores[dim.id] ?? 0
    return toXY(angles[i], radius * v)
  }).join(' ')
)

const labels = computed(() =>
  DIMENSIONS.map((dim, i) => ({
    x: cx + labelRadius * Math.cos(angles[i]),
    y: cy + labelRadius * Math.sin(angles[i]),
    text: dim.publicName,
    anchor: Math.abs(Math.cos(angles[i])) < 0.01 ? 'middle'
      : Math.cos(angles[i]) > 0 ? 'start' : 'end',
  }))
)
</script>

<template>
  <svg :viewBox="`0 0 ${size} ${size}`" class="radar-chart">
    <!-- Grid -->
    <polygon
      v-for="(pts, i) in gridPolygons"
      :key="i"
      :points="pts"
      fill="none"
      stroke="#E8E8E8"
      stroke-width="1"
    />
    <!-- Axes -->
    <line
      v-for="(line, i) in axisLines"
      :key="'a' + i"
      :x1="cx" :y1="cy"
      :x2="line.x2" :y2="line.y2"
      stroke="#E8E8E8"
      stroke-width="1"
    />
    <!-- Data polygon -->
    <polygon
      :points="dataPolygon"
      fill="rgba(255, 71, 87, 0.15)"
      stroke="#FF4757"
      stroke-width="2.5"
    />
    <!-- Data dots -->
    <circle
      v-for="(dim, i) in DIMENSIONS"
      :key="'d' + i"
      :cx="cx + radius * (props.scores[dim.id] ?? 0) * Math.cos(angles[i])"
      :cy="cy + radius * (props.scores[dim.id] ?? 0) * Math.sin(angles[i])"
      r="4"
      fill="#FF4757"
    />
    <!-- Labels -->
    <text
      v-for="(label, i) in labels"
      :key="'l' + i"
      :x="label.x"
      :y="label.y"
      :text-anchor="label.anchor"
      dominant-baseline="central"
      font-size="12"
      fill="#636E72"
    >
      {{ label.text }}
    </text>
  </svg>
</template>

<style scoped>
.radar-chart {
  width: 100%;
  max-width: 260px;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
