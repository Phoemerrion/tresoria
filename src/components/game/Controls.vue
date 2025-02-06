<script setup>
import {defineEmits, onBeforeUnmount, onMounted} from 'vue';

// Déclaration des événements
const emit = defineEmits(['move']);

// Ajouter / Supprimer les listeners de clavier
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown); // Ajouter l'écoute des touches
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown); // Supprimer les écouteurs
});

// Gérer les entrées clavier
function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp' : move('up');break;
    case 'ArrowDown' : move('down');break;
    case 'ArrowLeft' : move('left');break;
    case 'ArrowRight' : move('right');break;
  }
}

function move(direction) {
  emit('move', direction); // Émettre l'événement avec la direction
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-center">
      <button class="btn btn-info bi bi-arrow-up" @click="move('up')"/>
    </div>
    <div class="d-flex justify-content-between">
      <i class="btn btn-info bi bi-arrow-left" @click="move('left')"/>
      <i class="btn btn-info bi bi-arrow-down" @click="move('down')"/>
      <i class="btn btn-info bi bi-arrow-right" @click="move('right')"/>
    </div>
  </div>
</template>

<style scoped>
button {
  font-size: 20px;
  margin: 5px;
}
</style>