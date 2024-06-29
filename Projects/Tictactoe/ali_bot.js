const levels = 7;
const level_multiplier = 10;

function are_equal(a, b, c) {
    return a === b && b === c;
}

export function getRandomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function get_possible_moves(grid) {
    let moves = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] == 0) moves.push([j, i]);
        }
    }
    return moves;
}

// RETURNS 0 = nothing, 1 = X win!, 2 = O win!, 3 = Draw
export function check_win(grid) {
    // Verticle wins
    for (let i = 0; i < 3; i++) {
        if (are_equal(grid[0][i], grid[1][i], grid[2][i])) {
            return grid[0][i];
        }
    }
    // Horizontal wins
    for (let i = 0; i < 3; i++) {
        if (are_equal(grid[i][0], grid[i][1], grid[i][2])) {
            return grid[i][0];
        }
    }
    // Diagonal wins
    if (are_equal(grid[0][0], grid[1][1], grid[2][2])) {
        return grid[1][1];
    }
    if (are_equal(grid[0][2], grid[1][1], grid[2][0])) {
        return grid[1][1];
    }
    // Check draw
    if (get_possible_moves(grid).length == 0) return 3;
    // If it gets to here then nothing has happened
    return 0;
}

function check_all_moves(tree_index, parent_grid, scores, turn, original_tile, level) {
    let possible_moves = get_possible_moves(parent_grid);
    let next_tile = (turn) ? 1 : 2;
    let opp_tile = (original_tile == 1) ? 2 : 1;
    possible_moves.forEach((move) => {
        let temp_grid = structuredClone(parent_grid);
        temp_grid[move[1]][move[0]] = next_tile;
        let result = check_win(temp_grid)
        let game_finished = false;
        switch (result) {
            case (original_tile):
                scores[tree_index] += ((levels + 1)*level_multiplier) - (level_multiplier * level);
                game_finished = true;
                break;
            case (opp_tile):
                scores[tree_index] -= ((levels + 1)*level_multiplier) - (level_multiplier * level);
                game_finished = true;
                break;
        }
        if (level < levels && !game_finished) {
            check_all_moves(tree_index, temp_grid, scores, !turn, original_tile, level + 1);
        }
    });
}

export function find_best_move(grid, tile) {
    let possible_moves = get_possible_moves(grid);
    const scores = Array(possible_moves.length).fill(0);
    let my_tile = tile;
    let turn = (my_tile == 1) ? true : false;
    let opp_tile = (my_tile == 1) ? 2 : 1;
    possible_moves.forEach((move, index) => {
        let temp_grid = structuredClone(grid);
        temp_grid[move[1]][move[0]] = my_tile;
        let result = check_win(temp_grid)
        let game_finished = false;
        switch (result) {
            case (my_tile):
                scores[index] += ((levels + 1)*level_multiplier) - (level_multiplier * 1);
                game_finished = true;
                break;
            case (opp_tile):
                scores[index] -= ((levels + 1)*level_multiplier) - (level_multiplier * 1);
                game_finished = true;
                break;
        }
        if (levels > 1 && !game_finished) {
            check_all_moves(index, temp_grid, scores, !turn, my_tile, 2);
        }
    });
    // Calculate best move
    let highest = [-Infinity];
    let indexes = [];
    scores.forEach((score, index) => {
        if (score > highest[0]) {
            highest = [score];
            indexes = [index];
        } else if (score == highest[0]) {
            indexes.push(index);
        }
    });
    let best_move = possible_moves[indexes[0]];
    if (indexes.length > 1) {
        let choice = getRandomIntInRange(0, indexes.length - 1);
        best_move = possible_moves[choice];
    }
    return best_move;
}