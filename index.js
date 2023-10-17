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
        let owner = null;
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
            if (!tile.owner) {
                tile.isChecked = true;
                tile.owner = name;
                ownsTiles.push(tile);
            };
        };
        return {name, ownsTiles, setTile};
    };
   
    buildBoard(9);

    return {board, playerFactory};

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

    function buildBoard(parent, name, text) {
        const tiles = 9;
        for (let i = 0; i < tiles; i++) {
            viewTile(parent, name, text, (i + 1));
        };
    };

    return {buildBoard};

})();

const controllerModule = (() => {
    const playerX = dataModule.playerFactory('X');
    const playerO = dataModule.playerFactory('O');
    const turns = 0;
    
    document.addEventListener('click', (e) => {
        if (turns % 2 == 0) {
            playerX.setTile(e.target.id);
            console.log(playerX);
        }
        else {
            playerO.setTile(e.target.id);
            console.log(playerO);
        }
        console.log(playerX);
        console.log(dataModule.board);
        e.target.textContent = playerX.name;
        turns++;
    });
    
})();

const game = (() => {
    viewModule.buildBoard('div.gameboard','tile','');
    
    return console.log(dataModule.board);
})();

//.attributes.tileposition.value