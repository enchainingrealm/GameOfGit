// =============================================================================
// CONSTANTS

// Dimensions of the game grid.
const NUM_ROWS = 52;
const NUM_COLUMNS = 52;

// Colours of cells in the game grid.
const NONE = "#ebedf0";
const LIGHT = "#c6e48b";
const MEDIUM = "#7bc96f";
const DARK = "#196127";

// Path to namespace for "rect" elements.
const PATH = "http://www.w3.org/2000/svg";

// =============================================================================
// FIELDS (current game and GUI state)

let currState = GameState();

let cells = null;
let listeners = null;

// =============================================================================
// FUNCTIONS (for initializing the game)

/**
 * Initializes the game state and GUI.
 * - The "js-calendar-graph-svg" DOM element is updated: the existing rectangles
 *   representing contribution history are removed, and new rectangles, with
 *   click handlers for toggling the state of the rectangle, are added. The
 *   result is a blank, interactive grid with dimensions (NUM_ROWS *
 *   NUM_COLUMNS).
 * - The cells field is populated with references to the rectangle DOM elements.
 * - The listeners field is populated with references to the click handlers
 *   attached to the cells.
 */
function initializeGame() {
    initializeListeners();
    initializeDOM();
    initializeCells();
}

/**
 * Initializes the listeners field to a (NUM_ROWS * NUM_COLUMNS) array of nulls.
 */
function initializeListeners() {
    listeners = [];
    for (let i = 0; i < NUM_ROWS; i++) {
        listeners.push(Array(NUM_COLUMNS).fill(null));
    }
}

/**
 * PRECONDITION: NUM_COLUMNS <= 52
 *
 * Initializes the game GUI.
 * - Creates a grid of size (NUM_ROWS * NUM_COLUMNS) in the contribution history
 *   box, expanding the history box vertically if necessary to fit the grid.
 * - Attaches click listeners to the rectangle DOM elements in the game grid, so
 *   cell states are toggled when cells are clicked.
 * - Populates the cells and listeners fields.
 */
function initializeDOM() {
    let svgElement = getElementByClassName("js-calendar-graph-svg");
    let gElement = getChild(svgElement);
    let columnElements = gElement.getElementsByTagName("g");

    svgElement.setAttribute("height", String(12 * NUM_ROWS + 20));

    // WARNING: if NUM_COLUMNS > 52, this code will not add the additional
    // columns to the DOM.
    while (columnElements.length > NUM_COLUMNS) {
        removeElement(columnElements[NUM_COLUMNS]);
        // the columnElements collection updates automatically
    }

    for (let j = 0; j < NUM_COLUMNS; j++) {
        let cellElements = columnElements[j].children;

        if (cellElements.length === 0) {
            throw new Error("No sample cell to obtain x from.");
        }
        let x = cellElements[0].getAttribute("x");

        while (cellElements.length > 0) {
            removeElement(cellElements[0]);
            // the cellElements collection updates automatically
        }

        for (let i = 0; i < NUM_ROWS; i++) {
            let cellElement = document.createElementNS(PATH, "rect");
            cellElement.style.width = "10";
            cellElement.style.height = "10";
            cellElement.style.x = x;
            cellElement.style.y = String(12 * i);
            cellElement.style.fill = NONE;

            listeners[i][j] = function() {
                if (currState.get(i, j) === 0) {
                    currState.set(MAX_STATE, i, j);
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

/**
 * Initializes the cells field to an array with dimensions (NUM_ROWS *
 * NUM_COLUMNS.) Sets cells[i][j] to the rectangle DOM element in the ith row
 * and jth column of the game grid in the DOM.
 */
function initializeCells() {
    let svgElement = getElementByClassName("js-calendar-graph-svg");
    let gElement = getChild(svgElement);
    let columnElements = gElement.getElementsByTagName("g");

    cells = [];
    for (let i = 0; i < NUM_ROWS; i++) {
        let row = [];
        for (let j = 0; j < NUM_COLUMNS; j++) {
            let cellElements = columnElements[j].children;
            let cellElement = cellElements[i];

            row.push(cellElement);
        }
        cells.push(row);
    }
}

// =============================================================================
// FUNCTIONS (for running the game)

/**
 * Starts running the game.
 * - Disables the ability to toggle cells by clicking on them, by removing the
 *   click listeners.
 * - Schedules the next generation (game state) to be computed and drawn every
 *   0.1 seconds.
 */
function runGame() {
    removeClickListeners();

    setInterval(function() {
        tick();
        repaint();
    }, 100);
}

/**
 * Removes all click listeners on the cells in the game grid on the DOM.
 * Effectively, this disables the ability to toggle cells by clicking on them.
 */
function removeClickListeners() {
    for (let j = 0; j < NUM_COLUMNS; j++) {
        for (let i = 0; i < NUM_ROWS; i++) {
            cells[i][j].removeEventListener("click", listeners[i][j]);
            listeners[i][j] = null;
        }
    }
}

/**
 * Computes the next generation (game state) based on the current generation
 * (currState), according to the rules of the Game of Life. Sets currState to
 * the computed next generation.
 */
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

/**
 * Computes the next state of the cell at the ith row and jth column, as per the
 * rules of the Game of Life.
 * @param i   the cell's row
 * @param j   the cell's column
 * @returns {!number}   the next state of the cell
 */
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

/**
 * Returns the number of live neighbours the cell at the ith row and jth column
 * has. The four adjacent cells (right, up, left, down) and the four diagonally
 * adjacent cells (upper-right, upper-left, lower-left, lower-right) are
 * considered to be neighbours.
 * @param i   the cell's row
 * @param j   the cell's column
 * @returns {number}   the number of live neighbours the cell has
 */
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

/**
 * Updates the colours of the cells in the game grid on the DOM, based on the
 * current state of the game (currState.)
 */
function repaint() {
    for (let i = 0; i < NUM_ROWS; i++) {
        for (let j = 0; j < NUM_COLUMNS; j++) {
            repaintCell(i, j);
        }
    }
}

/**
 * Updates the colour of the cell at the ith row and jth column in the game grid
 * on the DOM, based on the current state of that cell. Cells that have been
 * alive for longer are given darker colours.
 * @param i   the cell's row
 * @param j   the cell's column
 */
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
