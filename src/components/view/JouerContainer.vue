<script setup>
import {ref} from 'vue';
import Plateau from "../game/Plateau.vue";
import Console from "../game/Console.vue";

// Référence pour Plateau
const plateau = ref(null);

// Logger de la console
const logMessages = ref([]); // Tableau observé pour les logs
const logMessage = (message) => {
  logMessages.value.push(message);
}

</script>

<template>
  <div class="card bg-dark p-0 mb-4">
    <div class="card-header"/>
    <div class="card-body p-0">
      <Plateau ref="plateau" @logMessage="logMessage"/>
    </div>
    <div class="card-footer bg-dark p-0">
      <Console :logs="logMessages"/>
    </div>
  </div>
</template>

<style scoped>

</style>