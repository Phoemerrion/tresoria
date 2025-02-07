<script setup>
import {ref} from 'vue';
import Plateau from "../game/Plateau.vue";
import Console from "../game/Console.vue";

// Référence pour Plateau
const plateau = ref(null);

// Référence pour le loggerStore
import {useLoggerStore} from "../store/loggerStore.js";
const logger = useLoggerStore()

</script>

<template>
  <div class="card bg-dark p-0 mb-4">
    <div class="card-header"/>
    <div class="card-body p-0">
      <Plateau ref="plateau" @logMessage="logger.logMessage()"/>
    </div>
    <div class="card-footer bg-dark p-0">
      <Console/>
    </div>
  </div>
</template>

<style scoped>

</style>