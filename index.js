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

    const buildBoard = (parent, name, text, tiles) => {
        for (let i = 0; i < tiles; i++) {
            viewTile(parent, name, text, (i + 1));
        };
    };

    const viewInfoMessage = (message) => {
        viewTile('div.alert', 'gameresult', message, '');
    }

    return {buildBoard, viewInfoMessage};

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
        viewModule.buildBoard('div#gameboard','tile','',tiles);
    };

    buildGame(9);
    
    gameboard.addEventListener('click', (e) => {
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

    const checkWinner = (arrX, arrO, winStates,turns) => {
        for (let i = 0; i < winStates.length; i++) {
            let winnerX = winStates[i].every(element => arrX.includes(element));
            if (winnerX == true){
                viewModule.viewInfoMessage('Player X has won');
            };
            let winnerO = winStates[i].every(element => arrO.includes(element));
            if (winnerO == true){
                viewModule.viewInfoMessage('Player O has won');
            };
            if (turns == 9 && winnerO == false && winnerX ==false) {
                viewModule.viewInfoMessage('It is a tie');
            };
        };   
    };

    btn.addEventListener('click', (e) => {
        location.reload();
    });
})();