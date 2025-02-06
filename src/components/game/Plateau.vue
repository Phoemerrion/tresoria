<script setup>
import {onMounted, ref} from 'vue';
import Cell from './Cell.vue';

// Dimensions de la grille
const boardWidth = 20;
const boardHeight = 15;

// Constantes
const textures = [
  { type: 'grass', weight: 70 }, // 70%
  { type: 'water', weight: 0 },  // "Eau connectée" générée séparément
  { type: 'rock', weight: 0 },   // "Roches connectées" générées séparément
];

const numberOfCells = boardWidth * boardHeight;
const numberOfMonsters = Math.floor(numberOfCells * 0.2); // 20% des cellules pour les monstres

// Initialisation de la grille avec les textures d'herbe
const board = ref(
    Array.from({ length: boardHeight }, () =>
        Array.from({ length: boardWidth }, () => ({
          texture: 'grass', // Par défaut
          content: 'empty'
        }))
    )
);

// Générer et connecter les cellules d'un type donné ('water' ou 'rock')
function generateConnectedCells(type, percentageOfCells) {
  const totalConnectedCells = Math.floor(numberOfCells * percentageOfCells);

  let placedCells = 0;

  // Fonction utilitaire : vérifier les voisins pour éviter la proximité avec un autre type
  function hasInvalidNeighbor(x, y, forbiddenType) {
    const neighbors = [
      { nx: x - 2, ny: y }, // Gauche
      { nx: x + 2, ny: y }, // Droite
      { nx: x, ny: y - 2 }, // Haut
      { nx: x, ny: y + 2 }  // Bas
    ];
    return neighbors.some(({ nx, ny }) =>
        ny >= 0 && ny < boardHeight &&
        nx >= 0 && nx < boardWidth &&
        board.value[ny][nx].texture === forbiddenType
    );
  }

  // Fonction utilitaire : vérifier les voisins pour garantir la connexion
  function hasMatchingNeighbor(x, y, matchType) {
    const neighbors = [
      { nx: x - 1, ny: y }, // Gauche
      { nx: x + 1, ny: y }, // Droite
      { nx: x, ny: y - 1 }, // Haut
      { nx: x, ny: y + 1 }  // Bas
    ];
    return neighbors.some(({ nx, ny }) =>
        ny >= 0 && ny < boardHeight &&
        nx >= 0 && nx < boardWidth &&
        board.value[ny][nx].texture === matchType
    );
  }

  // Fonction utilitaire : vérifier si une position est trop proche du bord
  function isTooCloseToEdge(x, y) {
    return x === 0 || x === boardWidth - 1 || y === 0 || y === boardHeight - 1;
  }

  // Placement des cellules connectées
  while (placedCells < totalConnectedCells) {
    const x = Math.floor(Math.random() * boardWidth);
    const y = Math.floor(Math.random() * boardHeight);

    // Placement initial ou connexion à une cellule existante
    if (
        board.value[y][x].texture === 'grass' && // Uniquement sur herbe
        !isTooCloseToEdge(x, y) && // Pas trop proche du bord
        !hasInvalidNeighbor(x, y, type === 'water' ? 'rock' : 'water') && // Vérification de séparation
        (placedCells === 0 || hasMatchingNeighbor(x, y, type)) // Doit être connecté
    ) {
      board.value[y][x].texture = type;
      placedCells++;
    }
  }
}

// Générer les cellules `water` (20%) et `rock` (10%)
generateConnectedCells('water', 0.2); // 20% pour water
generateConnectedCells('rock', 0.1);  // 10% pour rock

// Placer le joueur, le trésor, et les monstres (herbe uniquement)
function placeElements() {
  // Fonction utilitaire pour trouver une position vide sur l'herbe
  function getRandomEmptyGrassCell() {
    let x, y;
    do {
      x = Math.floor(Math.random() * boardWidth);
      y = Math.floor(Math.random() * boardHeight);
    } while (
        board.value[y][x].content !== 'empty' || board.value[y][x].texture !== 'grass'
        );
    return { x, y };
  }

  // Placer le joueur
  const playerPosition = getRandomEmptyGrassCell();
  board.value[playerPosition.y][playerPosition.x].content = 'player';

  // Placer le trésor
  const treasurePosition = getRandomEmptyGrassCell();
  board.value[treasurePosition.y][treasurePosition.x].content = 'treasure';

  // Placer les monstres
  for (let i = 0; i < numberOfMonsters; i++) {
    const monsterPosition = getRandomEmptyGrassCell();
    board.value[monsterPosition.y][monsterPosition.x].content = 'monster';
  }
}

// Ajouter les éléments à la grille
onMounted(() => {
  placeElements();
})

</script>

<template>
  <div class="container">
    <div class="row">
      <div
          v-for="(row, y) in board"
          :key="y"
          class="d-flex"
      >
        <Cell
            v-for="(cell, x) in row"
            :key="x"
            :x="x"
            :y="y"
            :texture="cell.texture"
            :content="cell.content"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>