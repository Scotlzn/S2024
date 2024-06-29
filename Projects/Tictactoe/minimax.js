// MINIMAX ALGORITHM
const EMPTY = 0;
var HUMAN = 1;
var AI = 2;

// Returns true if the board is full, false otherwise
function isBoardFull(board) {
    return board.every(cell => cell !== EMPTY);
}

// Returns an array of empty cells (indices) on the board
function emptyCells(board) {
    return board.reduce((acc, cell, index) => {
        if (cell === EMPTY) acc.push(index);
        return acc;
    }, []);
}

// Checks if the specified player has won the game
function isWinner(board, player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
        [0, 4, 8], [2, 4, 6]              // diagonals
    ];
    
    return winConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

// Minimax function
function minimax(board, depth, maximizingPlayer) {
    if (isWinner(board, AI)) {
        return 10 - depth;
    } else if (isWinner(board, HUMAN)) {
        return depth - 10;
    } else if (isBoardFull(board)) {
        return 0;
    }

    const availableCells = emptyCells(board);
    
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let cell of availableCells) {
            board[cell] = AI;
            let evaluation = minimax(board, depth + 1, false);
            board[cell] = EMPTY;
            maxEval = Math.max(maxEval, evaluation);
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let cell of availableCells) {
            board[cell] = HUMAN;
            let evaluation = minimax(board, depth + 1, true);
            board[cell] = EMPTY;
            minEval = Math.min(minEval, evaluation);
        }
        return minEval;
    }
}

// Function to find the best move for AI using minimax algorithm
function findBestMove(board) {
    let bestMove = -1;
    let bestEval = -Infinity;
    const availableCells = emptyCells(board);

    for (let cell of availableCells) {
        board[cell] = AI;
        let evaluation = minimax(board, 0, false);
        board[cell] = EMPTY;

        if (evaluation > bestEval) {
            bestEval = evaluation;
            bestMove = cell;
        }
    }

    return bestMove;
}

export function find_optimal_move(grid, turn) {
    AI = turn;
    HUMAN = (AI == 2) ? 1 : 2;
    let board = [].concat(...grid);
    let aiMove = findBestMove(board);
    let aiMoveY = Math.floor(aiMove / 3);
    let aiMoveX = aiMove - (aiMoveY * 3);
    return [aiMoveX, aiMoveY];
}