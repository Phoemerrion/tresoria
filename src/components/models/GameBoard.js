import {useLoggerStore} from "../store/loggerStore.js";

export default class GameBoard {
    constructor(boardWidth = 30, boardHeight = 15) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.board = [];
        this.playerPosition = { x: 0, y: 0 };
        this.gameStatus = 'running';
        this.numberOfMonsters = Math.floor(this.boardWidth * this.boardHeight * 0.1);
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
        this.generateConnectedCells('water', 0.03);
        this.generateConnectedCells('rock', 0.05);
        this.generateConnectedCells('water', 0.03);
        this.generateConnectedCells('rock', 0.05);
    }

    generateConnectedCells(type, percentageOfCells) {
        const totalConnectedCells = Math.floor(this.boardWidth * this.boardHeight * percentageOfCells);

        let placedCells = 0;

        // Placement des cellules connectées
        while (placedCells < totalConnectedCells) {
            const x = Math.floor(Math.random() * this.boardWidth);
            const y = Math.floor(Math.random() * this.boardHeight);

            // Placement initial ou connexion à une cellule existante
            if (
                this.board[y][x].texture === 'grass' && // Uniquement sur herbe
                !this.isTooCloseToEdge(x, y) && // Pas trop proche du bord
                !this.hasInvalidNeighbor(x, y, type === 'water' ? 'rock' : 'water') && // Vérification de séparation
                (placedCells === 0 || this.hasMatchingNeighbor(x, y, type)) // Doit être connecté
            ) {
                this.board[y][x].texture = type;
                placedCells++;
            }
        }
    }

    // Fonction utilitaire : vérifier les voisins pour éviter la proximité avec un autre type
    hasInvalidNeighbor(x, y, forbiddenType) {
        const neighbors = [
            { nx: x - 2, ny: y }, // Gauche
            { nx: x + 2, ny: y }, // Droite
            { nx: x, ny: y - 2 }, // Haut
            { nx: x, ny: y + 2 }  // Bas
        ];
        return neighbors.some(({ nx, ny }) =>
            ny >= 0 && ny < this.boardHeight &&
            nx >= 0 && nx < this.boardWidth &&
            this.board[ny][nx].texture === forbiddenType
        );
    }

    // Fonction utilitaire : vérifier les voisins pour garantir la connexion
    hasMatchingNeighbor(x, y, matchType) {
        const neighbors = [
            { nx: x - 1, ny: y }, // Gauche
            { nx: x + 1, ny: y }, // Droite
            { nx: x, ny: y - 1 }, // Haut
            { nx: x, ny: y + 1 }  // Bas
        ];
        return neighbors.some(({ nx, ny }) =>
            ny >= 0 && ny < this.boardHeight &&
            nx >= 0 && nx < this.boardWidth &&
            this.board[ny][nx].texture === matchType
        );
    }

    // Fonction utilitaire : vérifier si une position est trop proche du bord
    isTooCloseToEdge(x, y) {
        return x === 0 || x === this.boardWidth - 1 || y === 0 || y === this.boardHeight - 1;
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
            this.loggerStore.logMessage(
                `Vers l'infini et au-delà !!! ... Tu t'es pris pour un passe muraille c'est ça ?`
            )
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