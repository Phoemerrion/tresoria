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
    class="cell d-flex justify-content-center align-items-center p-0 m-0"
    :class="{
      'bg-color-grass': texture === 'grass',
      'bg-color-rock': texture === 'rock',
      'bg-color-water': texture === 'water',
    }"
  >
    <span v-if="content === 'player'" class="fs-6 fs-sm-5 fs-md-4 fs-lg-3">🧍</span>
    <span v-else-if="content === 'treasure'" class="fs-6 fs-sm-5 fs-md-4 fs-lg-3">💰</span>
    <span v-else-if="content === 'monster'" class="fs-6 fs-sm-5 fs-md-4 fs-lg-3">👹</span>
  </div>
</template>


<style scoped>
.cell {
  aspect-ratio: 1; /* Garde les cellules carrées */
  width: 100%;     /* Largeur dynamique basée sur Bootstrap */
  max-width: 40px; /* Taille maximale */
}
.bg-color-grass { background-color: green; }
.bg-color-rock { background-color: gray; }
.bg-color-water { background-color: blue; }
</style>