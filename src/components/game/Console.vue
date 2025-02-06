<script setup>
import { computed } from 'vue';

// Accepter les logs via une prop
const props = defineProps({
  logs: {
    type: Array,
    default: () => [], // Tableau vide par défaut
  },
});

const displayedLogs = computed(() => [...props.logs].reverse());
</script>

<template>
  <ul class="list-group overflow-auto bg-dark" style="max-height: 50vh">
    <li
        v-for="(log, index) in displayedLogs"
        :key="index"
        class="list-group-item bg-dark border-dark"
    >
      <span class="text-light">{{ log }}</span>
    </li>
  </ul>
</template>