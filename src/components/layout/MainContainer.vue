<script setup>
import {computed, defineProps} from 'vue';
import AccueilContainer from "../view/AccueilContainer.vue";
import JouerContainer from "../view/JouerContainer.vue";
import AideContainer from "../view/AideContainer.vue";

const props = defineProps({view: String})
const currentView = computed(() => props.view);
</script>

<template>
  <main class="bg-light p-1">
    <AccueilContainer v-if="currentView === 'Accueil'" />
    <JouerContainer v-if="currentView === 'Jouer'" />
    <AideContainer v-if="currentView === 'Aide'" />
  </main>
</template>

<style scoped>
main {
  margin-top: 60px;
  margin-bottom: 60px;
}
</style>