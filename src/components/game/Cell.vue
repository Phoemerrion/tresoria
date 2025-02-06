<script setup>

const props = defineProps({
  texture: {
    type: String,
    required: true,
    default: 'grass',
  },
  content: {
    type: String,
    required: true,
    default: '',
  },
})

</script>

<template>
  <div
      class="cell fs-4"
      :class="{
      'bg-color-grass': texture === 'grass',
      'bg-color-rock': texture === 'rock',
      'bg-color-water': texture === 'water',
    }"
  >
    <span v-if="content === 'player'">🧍</span>
    <span v-else-if="content === 'treasure'">💰</span>
    <span v-else-if="content === 'monster'">👹</span>
  </div>
</template>

<style scoped>
.cell {
  width: 40px;
  height: 40px;
  border: 1px solid #333;
  padding: 1px 7px;
}
.bg-color-grass { background-color: green; }
.bg-color-rock { background-color: gray; }
.bg-color-water { background-color: blue; }
</style>