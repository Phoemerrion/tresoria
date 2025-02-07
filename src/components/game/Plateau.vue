<script setup>

 import { ref, onMounted } from 'vue';
 import GameBoard from '../models/GameBoard';
 import Cell from './Cell.vue';

const gameBoard = ref(new GameBoard());

 // Gérer les entrées clavier
 function handleKeyDown(event) {
   switch (event.key) {
     case 'ArrowUp': case 'z': gameBoard.value.movePlayer('up'); event.preventDefault(); break;
     case 'ArrowDown': case 's': gameBoard.value.movePlayer('down'); event.preventDefault(); break;
     case 'ArrowLeft': case 'q': gameBoard.value.movePlayer('left'); event.preventDefault(); break;
     case 'ArrowRight': case 'd': gameBoard.value.movePlayer('right'); event.preventDefault(); break;
   }
 }
 onMounted(() => {
   window.addEventListener('keydown', handleKeyDown);
 });

 // Exposer la référence `gameBoard` au parent
defineExpose({
  gameBoard
});


</script>

<template>
  <div class="mx-0 my-lg-1 mx-lg-5">
    <div v-for="(row, y) in gameBoard.board" :key="y" class="d-flex">
      <Cell v-for="(cell, x) in row" :key="x" :x="x" :y="y" :texture="cell.texture" :content="cell.content"/>
    </div>
  </div>
</template>

<style scoped>

</style>