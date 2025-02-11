import {useLoggerStore} from "../store/loggerStore.js";

export default class GameBoard {
    constructor(boardWidth = 30, boardHeight = 15) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.board = [];
        this.playerPosition = { x: 0, y: 0 };
        this.gameStatus = 'running';
        this.numberOfMonsters = Math.floor(this.boardWidth * this.boardHeight * 0.05);
        this.playerStats = { health: 100, maxHealth: 100, strength: 30 };
        this.monsterStats = { health: null, strength: null };
        this.loggerStore = useLoggerStore()
        this.generateMap();
    }

    generateMap() {
        this.loggerStore.clearLogs()
        this.generateBoard();
        this.generateLandscape();
        this.placeElements();
        this.gameStatus = 'running';
        this.loggerStore.logMessage(`Nouvelle carte générée`)
    }

    /** game board generation */
    generateBoard() {
        this.board = Array.from({ length: this.boardHeight }, () =>
            Array.from({ length: this.boardWidth }, () => ({
                texture: 'grass',
                content: 'empty',
            }))
        );
    }

    generateLandscape() {
        this.generateProceduralObstacle('water', Math.floor(this.boardWidth * this.boardHeight * 0.15));
        this.generateProceduralObstacle('rock', Math.floor(this.boardWidth * this.boardHeight * 0.10));
        this.generateProceduralObstacle('water', Math.floor(this.boardWidth * this.boardHeight * 0.10));
        this.generateProceduralObstacle('rock', Math.floor(this.boardWidth * this.boardHeight * 0.15));
    }

    // Fonction de génération procédurale d'ensemble de cellules infranchissables
    generateProceduralObstacle(type, totalConnectedCells) {
        let placedCells = 0;

        // Choisir un point de départ aléatoire
        const startX = Math.floor(Math.random() * this.boardWidth);
        const startY = Math.floor(Math.random() * this.boardHeight);

        // Initialiser la cellule actuelle avec le point de départ
        let currentCell = { x: startX, y: startY };
        this.board[currentCell.y][currentCell.x].texture = type;
        placedCells++;

        // Propagation séquentielle
        while (placedCells < totalConnectedCells) {
            // Obtenir les voisins de la cellule actuelle
            const neighbors = this.calculateNeighborCells(currentCell, false);
            let foundValidNeighbor = false;

            // Mélanger les voisins pour un comportement plus aléatoire
            this.shuffle(neighbors);

            for (const neighbor of neighbors) {

                // Vérifier les conditions de placement
                if (
                    !this.isOutOfBoard(neighbor)
                    // && this.board[neighbor.y][neighbor.x].texture === 'grass'
                    && !this.hasInvalidNeighbor(neighbor, type === 'water' ? 'rock' : 'water')
                    && this.hasMatchingNeighbor(neighbor, type)
                ) {
                    this.board[neighbor.y][neighbor.x].texture = type;
                    placedCells++;
                    currentCell = neighbor; // Mettre à jour la cellule actuelle
                    foundValidNeighbor = true;
                    break; // Passer à la prochaine itération avec la nouvelle cellule actuelle
                }
            }

            // Si aucun voisin valide n'est trouvé, arrêter la propagation
            if (!foundValidNeighbor) break;
        }
    }

    // Fonction utilitaire : vérifier les voisins pour éviter la proximité avec un autre type
    hasInvalidNeighbor(cell, forbiddenType) {
        const neighbors = this.calculateNeighborCells(cell, true, 2);
        return neighbors.some((cell) =>
            cell.y >= 0 && cell.y < this.boardHeight &&
            cell.x >= 0 && cell.x < this.boardWidth &&
            this.board[cell.y][cell.x].texture === forbiddenType
        );
    }

    // Fonction utilitaire : vérifier les voisins pour garantir la connexion
    hasMatchingNeighbor(cell, matchType) {
        const neighbors = this.calculateNeighborCells(cell, false, 1);
        return neighbors.some((cell) =>
            cell.y >= 0 && cell.y < this.boardHeight &&
            cell.x >= 0 && cell.x < this.boardWidth &&
            this.board[cell.y][cell.x].texture === matchType
        );
    }

    // Fonction utilitaire : vérifier si une position est dans le plateau
    isOutOfBoard (cell) {
        return (
            cell.x < 0 || cell.x >= this.boardWidth
            ||
            cell.y < 0 || cell.y >= this.boardHeight
        );
    }

    // Fonction utilitaire : calculer toutes les cellules voisines
    calculateNeighborCells(cell, includeDiagonals = true, range = 1) {
        let neighbors = [];
        for (let step = 1; step <= range; step++) {
            neighbors.push(
                { x: cell.x + 0, y: cell.y + step },  // Haut
                { x: cell.x + step, y: cell.y + 0 },  // Droite
                { x: cell.x + 0, y: cell.y - step },  // Bas
                { x: cell.x - step, y: cell.y + 0 },  // Gauche
            )
            if(includeDiagonals === true) neighbors.push(
                { x: cell.x + step, y: cell.y + step },  // Diagonale haut-droite
                { x: cell.x + step, y: cell.y - step },  // Diagonale bas-droite
                { x: cell.x - step, y: cell.y - step },  // Diagonale bas-gauche
                { x: cell.x - step, y: cell.y + step },  // Diagonale haut-gauche
            )
        }
        return neighbors;
    }

    // Fonction utilitaire : mélanger un tableau (algorithme de Fisher-Yates)
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /** Object generation */

    placeElements() {
        this.playerPosition = this.getRandomEmptyGrassCell();
        this.board[this.playerPosition.y][this.playerPosition.x].content = 'player';

        const treasurePosition = this.getRandomEmptyGrassCell();
        this.board[treasurePosition.y][treasurePosition.x].content = 'treasure';

        for (let i = 0; i < this.numberOfMonsters; i++) {
            const monsterPosition = this.getRandomEmptyGrassCell();
            this.board[monsterPosition.y][monsterPosition.x].content = 'monster';
        }
    }

    getRandomEmptyGrassCell() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.boardWidth);
            y = Math.floor(Math.random() * this.boardHeight);
        } while (this.board[y][x].content !== 'empty' || this.board[y][x].texture !== 'grass');
        return { x, y };
    }

    /** Player interaction */

    movePlayer(direction) {
        if (this.gameStatus !== 'running') return;

        let newX = this.playerPosition.x;
        let newY = this.playerPosition.y;

        if (direction === 'up') newY--;
        if (direction === 'down') newY++;
        if (direction === 'left') newX--;
        if (direction === 'right') newX++;

        if (
            newX < 0 || newX >= this.boardWidth
            ||
            newY < 0 || newY >= this.boardHeight
        ) {
            this.loggerStore.logMessage(`Vers l'infini et au-delà !!!...`)
            return
        }

        if (this.board[newY][newX].texture !== 'grass') {
            let message = ''
            switch (this.board[newY][newX].texture){
                case 'water' : message = `T'es déjà capable de te noyer dans un verre d'eau...`;break
                case 'rock' : message = `Même si t'es une vraie tête de pioche...`;break
            }
            this.loggerStore.logMessage(`Cet obstacle est infranchissable ! ${message}`)
            return
        }

        let moveIsAllowed = true;

        if (this.board[newY][newX].content === 'monster') {
            this.loggerStore.logMessage(`Général Kenobi !!`)
            moveIsAllowed = false;
            this.generateMonsterStats();
            const combatResult = this.handleMonsterEncounter();

            if (combatResult === 'monsterDefeated') {
                moveIsAllowed = true;
            } else if (combatResult === 'playerDefeated') {
                this.gameStatus = 'defeat';
            }
        }

        if (moveIsAllowed) {
            if (this.board[newY][newX].content === 'treasure') {
                this.gameStatus = 'victory';
            }

            this.board[this.playerPosition.y][this.playerPosition.x].content = 'empty';
            this.playerPosition = { x: newX, y: newY };
            this.loggerStore.logMessage(`Player is now on ${newX}:${newY}`)
            this.board[newY][newX].content = 'player';
        }
    }

    generateMonsterStats() {
        this.monsterStats = {
            health: Math.floor(Math.random() * 50) + 20,
            strength: Math.floor(Math.random() * 20) + 10,
        };
    }

    handleMonsterEncounter() {
        // Comparer la force du joueur avec les PV du monstre
        if (this.playerStats.strength >= this.monsterStats.health) {
            // Le joueur tue le monstre
            this.loggerStore.logMessage(`Tu l'as eu !!`)
            // Le joueur regagne tous ses PV
            this.playerStats.health = this.playerStats.maxHealth;
            return 'monsterDefeated';
        } else {
            // Le monstre survit et attaque le joueur
            this.playerStats.health -= this.monsterStats.strength;
            this.loggerStore.logMessage(
                `Le monstre t'a mis une tarte. Tu as perdu ${this.monsterStats.strength} points de vie.`
            )
            // Le joueur a perdu tous les PV
            if (this.playerStats.health <= 0) {
                this.loggerStore.logMessage(`Tu t'es fait laver !!`)
                return 'playerDefeated';
            }
            // Le joueur et le monstre font match nul
            this.loggerStore.logMessage(`Chacun repart de son côté avec une portion de soupe de phalanges...`)
            return 'monsterSurvived';
        }
    }
}