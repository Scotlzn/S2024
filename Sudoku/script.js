import { generate_grid, save_game } from "./support.js";

// UI
const dropdown = document.querySelector('.dropdown');
const dropbtn = dropdown.querySelector('.dropbtn');

const canvas = document.getElementById("canvas1");
const bounding_box = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d');

const ui_entropy_button = document.getElementById("ui_entropy_button");
const save_button = document.getElementById("save_button");
const load_button = document.getElementById("load_button");

const width = canvas.width;
const height = canvas.height;
const tile_size = width / 9;
const entropy_distance = 20;

const grid = generate_grid(9);

var display_entropy = true;
var selected_tile = [];

ctx.font = '40px "Press Start 2P"';
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

function line(x1, y1, x2, y2) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
}

function render_number(number, x, y) {
    ctx.fillText(number, x, y);
}

function render() {
    ctx.clearRect(0, 0, width, height);

    // Outlines
    for (let i = 1; i <= 8; i++) {
        let w = ((i % 3) == 0) ? 3 : 1;
        ctx.lineWidth = w;
        ctx.beginPath();
        line(i * tile_size, 0, i * tile_size, height);
        line(0, i * tile_size, width, i * tile_size);
        ctx.stroke();
    }

    // Numbers and entropy
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let cell = grid[y][x];
            let midpoints = [x * tile_size + (tile_size * 0.5), y * tile_size + (tile_size * 0.5)];
            if (cell.collapsed) {
                ctx.font = '40px "Press Start 2P"';
                render_number(cell.options[0], midpoints[0], midpoints[1]);
            } else {
                ctx.font = '20px "Press Start 2P"';
                let entropy = cell.options;
                entropy.forEach((number) => {
                    let c = (entropy.length == 1) ? 'red' : 'black';
                    ctx.fillStyle = c;
                    let internalY = Math.floor((number - 1) / 3)
                    let entropyY = ((internalY - 1) * entropy_distance) + midpoints[1];
                    let entropyX = ((((number - 1) - (internalY * 3)) - 1) * entropy_distance) + midpoints[0];
                    render_number(number, entropyX, entropyY);
                    ctx.fillStyle = 'black';
                });
            }
            
        }
    }

    // Selected tile
    ctx.lineWidth = 5;
    if (selected_tile != []) ctx.strokeRect(selected_tile[0] * tile_size, selected_tile[1] * tile_size, tile_size, tile_size);
}

function calculate_entropy() {
    // Restore all option values
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!grid[i][j].collapsed) {
                grid[i][j].options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            }
        }
    }

    for (let tileY = 0; tileY < 9; tileY++) {
        for (let tileX = 0; tileX < 9; tileX++) {
            let cell = grid[tileY][tileX];
            if (cell.collapsed) {
                
                // Box
                let box = [Math.floor(tileX / 3), Math.floor(tileY / 3)];
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let current_cell = grid[(box[1] * 3 + i)][(box[0] * 3 + j)];
                        if (!current_cell.collapsed) {
                            current_cell.options = current_cell.options.filter(item => item !== cell.options[0]);
                        }
                    }
                }

                // Verticle lines
                for (let i = 0; i < 9; i++) {
                    if (i == tileY) continue;
                    let current_cell = grid[i][tileX];
                    if (current_cell.collapsed == false) {
                        current_cell.options = current_cell.options.filter(item => item !== cell.options[0]);
                    }
                }

                // Horizontal lines
                for (let i = 0; i < 9; i++) {
                    if (i == tileX) continue;
                    let current_cell = grid[tileY][i];
                    if (current_cell.collapsed == false) {
                        current_cell.options = current_cell.options.filter(item => item !== cell.options[0]);
                    }
                }
            }
        }
    }
}

canvas.addEventListener('click', function(event) {
    event.stopPropagation();
    const mouseX = event.clientX - bounding_box.left;
    const mouseY = event.clientY - bounding_box.top;
    const tileX = Math.floor(mouseX / tile_size);
    const tileY = Math.floor(mouseY / tile_size);
    let cell = grid[tileY][tileX];
    if (!((selected_tile[0] == tileX) && (selected_tile[1] == tileY))) {
        selected_tile = [tileX, tileY];
    } else {
        selected_tile = [];
    }
    render();
});

document.addEventListener('click', function(event) {
    selected_tile = [];
    render();
});

window.addEventListener('keydown', function(event) {
    if (selected_tile.length != 0) {
        if (event.key >= '1' && event.key <= '9') {
            const number_pressed = parseInt(event.key, 10);
            let cell = grid[selected_tile[1]][selected_tile[0]];
            cell.collapsed = true;
            cell.options = [number_pressed];
            calculate_entropy();
            render();
        } else if (event.key === 'Backspace') {
            let cell = grid[selected_tile[1]][selected_tile[0]];
            cell.collapsed = false;
            cell.options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            calculate_entropy();
            render();
        }
    }
});

ui_entropy_button.onclick = function() {
    display_entropy = !display_entropy;
}

save_button.onclick = function() {
    save_game();
}

load_button.onclick = function() {
    load_button();
    calculate_entropy();
}

dropbtn.onclick = function() {
    dropdown.classList.toggle('show');
}

window.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

render();