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
  <div class="border p-3 bg-light">
    <ul class="list-group overflow-auto" style="height: 65vh;">
      <li
          v-for="(log, index) in displayedLogs"
          :key="index"
          class="list-group-item"
      >
        {{ log }}
      </li>
    </ul>
  </div>
</template>