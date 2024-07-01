export function generate_grid(size) {
    let out = [];
    for (let y = 0; y < size; y++) {
        let nl = [];
        for (let x = 0; x < size; x++) {
            nl[x] = {
                collapsed: false,
                options: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            };
        }
        out[y] = nl;
    }
    return out;
}

export function make_filled_grid() {
    let matrix = [];
    for (let i = 0; i < 9; i++) {
        let row = [];
        for (let j = 0; j < 9; j++) {
            row.push(0);
        }
        matrix.push(row);
    }
    return matrix;
}

function save_data(data_input) {
    let data = data_input;
    let jsonString = JSON.stringify(data);
    localStorage.setItem('sudoku', jsonString);
}

function load_data() {
    let storedDataString = localStorage.getItem('sudoku');
    let storedData = JSON.parse(storedDataString);
    return storedData;
}

export function save_game(grid) {
    let out = [];
    for (let y = 0; y < 9; y++) {
        let nl = [];
        for (let x = 0; x < 9; x++) {
            let cell = grid[y][x];
            if (cell.collapsed) {
                nl[x] = cell.options[0];
            } else {
                nl[x] = 0;
            }
        }
        out[y] = nl;
    }
    save_data(out);
}

export function load_game(clear = false) {
    let out = [];
    let data = (!clear) ? load_data() : make_filled_grid();
    for (let y = 0; y < 9; y++) {
        let nl = [];
        for (let x = 0; x < 9; x++) {
            let cell = data[y][x];
            let c = (cell == 0) ? false : true;
            let o = (cell == 0) ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [cell];
            nl[x] = {
                collapsed: c,
                options: o
            };
        }
        out[y] = nl;
    }
    return out;
}