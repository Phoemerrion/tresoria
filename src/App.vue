<script setup>
import {ref} from 'vue';
import TopBar from "./components/partials/TopBar.vue";
import MainContainer from './components/layout/MainContainer.vue'
import BottomBar from "./components/partials/BottomBar.vue";

const currentView = ref('Accueil');
</script>
<template>
  <TopBar @navigate="(page) => currentView = page"/>
  <MainContainer :view="currentView"/>
  <BottomBar/>
</template>