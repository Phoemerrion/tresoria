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
const numberOfMonsters = Math.floor(numberOfCells * 0.1); // 10% des cellules pour les monstres

const board = ref([]);
const playerPosition = ref({});

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

function generateLandscape () {
  generateConnectedCells('water', 0.03); // 3% pour water
  generateConnectedCells('rock', 0.05);  // 5% pour rock
  generateConnectedCells('water', 0.03); // 3% pour water
  generateConnectedCells('rock', 0.05);  // 5% pour rock
  generateConnectedCells('water', 0.03); // 3% pour water
  generateConnectedCells('rock', 0.05);  // 5% pour rock
}

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
  playerPosition.value = getRandomEmptyGrassCell();
  board.value[playerPosition.value.y][playerPosition.value.x].content = 'player';
  playerStats.value.health = playerStats.value.maxHealth; // Régénération des PV

  // Placer le trésor
  const treasurePosition = getRandomEmptyGrassCell();
  board.value[treasurePosition.y][treasurePosition.x].content = 'treasure';

  // Placer les monstres
  for (let i = 0; i < numberOfMonsters; i++) {
    const monsterPosition = getRandomEmptyGrassCell();
    board.value[monsterPosition.y][monsterPosition.x].content = 'monster';
  }
}

function generateMap(){
  // Initialisation de la grille avec les textures d'herbe
  board.value = Array.from({ length: boardHeight }, () =>
      Array.from({ length: boardWidth }, () => ({
        texture: 'grass', // Par défaut
        content: 'empty', // Aucun monstre, trésor ou joueur
      }))
  );

  generateLandscape();
  placeElements();
  gameStatus.value = 'running'
  logMessage(`Nouvelle carte générée !`);
}
// Ajouter les éléments à la grille
onMounted(() => {
  logMessage(`Welcome to Tresoria !`)
  generateMap()
})

const gameStatus = ref('running')
const emit = defineEmits(['logMessage']);
const logMessage = (message) => {
  emit('logMessage', message)
}

// Déplacer le joueur
function movePlayer(direction) {

  // Gestion de la fin de la partie
  if (gameStatus.value !== 'running') return

  const oldPosition = { ...playerPosition.value };
  let newPosition = { ...playerPosition.value };

  // Calcul de la nouvelle position en fonction de la direction
  if (direction === 'up') newPosition.y--;
  if (direction === 'down') newPosition.y++;
  if (direction === 'left') newPosition.x--;
  if (direction === 'right') newPosition.x++;

  // Vérifier si la nouvelle position est hors des limites
  if (
      newPosition.x < 0 ||
      newPosition.x >= boardWidth ||
      newPosition.y < 0 ||
      newPosition.y >= boardHeight
  ) {
    logMessage(`Vers l'infini et au-delà !!! ... Tu t'es pris pour un passe muraille c'est ça ?`);
    return; // On arrête l'exécution
  }

  // Vérifier que la nouvelle position est valide (terrain accessible uniquement)
  if (board.value[newPosition.y][newPosition.x].texture === 'grass') {

    // Mouvement autorisé par défaut
    let moveIsAllowed = true

    // Rencontre avec un monstre
    if (board.value[newPosition.y][newPosition.x].content === 'monster') {
      moveIsAllowed = false
      logMessage('General Kenobi !!')

      generateMonsterStats();
      const combatResult = handleMonsterEncounter();

      if (combatResult === 'monsterDefeated') {
        logMessage("Tu l'as eu !!")
        moveIsAllowed = true
      } else if (combatResult === 'playerDefeated') {
        logMessage("Tu t'es fait laver !!")
        gameStatus.value = 'defeat'
        generateMap(); // Réinitialiser la carte
      } else {
        logMessage("Chacun repars de son côté avec une portion de soupe de phalanges...")
      }
    }

    if (moveIsAllowed) {

      // Vérifier si le joueur arrive au trésor
      if (board.value[newPosition.y][newPosition.x].content === 'treasure') {
        logMessage('Look at this !!')
        gameStatus.value = 'victory'
      }

      // Mise à jour de la grille
      board.value[oldPosition.y][oldPosition.x].content = 'empty';
      board.value[newPosition.y][newPosition.x].content = 'player';
      playerPosition.value = newPosition;
      logMessage(`Mouvement réussi !`);
    }

  } else {
    logMessage(`Cet obstacle est infranchissable !`);
  }
}

const playerStats = ref({
  health: 100, // Points de vie
  maxHealth: 100, // Points de vie maximum
  strength: 30, // Force d'attaque
});

const monsterStats = ref({
  health: null,
  strength: null
})

// Fonction pour générer des statistiques aléatoires pour les monstres
function generateMonsterStats() {
  monsterStats.value = {
    health: Math.floor(Math.random() * 50) + 20, // Points de vie entre 20 et 70
    strength: Math.floor(Math.random() * 20) + 10, // Force d'attaque entre 10 et 30
  };
}

// Gérer les combats avec un monstre
function handleMonsterEncounter() {
  // Comparer la force du joueur avec les PV du monstre
  if (playerStats.value.strength >= monsterStats.value.health) {
    // Le joueur tue le monstre
    logMessage(`Le joueur a vaincu le monstre !`);
    playerStats.value.health = playerStats.value.maxHealth; // Régénération des PV
    return 'monsterDefeated';
  } else {
    // Le monstre survit et attaque le joueur
    playerStats.value.health -= monsterStats.value.strength;
    logMessage(
        `Le monstre t'a mis une tarte. Tu as perdu ${monsterStats.value.strength} points de vie.`
    );
    if (playerStats.value.health <= 0) return 'playerDefeated';
    return 'monsterSurvived';
  }
}

// Exposer la méthode `movePlayer` au parent
defineExpose({
  movePlayer
});

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