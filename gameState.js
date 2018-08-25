const MAX_STATE = 4;

// GameState constructor.
// A GameState object contains the states of all living cells in the game.
function GameState() {
    let obj = {};

    obj.datum = {};   // map from cell to state
    // - cell is string "(x, y)"
    //   - e.g. "(1, -7)"
    // - state is number
    //   - 0 means NONE
    //   - 1 means LIGHT
    //   - 2 means MEDIUM_LIGHT
    //   - 3 means MEDIUM_DARK
    //   - 4 means DARK

    /**
     * Returns the state of the cell in the ith row and jth column.
     * @param i   the cell's row
     * @param j   the cell's column
     * @returns {!number}   the state of the cell
     */
    obj.get = function(i, j) {
        let key = encode(i, j);
        if (obj.datum.hasOwnProperty(key)) {
            return obj.datum[key];
        } else {
            return 0;
        }
    };

    /**
     * Sets the state of the cell in the ith row and jth column to the given
     * state.
     * @param state   the state to set the cell to
     * @param i   the cell's row
     * @param j   the cell's column
     */
    obj.set = function(state, i, j) {
        let key = encode(i, j);
        if (state === 0) {
            delete obj.datum[key];
        } else {
            obj.datum[key] = state;
        }
    };

    return obj;
}

/**
 * Converts row and column numbers to string keys used in GameState.
 * @param i   the row number
 * @param j   the column number
 * @returns {!string}   the string key
 */
function encode(i, j) {
    return `(${i}, ${j})`;
}

/**
 * Converts string keys used in GameState to row and column numbers.
 * @param key   the string key
 * @returns {![number]}   the row and column numbers
 */
function decode(key) {
    let parts = key.split(", ");

    let i = Number(parts[0].slice(1));
    let j = Number(parts[1].slice(0, -1));

    return [i, j];
}

/**
 * If the given state is 0 (dead cell), return 0.
 * Otherwise, return the corresponding state in the next iteration, assuming the
 * respective cell stays alive:
 * - If the given state is already maximum, return it.
 * - Otherwise, add 1 to the state and return it.
 * @param state   the current state of a cell
 * @returns {!number}   the next state of the cell, assuming the cell lives on
 *                      to the next generation
 */
function next(state) {
    if (state === 0 || state === MAX_STATE) {
        return state;
    } else {
        return state + 1;
    }
}
