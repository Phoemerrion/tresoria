<script setup>
import Plateau from "../game/Plateau.vue";
import Controls from "../game/Controls.vue";
import Console from "../game/Console.vue";

// Référence pour Plateau
import { ref } from 'vue';
const plateau = ref(null);
const logMessages = ref([]); // Tableau observé pour les logs

const logMessage = (message) => {
    logMessages.value.push(message);
}

// Gérer le mouvement
function handleMove(direction) {
  plateau.value.movePlayer(direction); // Appel à la méthode `movePlayer` de Plateau
}

</script>

<template>
  <div class="row">
    <div class="col-8">
      <Plateau ref="plateau" @logMessage="logMessage"/>
    </div>
    <div class="col-4">
      <div class="d-flex flex-column">
        <console :logs="logMessages" />
      </div>
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