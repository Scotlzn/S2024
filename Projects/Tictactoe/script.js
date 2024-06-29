import { find_best_move, check_win, get_possible_moves, getRandomIntInRange } from "./ali_bot.js";
import { find_optimal_move } from "./minimax.js";

// get DOM elements
const canvas = document.getElementById("canvas1");

// UI
const dropdown1 = document.getElementById('dropdown1');
const dropdown2 = document.getElementById('dropdown2');
const dropbtn1 = document.getElementById('dropbtn1');
const dropbtn2 = document.getElementById('dropbtn2');
const dropdown_content1 = document.getElementById("dropdown-content1");
const dropdown_content2 = document.getElementById("dropdown-content2");

const ui_step_button = document.getElementById('ui_step_button');
const ui_reset_button = document.getElementById('ui_reset_button');
const ui_turn_display = document.getElementById('ui_turn_display');

const bounding_box = canvas.getBoundingClientRect();
var ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

// 0 = human, 1 = Random AI, 2 = Ali's AI 3 = Minimax AI
var p1 = 0
var p2 = 0;

// 0 = nothing, 1 = X, 2 = O
var grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var visual_converter = {1: 'X', 2: 'O'};
var turn = true; // true = X, false = O
var ai_turn = 2;
var ended = false;
var two_player;

ctx.strokeStyle = 'white';

function reset_game() {
    grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    turn = true;
    ended = false;
    if (ai_turn == 1) AI_goes_first();
    let m = (ai_turn == 2) ? 1 : 2;
    ui_turn_display.textContent = 'Turn: ' + visual_converter[m];
    render();
}

function find_winner() {
    switch (check_win(grid)) {
        case (1):
            ui_turn_display.textContent = 'X wins!';
            break;
        case (2):
            ui_turn_display.textContent = 'O wins!';
            break;
        case (3):
            ui_turn_display.textContent = 'Draw!';
            break;
        default:
            let m = (ai_turn == 2) ? 1 : 2;
            if (two_player) m = (turn) ? 1 : 2;
            ui_turn_display.textContent = 'Turn: ' + visual_converter[m];
            return;
    }
    ended = true;
}

function move(x, y, tile) {
    grid[y][x] = tile;
    turn = !turn;
    render();
    find_winner();
}

function random_move() {
    let possible_moves = get_possible_moves(grid);
    let choice = getRandomIntInRange(0, possible_moves.length - 1);
    return possible_moves[choice];
}

function line(x1, y1, x2, y2) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
}

function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 4;
    let tile_width = width / 3;
    let tile_height = height / 3;

    // Outline
    ctx.beginPath();
    line(tile_width, 0, tile_width, height);
    line(tile_width * 2, 0, tile_width * 2, height);
    line(0, tile_height, width, tile_height);
    line(0, tile_height * 2, width, tile_height * 2);
    ctx.stroke();

    // Noughts and crosses
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let x = j * tile_width + (tile_width * 0.5);
            let y = i * tile_width + (tile_height * 0.5);
            let tile = grid[i][j];
            ctx.beginPath();
            if (tile == 1) {
                let xr = (tile_width * 0.25);
                line(x - xr, y - xr, x + xr, y + xr);
                line(x + xr, y - xr, x - xr, y + xr);
            } else if (tile == 2) {
                ctx.arc(x, y, (tile_width * 0.25), 0, 2 * Math.PI);
            }
            ctx.stroke();
        }
    }
}

function AI_move(player) {
    let ai_move;
    switch(player) {
        case (1):
            ai_move = random_move();
            break;
        case (2):
            ai_move = find_best_move(grid, ai_turn);
            break;
        case (3):
            ai_move = find_optimal_move(grid, ai_turn);
            break;
    }
    move(ai_move[0], ai_move[1], ai_turn);
}

function AI_goes_first() {
    grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    turn = false;
    ai_turn = 1;
    AI_move(p1);
}

function step() {
    if (!ended && ((p1 != 0) && (p2 != 0))) {
        let player = (turn) ? p2 : p1;
        ai_turn = (ai_turn == 1) ? 2 : 1;
        AI_move(player);
    }
}

canvas.addEventListener('click', function(event) {
    if (!ended && (turn || (p1 == 0 && p2 == 0))) {
        // PLAYER 1
        if ((p1 != 0) && (p2 != 0)) return;
        let mouseX = event.clientX - bounding_box.left;
        let mouseY = event.clientY - bounding_box.top;
        let tileX = Math.floor(mouseX / (width / 3));
        let tileY = Math.floor(mouseY / (height / 3));
        let tile_in_place = grid[tileY][tileX];
        two_player = (p1 == 0 && p2 == 0)

        if (tile_in_place != 0) return;

        let tile = (ai_turn == 1) ? 2 : 1; 
        if (two_player) tile = (turn) ? 1 : 2;
        move(tileX, tileY, tile);

        // AI
        if (ended || two_player) return;
        let player = (ai_turn == 1) ? p1 : p2;
        AI_move(player);
    }
});

render();

// ------------------------------------- UI -------------------------------------------
dropbtn1.onclick = function() {
    dropdown1.classList.toggle('show');
}

const dropdown_to_mode = {"human": 0, "random ai": 1, "ali's ai (slow)": 2, 'minimax algorithm': 3}

// Dropdown functionality
let buttonsArray = Array.from(dropdown_content1.childNodes).filter(node => node.nodeName.toLowerCase() === 'button');
buttonsArray.forEach((button, index) => {
    button.onclick = function() {
        dropbtn1.textContent = button.textContent;
        p1 = dropdown_to_mode[button.textContent.toLowerCase()]
        if (p1 != 0) {
            AI_goes_first();
        } else {
            ai_turn = 2;
        }
        reset_game();
        dropdown1.classList.remove('show');
    }
});
buttonsArray = Array.from(dropdown_content2.childNodes).filter(node => node.nodeName.toLowerCase() === 'button');
buttonsArray.forEach((button, index) => {
    button.onclick = function() {
        dropbtn2.textContent = button.textContent;
        p2 = dropdown_to_mode[button.textContent.toLowerCase()]
        reset_game();
        dropdown2.classList.remove('show');
    }
});

dropbtn2.onclick = function() {
    dropdown2.classList.toggle('show');
}

ui_step_button.onclick = function() {
    step();
}

ui_reset_button.onclick = function() {
    reset_game();
}

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function(event) {
    if (!dropdown1.contains(event.target)) {
        dropdown1.classList.remove('show');
    }
    if (!dropdown2.contains(event.target)) {
        dropdown2.classList.remove('show');
    }
});