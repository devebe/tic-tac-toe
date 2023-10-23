const dataModule = (() => {

    const board = [];

    const tileFactory = (position) => {
        let owner = "-";
        return {position, owner};
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
        const setTile = (position) => {
            let tile = board[position];
            if (tile.owner == "-") {
                tile.owner = name;
                ownsTiles.push(tile.position);
                return true;
            };
            return false;
        };
        return {name, ownsTiles, setTile};
    };

    return {board, playerFactory, buildBoard};

})();

const viewModule = (() => {

    function Component(name, parentId) {
        this.name = name;
        this.id;
        this.tagType;
        this.parentId = parentId;
    };
    
    const buildComponent = (component) => {
        const child = document.createElement(`${component.tagType}`);
        child.setAttribute('id',`${component.id}`);
        child.setAttribute('class',`${component.name}`);
        const parent = document.getElementById(`${component.parentId}`);
        parent.appendChild(child);
    };
    
    const buildBoard = (numberOfTiles) => {
        for (let i = 0; i < numberOfTiles; i++) {
            const tile = new Component('tile','gameboard');
            tile.tagType = 'div';
            tile.id = i
            buildComponent(tile);
        };
    };

    return {buildBoard};

})();

const controllerModule = (() => { 
    let turns = 0;
    let dice = 'X';
    const playerX = dataModule.playerFactory('X');
    const playerO = dataModule.playerFactory('O');
    const btn = document.getElementById('restart');
    const gameboard = document.getElementById('gameboard');

    const buildGame = (tiles) => {
        dataModule.buildBoard(tiles);
        viewModule.buildBoard(tiles);
    };

    buildGame(9);
    
    gameboard.addEventListener('click', (e) => {
        if ( dice == 'X') {
            let bool = playerX.setTile(e.target.id);
            e.target.textContent = dataModule.board[e.target.id].owner;
            if(bool == true) {
                dice = 'O';
                turns++;
            };
        }
        else {
            let bool = playerO.setTile(e.target.id);
            e.target.textContent = dataModule.board[e.target.id].owner;
            if(bool == true) {
                dice = 'X';
                turns++;
            };
        }
        checkWinner(playerX.ownsTiles, playerO.ownsTiles, winStates,turns);
    });

    const winStates = [
        [1,5,9], [3,5,7],
        [1,2,3], [4,5,6], [7,8,9],
        [1,4,7], [2,5,8], [3,6,9] 
    ];

    const checkWinner = (arrX, arrO, winStates,turns) => {
        for (let i = 0; i < winStates.length; i++) {
            let winnerX = winStates[i].every(element => arrX.includes(element));
            if (winnerX == true){
                console.log('Player X has won');
            };
            let winnerO = winStates[i].every(element => arrO.includes(element));
            if (winnerO == true){
                console.log('Player O has won');
            };
            if (turns == 9 && winnerO == false && winnerX == false) {
                console.log('It is a tie');
                break;
            };
        };  
    };

    btn.addEventListener('click', (e) => {
        location.reload();
    });
})();