function GameState() {
    let obj = {};

    obj.datum = {};   // map from cell to state
    // - cell is string "(x, y)"
    //   - e.g. "(1, -7)"
    // - state is number
    //   - 0 means NONE
    //   - 1 means LIGHT
    //   - 2 means MEDIUM
    //   - 3 means DARK

    obj.get = function(i, j) {
        let key = encode(i, j);
        if (obj.datum.hasOwnProperty(key)) {
            return obj.datum[key];
        } else {
            return 0;
        }
    };

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

function encode(i, j) {
    return `(${i}, ${j})`;
}

function decode(key) {
    let parts = key.split(", ");

    let i = Number(parts[0].slice(1));
    let j = Number(parts[1].slice(0, -1));

    return [i, j];
}
