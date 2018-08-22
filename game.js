const NUM_ROWS = 52;
const NUM_COLUMNS = 52;

const NONE = "#ebedf0";
const LIGHT = "#c6e48b";
const MEDIUM = "#7bc96f";
const DARK = "#196127";

const PATH = "http://www.w3.org/2000/svg";

// =============================================================================

let currState = GameState();

let cells = null;
let listeners = null;

// =============================================================================

function initializeGame() {
    initializeListeners();
    initializeDOM();
    initializeCells();
}

function initializeListeners() {
    listeners = [];
    for (let i = 0; i < NUM_ROWS; i++) {
        listeners.push(Array(NUM_COLUMNS).fill(null));
    }
}

function initializeDOM() {
    let svgElement = getElementByClassName("js-calendar-graph-svg");
    let gElement = getChild(svgElement);
    let columnElements = gElement.getElementsByTagName("g");

    svgElement.setAttribute("height", String(12 * NUM_ROWS + 20));

    while (columnElements.length > 52) {
        removeElement(columnElements[52]);
        // the columnElements collection updates automatically
    }

    for (let j = 0; j < 52; j++) {
        let cellElements = columnElements[j].children;

        if (cellElements.length === 0) {
            throw new Error("No sample cell to obtain x from.");
        }
        let x = cellElements[0].getAttribute("x");

        while (cellElements.length > 0) {
            removeElement(cellElements[0]);
            // the cellElements collection updates automatically
        }

        for (let i = 0; i < 52; i++) {
            let cellElement = document.createElementNS(PATH, "rect");
            cellElement.style.width = "10";
            cellElement.style.height = "10";
            cellElement.style.x = x;
            cellElement.style.y = String(12 * i);
            cellElement.style.fill = NONE;

            listeners[i][j] = function() {
                if (currState.get(i, j) === 0) {
                    currState.set(3, i, j);
                    cellElement.style.fill = DARK;
                } else {
                    currState.set(0, i, j);
                    cellElement.style.fill = NONE;
                }
            };
            cellElement.addEventListener("click", listeners[i][j]);

            columnElements[j].appendChild(cellElement);
        }
    }
}

function initializeCells() {
    let svgElement = getElementByClassName("js-calendar-graph-svg");
    let gElement = getChild(svgElement);
    let columnElements = gElement.getElementsByTagName("g");

    cells = [];
    for (let i = 0; i < 52; i++) {
        let row = [];
        for (let j = 0; j < 52; j++) {
            let cellElements = columnElements[j].children;
            let cellElement = cellElements[i];

            row.push(cellElement);
        }
        cells.push(row);
    }
}

// =============================================================================

function runGame() {
    removeClickListeners();

    setInterval(function() {
        tick();
        repaint();
    }, 100);
}

function removeClickListeners() {
    for (let j = 0; j < 52; j++) {
        for (let i = 0; i < 52; i++) {
            cells[i][j].removeEventListener("click", listeners[i][j]);
            listeners[i][j] = null;
        }
    }
}

function tick() {
    let newState = GameState();

    let worklist = new Set();
    Object.keys(currState.datum).forEach(function(key) {
        let [i, j] = decode(key);
        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                let newKey = encode(i + di, j + dj);
                worklist.add(newKey);
            }
        }
    });

    worklist.forEach(function(newKey) {
        let [i, j] = decode(newKey);

        let state = tickCell(i, j);
        newState.set(state, i, j);
    });

    currState = newState;
}

function tickCell(i, j) {
    let state = currState.get(i, j);
    let count = countLiveNeighbours(i, j);

    if (state === 0) {
        // dead cell
        if (count === 3) {
            return 1;
        } else {
            return 0;
        }
    } else {
        // live cell
        if (count <= 1) {
            return 0;
        } else if (count <= 3) {
            return next(state);
        } else {
            return 0;
        }
    }
}

function countLiveNeighbours(i, j) {
    let count = 0;
    for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) {
                continue;
            }

            if (currState.get(i + di, j + dj) !== 0) {
                count++;
            }
        }
    }
    return count;
}

function next(state) {
    if (state === 0 || state === 3) {
        return state;
    } else {
        return state + 1;
    }
}

function repaint() {
    for (let i = 0; i < 52; i++) {
        for (let j = 0; j < 52; j++) {
            repaintCell(i, j);
        }
    }
}

function repaintCell(i, j) {
    let state = currState.get(i, j);
    let cellElement = cells[i][j];

    switch (state) {
    case 0:
        cellElement.style.fill = NONE;
        break;
    case 1:
        cellElement.style.fill = LIGHT;
        break;
    case 2:
        cellElement.style.fill = MEDIUM;
        break;
    case 3:
        cellElement.style.fill = DARK;
        break;
    default:
        throw new Error("Illegal cell state.");
    }
}
