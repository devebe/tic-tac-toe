// Create a gameboard object

// A gameboard consists of 9 tiles
// A gameboard can be cleared after a game
// A gameboard has tiles
// A gameboard has players

// A player has a name
// A player has a character X or O
// A player can pick a tile on the gameboard

// Tiles can be seen as objects with 3 properties: 
// - isChecked (boolean) [false], 
// - ownedBy (playerName) [empty], 
// - position (number) [0]

const dataModule = (() => {

    const board = [];

    const tileFactory = (tilePosition) => {
        let owner = "-";
        let isChecked = false;
        return {tilePosition, owner, isChecked};
    };
    
    const buildBoard = (tiles) => {
        if (tiles == 0) {
            return;
        }
        else {
            board[tiles - 1] = tileFactory(tiles);
            buildBoard(tiles - 1);
        };
    };

    const playerFactory = (name) => {
        let ownsTiles = [];
        const setTile = (tilePosition) => {
            let tile = board[tilePosition - 1];
            if (tile.owner == "-") {
                tile.isChecked = true;
                tile.owner = name;
                ownsTiles.push(tile.tilePosition);
                return true;
            };
            return false;
        };
        return {name, ownsTiles, setTile};
    };

    return {board, playerFactory, buildBoard};

})();

const viewModule = (() => {

    const viewTile = (parent, name, text, tilePosition) => {
        const child = document.createElement('div');
        parent = document.querySelector(parent);
        child.setAttribute('class', `${name}`);
        child.setAttribute('id', `${tilePosition}`);
        child.textContent = text;
        parent.appendChild(child);
    };

    function buildBoard(parent, name, text, tiles) {
        for (let i = 0; i < tiles; i++) {
            viewTile(parent, name, text, (i + 1));
        };
    };

    return {buildBoard};

})();

const controllerModule = (() => {
    const buildGame = (tiles) => {
        viewModule.buildBoard('div#gameboard','tile','',tiles);
        dataModule.buildBoard(tiles);
    };

    buildGame(9);
    
    let turns = 0;
    let dice = 'X';
    const playerX = dataModule.playerFactory('X');
    const playerO = dataModule.playerFactory('O');
    
    document.addEventListener('click', (e) => {
        if ( dice == 'X') {
            let bool = playerX.setTile(e.target.id);
            e.target.textContent = dataModule.board[e.target.id - 1].owner;
            if(bool == true) {
                dice = 'O';
                turns++;
            };
        }
        else {
            let bool = playerO.setTile(e.target.id);
            e.target.textContent = dataModule.board[e.target.id - 1].owner;
            if(bool == true) {
                dice = 'X';
                turns++;
            };
        }
        checkWinner(playerX.ownsTiles, playerO.ownsTiles, winStates,turns);
    });

    const winStates = [
        [1,2,3], [4,5,6], [7,8,9],
        [1,4,7], [2,5,8], [3,6,9],
        [1,5,9], [3,5,7]
    ];

    function checkWinner(arrX, arrO, winStates,turns) {
        for (let i = 0; i < winStates.length; i++) {
            let winnerX = winStates[i].every(element => arrX.includes(element));
            if (winnerX == true){
                console.log('Player X has won');
            };
            let winnerO = winStates[i].every(element => arrO.includes(element));
            if (winnerO == true){
                console.log('Player O has won');
            };
            if (turns == 9 && winnerO == false && winnerX ==false) {
                console.log('It is a tie');
            };
        };
    };

    const btn = document.getElementById('restart');
    btn.addEventListener('click', (e) => {
        let oldGame = document.getElementById('gameboard');
        function removeAllChildNodes(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            };
        };
        removeAllChildNodes(oldGame);
        buildGame(9);
    });
})();