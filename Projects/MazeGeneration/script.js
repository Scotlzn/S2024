// Future me, the code is bad, i know, but atleast it works :D
// get DOM elements
var canvas = document.getElementById("Canvas1");
var step_button = document.getElementById("step_button");
var circle_button = document.getElementById("db_circles_button");
var complete_button = document.getElementById("complete_button");
var play_button = document.getElementById("play_button");
var clear_button = document.getElementById("clear_button");
var outline_button = document.getElementById("outline_button");
var path_button = document.getElementById("path_button");

// Constants
const width = canvas.width;
const height = canvas.height;
const grid_size = 16;
const tile_size = width / grid_size;
const half_tile_size = tile_size / 2;
const directions = [[0, -1], [-1, 0], [1, 0], [0, 1]];

var ctx = canvas.getContext('2d');

class Maze {

    constructor() {
        const start = [0, 15];

        this.current_position = start;
        this.prev_position = start;
        this.map = this.generate_map();
        this.visual_path = [];
        this.path = [];
        this.walls = [];

        this.backwards = false;
        this.found_exit = false;

        this.toggle_walls = true;
        this.toggle_path = true;
        this.toggle_circles = false;

        this.map[start[1]][start[0]] = 1;
        this.path.push([start[0], start[1]]);
        this.visual_path.push([[start[0], start[1]], []]);
    }

    getRandomIntInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
      
    findArrayIndex(arr, target) {
        return arr.findIndex(subArray => this.arraysEqual(subArray, target));
    }

    drawcircle(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x * tile_size + half_tile_size, y * tile_size + half_tile_size, radius, 0, Math.PI * 2, true); // Full circle
        ctx.fillStyle = (x == this.current_position[0] && y == this.current_position[1]) ? 'red' : 'blue';
        ctx.fill();
        ctx.closePath();
    }

    drawline(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    generate_map() {
        let out = [];
        for (let y = 0; y < grid_size; y++) {
            let nl = [];
            for (let x = 0; x < grid_size; x++) {
                nl.push(0);
            }
            out.push(nl);
        }
        return out;
    }

    render() {
        ctx.clearRect(0, 0, width, height);

        this.render_path();
        
        for (let y = 0; y < grid_size; y++) {
            for (let x = 0; x < grid_size; x++) {
                ctx.strokeRect(x*tile_size, y*tile_size, tile_size, tile_size);
            }
        }
    }

    render_path() {
        // Debug circles
        if (this.toggle_circles) {
            this.visual_path.forEach((data, index) => {
                let tile = data[0];
                this.drawcircle(tile[0], tile[1], 10);
            }); 
        }
        // Path
        if (this.toggle_path) {
            this.visual_path.forEach((data, index) => {
                if (index != 0) {
                    let tile = data[0];
                    let prev = data[1];
                    ctx.strokeStyle = 'rgb(255, 0, 0)';
                    ctx.lineWidth = 5;
                    this.drawline(prev[0] * tile_size + half_tile_size, prev[1] * tile_size + half_tile_size, tile[0] * tile_size + half_tile_size, tile[1] * tile_size + half_tile_size);
                    // Reseting stuff so black lines dont mess up
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'black';
                }
            });
        }
        // Walls
        if (this.toggle_walls) {
            this.walls.forEach((data, index) => {
                ctx.strokeStyle = 'rgb(0, 0, 255)';
                ctx.lineWidth = 5;
                if (data[2] == 0) {
                    this.drawline(data[0] * tile_size, data[1] * tile_size, (data[0] + 1) * tile_size,  data[1] * tile_size);
                } else {
                    this.drawline((data[0] + 1) * tile_size,  data[1] * tile_size, (data[0] + 1) * tile_size,  (data[1] + 1) * tile_size);
                }
                // Reseting stuff so black lines dont mess up
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
            });
        }
    }

    check_neighbours(position) {
        let valid_neighbours = [];
        for (let i = 0; i < directions.length; i++) {
            let direction = directions[i];
            let x = position[0] + direction[0];
            let y = position[1] + direction[1];

            // Check bounds
            if ((x < 0) || (x >= grid_size)) {
                continue;
            }
            if ((y < 0) || (y >= grid_size)) {
                continue;
            }

            if (this.map[y][x] == 0) {
                valid_neighbours.push(direction);
            }
        }
        return valid_neighbours;
    }

    move(direction) {

        this.prev_position = [this.current_position[0], this.current_position[1]];
        this.current_position[0] += direction[0];
        this.current_position[1] += direction[1];

        this.map[this.current_position[1]][this.current_position[0]] = 1;
        this.path.push([this.current_position[0], this.current_position[1]]); // Avoids bugs
        this.visual_path.push([[this.current_position[0], this.current_position[1]], [this.prev_position[0], this.prev_position[1]]]);

        this.render();
    }

    forward_step() {
        let valid_neighbours = this.check_neighbours(this.current_position);
        let new_direction = this.getRandomIntInRange(0, valid_neighbours.length - 1);
        new_direction = valid_neighbours[new_direction];

        // When no neighbours are found, initiate backwards movement
        if (valid_neighbours.length < 1) {
            this.backwards = true;
            // Remove last element because we know it has no valid neighbours
            this.path.pop();
            this.backward_step(); // No idea why but it works
            return;
        }
        
        // Walls
        if (valid_neighbours.length > 1) {
            valid_neighbours.forEach((data, index) => {
                if (!(data[0] == new_direction[0] && data[1] == new_direction[1])) {
                    let rotation = (data[0] == 0) ? 0 : 1 // 1=verticle 0=horizontal
                    let v_trans = (rotation == 1 && data[0] == -1) ? 1 : 0
                    let h_trans = (rotation == 0 && data[1] == 1) ? 1 : 0
                    this.walls.push([this.current_position[0] + (-1 * v_trans), this.current_position[1] + (1 * h_trans), rotation]);
                }
            });
        }

        this.move(new_direction);
    }

    exit() {  // Exit backwards cycle
        let valid_neighbours = this.check_neighbours(this.current_position);
        let new_direction = this.getRandomIntInRange(0, valid_neighbours.length - 1);
        new_direction = valid_neighbours[new_direction];

        // Remove walls
        let rotation = (new_direction[0] == 0) ? 0 : 1 // 1=verticle 0=horizontal
        let v_trans = (rotation == 1 && new_direction[0] == -1) ? 1 : 0
        let h_trans = (rotation == 0 && new_direction[1] == 1) ? 1 : 0
        let index = this.findArrayIndex(this.walls, [this.current_position[0] + (-1 * v_trans), this.current_position[1] + (1 * h_trans), rotation])
        if (index > -1) {  // Finds index in array and removes it
            this.walls.splice(index, 1);
        }

        this.move(new_direction);
        this.found_exit = false;
        this.backwards = false;
    }

    backward_step() {

        if (this.found_exit) {
            this.exit();
            return;
        }

        // .at(-1) means the last element in array
        this.current_position[0] = this.path.at(-1)[0];
        this.current_position[1] = this.path.at(-1)[1];

        this.render();

        // CHECK NEIGHBOURS
        let valid_neighbours = this.check_neighbours(this.current_position);
        if (valid_neighbours.length < 1) {
            this.path.pop();
            return;
        }

        this.found_exit = true;
    }

    step() {
        if (this.path.length < 1) return; // Won't run if every tile has been checked
        !this.backwards ? this.forward_step() : this.backward_step();
    }
}

var maze = new Maze();
maze.render();

// BUTTONS
step_button.onclick = function() {
    maze.step();
}

complete_button.onclick = function() {
    while (maze.path.length != 0) {
        maze.step();
    }
}

circle_button.onclick = function() {
    maze.toggle_circles = !maze.toggle_circles;
    maze.render();
}

outline_button.onclick = function() {
    maze.toggle_walls = !maze.toggle_walls;
    maze.render();
}

path_button.onclick = function() {
    maze.toggle_path = !maze.toggle_path;
    maze.render();
}

// PLAY/PAUSE BUTTON

var play = false;
var intervalId = 0;

clear_button.onclick = function() {
    pause();
    maze = new Maze();
    maze.render();
}

function playing() {
    if (maze.path.length == 0) {
        pause();
        return
    }
    maze.step();
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
        intervalId = setInterval(playing, 50);
    } else {
        pause();
    }
}