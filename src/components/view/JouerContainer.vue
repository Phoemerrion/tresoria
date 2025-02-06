<script setup>
import Plateau from "../game/Plateau.vue";
import Controls from "../game/Controls.vue";

// Référence pour Plateau
import { ref } from 'vue';
const plateau = ref(null);

// Gérer le mouvement
function handleMove(direction) {
  plateau.value.movePlayer(direction); // Appel à la méthode `movePlayer` de Plateau
}

</script>

<template>
  <div class="row">
    <div class="col-8">
      <Plateau ref="plateau"/>
    </div>
  </div>
  <div class="row">
    <div class="col-2">
      <Controls @move="handleMove"/>
    </div>
  </div>

</template>

<style scoped>

</style>