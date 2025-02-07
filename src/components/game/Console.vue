<script setup>
import { computed } from 'vue';

// Référence pour le loggerStore
import {useLoggerStore} from "../store/loggerStore.js";
const logger = useLoggerStore()

const displayedLogs = computed(() => [...logger.logs].reverse());
</script>

<template>
  <ul class="list-group overflow-auto bg-dark" style="max-height: 50vh">
    <li
        v-for="(log, index) in displayedLogs"
        :key="index"
        class="list-group-item bg-dark border-dark"
    >
      <span class="text-light">{{ log.message }}</span>
    </li>
  </ul>
</template>