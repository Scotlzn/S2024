// get DOM elements
const canvas = document.getElementById("game_of_life");
const bounding_box = canvas.getBoundingClientRect();
var ctx = canvas.getContext('2d');

const next_generation_button = document.getElementById("next_gen_button");
const play_button = document.getElementById("play_button");
const ui_gen = document.getElementById("ui_gen");
const ui_pop = document.getElementById("ui_pop");

const map_width = 64;
const map_height = 32;
const tile_size = 16;

var generation = 0;
var population = 0;

var mouseX = 0; var mouseY = 0;
var mouse_down = false;
var brush = 1;

function generate_map() {
    let o = []; let nl = [];
    for (let y = 0; y < map_height; y++) {
        nl = [];
        for (let x = 0; x < map_width; x++) {
            nl[x] = 0;
        }
        o[y] = nl;
    }
    return o;
}

var current_generation = generate_map();

function check_bounds(x, y) {
    return ((x >= 0) && (x < map_width) && (y >= 0) && (y < map_height));
}

function alive_neighbours(tx, ty) {
    let alive = 0;
    for (let y = ty - 1; y <= ty + 1; y++) {
        for (let x = tx - 1; x <= tx + 1; x++) {
            if (x == tx && y == ty) continue;
            if (!check_bounds(x, y)) continue;
            if (current_generation[y][x]) alive++;
        }
    }
    return alive;
}

function calculate_next_generation() {
    let next_generation = structuredClone(current_generation);
    population = 0;
    for (let y = 0; y < map_height; y++) {
        for (let x = 0; x < map_width; x++) {
            let alive = alive_neighbours(x, y);
            let fate = 0;
            if (current_generation[y][x]) {
                if (alive == 2 || alive == 3) {
                    fate = 1;
                }
            } else if (alive == 3) {
                fate = 1;
            }
            if (fate) population++;
            next_generation[y][x] = fate;
        }
    }
    generation++;
    return next_generation;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Tiles and outlines
    for (let y = 0; y < map_height; y++) {
        for (let x = 0; x < map_width; x++) {
            if (current_generation[y][x]) {
                ctx.fillRect(x*tile_size, y*tile_size, tile_size, tile_size);
            }
            ctx.strokeRect(x*tile_size, y*tile_size, tile_size, tile_size);
        }
    }
}

function get_tile_at_mouse() {
    let a = Math.floor(mouseX / tile_size);
    let b = Math.floor(mouseY / tile_size);
    let c = current_generation[b][a];
    return [c, a, b];
}

function place_tile() {
    let mouse_data = get_tile_at_mouse();
    let tilex = mouse_data[1];
    let tiley = mouse_data[2];
    let tile = mouse_data[0];
    if (tile != brush) {
        current_generation[tiley][tilex] = brush
        // Update UI
        population += (brush == 1) ? 1 : -1;
        ui_pop.textContent = 'Population: ' + population;
    }
    render();
}

function run_next_generation() {
    current_generation = structuredClone(calculate_next_generation());
    // Update canvas
    render();
    // Update UI
    ui_gen.textContent = 'Generation: ' + generation;
    ui_pop.textContent = 'Population: ' + population;
}

function gameloop() {

    if (mouse_down) {
        place_tile();
    }

    requestAnimationFrame(gameloop);
}

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - bounding_box.left;
    mouseY = event.clientY - bounding_box.top;
});

canvas.addEventListener('mousedown', function(event) {
    if (event.button === 0) {
        let tile = get_tile_at_mouse()[0];
        brush = (tile == 0) ? 1 : 0;
        mouse_down = true;
    }
});

canvas.addEventListener('mouseup', function(event) {
    if (event.button === 0) {
        mouse_down = false;
    }
});

next_generation_button.onclick = function() {
    run_next_generation();
}

// Play/Pause

var play = false;
var intervalId = 0;

function playing() {
    run_next_generation();
}

function pause() {
    play_button.textContent = 'Play';
    play = false;
    clearInterval(intervalId);
}

play_button.onclick = function() {
    play = !play;

    if (play) {
        play_button.textContent = 'Pause';
        intervalId = setInterval(playing, 200);
    } else {
        pause();
    }
}

render();
gameloop();