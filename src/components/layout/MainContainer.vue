<script setup>
import {computed, defineProps} from 'vue';
import AccueilContainer from "../view/AccueilContainer.vue";
import JouerContainer from "../view/JouerContainer.vue";

const props = defineProps({view: String})
const currentView = computed(() => props.view);
</script>

<template>
  <main class="container-lg container-fluid p-1">
    <AccueilContainer v-if="currentView === 'Accueil'" />
    <JouerContainer v-if="currentView === 'Jouer'" />
  </main>
</template>

<style scoped>
main {
  margin-top: 60px;
  margin-bottom: 60px;
}
</style>