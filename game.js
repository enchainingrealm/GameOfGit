const NONE = "#ebedf0";
const LIGHT = "#c6e48b";
const MEDIUM = "#7bc96f";
const DARK = "#196127";

let gameState = {};   // map from cell to state
// - cell is string "x, y"
//   - e.g. "1, 7"
// - state is number
//   - 0 means NONE
//   - 1 means LIGHT
//   - 2 means MEDIUM
//   - 3 means DARK

function getState(i, j) {
    let key = `(${i}, ${j})`;
    if (gameState.hasOwnProperty(key)) {
        return gameState[key];
    } else {
        return 0;
    }
}

function setState(state, i, j) {
    let key = `(${i}, ${j})`;
    gameState[key] = state;
}

let gridCells = getGridCells();

function initializeGame() {
    let cells = getGridCells();
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[0].length; j++) {
            let cell = cells[i][j];
            cell.setProperty("fill", NONE);
            cell.addEventListener("click", function() {
                cell.setProperty("fill", DARK);
            });
        }
    }
}

function runGame() {
    setTimeout(function() {
        tick();
        repaint();
    }, 1000);
}

function tick() {
    
}

function repaint() {
    //
}

function getGridCells() {
    let gridCells = [];

    let gridColumns = getGridColumns();
    Array.from(gridColumns).forEach(function(gridColumn) {
        let cells = gridColumn.children;
        Array.from(cells).forEach(function(cell) {

        });
    });

    return gridCells;
}

function getGridColumns() {
    let svg = document.getElementsByClassName("js-calendar-graph-svg");
    if (svg.length !== 1) {
        return;
    }
    svg = svg[0];

    let g = svg.children;
    if (g.length !== 1) {
        return;
    }
    g = g[0];

    return g.children;
}
