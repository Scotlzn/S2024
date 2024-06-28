const canvas = document.getElementById("c2D_plane");
const canvas2 = document.getElementById("c3D_plane");
const fpsDisplay = document.getElementById('fps_display');

var ctx = canvas.getContext('2d');
var ctx2 = canvas2.getContext('2d');

const fpsUpdateInterval = 1000;
var lastFrameTime = performance.now();
var frameCount = 0;
var fps = 0;
var lastFpsUpdate = performance.now();

const map_size = 16;
const tile_size = 32;

const FOV = 60;
const RES = 8;
const scan_lines = 480 / RES;

const player_size = 8;
const hitbox_size = 4
const player_speed = 0.4;
const turning_speed = 0.8;
const strafing_speed = 0.4;

const ray_size = 2;
const ray_speed = 2;

var player_x = 32;
var player_y = 32;
var player_rotation = 0;
var hitbox = [player_x + (player_size * 0.5) - (hitbox_size * 0.5) , player_y + (player_size * 0.5) - (hitbox_size * 0.5), hitbox_size, hitbox_size];

var ray_rotation = 0;
var ray_x = 0
var rays = [];

const map = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1], [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1], [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1], [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1], [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

ctx2.scale(2, 2);

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

function rectangle_collision(a, b) {
    const condition1 = a[0] + a[2] > b[0];
    const condition2 = a[0] < b[0] + b[2];
    const condition3 = a[1] + a[3] > b[1];
    const condition4 = a[1] < b[1] + b[3];
    return condition1 && condition2 && condition3 && condition4;
}

function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function adjustBrightness(rgb, factor) {
    // Extract the RGB components
    const rgbValues = rgb.match(/\d+/g);
    let [r, g, b] = rgbValues.map(Number);

    // Adjust each component by the factor and clamp the values between 0 and 255
    r = Math.min(255, Math.max(0, Math.round(r * factor)));
    g = Math.min(255, Math.max(0, Math.round(g * factor)));
    b = Math.min(255, Math.max(0, Math.round(b * factor)));

    // Return the adjusted color in RGB format
    return `rgb(${r}, ${g}, ${b})`;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    // Tiles
    ctx.fillStyle = 'black';
    for (let y = 0; y < map_size; y++) {
        for (let x = 0; x < map_size; x++) {
            let tile = map[y][x]
            if (tile == 1) {
                ctx.fillRect(x * tile_size, y * tile_size, tile_size, tile_size);
            }
        }
    }

    render_player();

    // Rays
    ray_x = 0;
    ray_rotation = player_rotation;
    ctx.strokeStyle = 'rgb(255, 87, 51)';
    for (let i = 0; i < rays.length; i++) {
        // 3D
        _3D_render(i);

        // 2D
        ctx.beginPath();
        ctx.moveTo(player_x + player_size * 0.5, player_y + player_size * 0.5);
        ctx.lineTo(rays[i][0] + (ray_size * 0.5), rays[i][1] + (ray_size * 0.5));
        ctx.stroke();
    }
}

function render_player() {
    // Style
    ctx.fillStyle = 'lime';
    ctx.translate(player_x + player_size * 0.5, player_y + player_size * 0.5);
    ctx.rotate(degreesToRadians(player_rotation));
    ctx.fillRect(-player_size * 0.5, -player_size * 0.5, player_size, player_size);

    // Arrow
    ctx.strokeStyle = 'black';
    ctx.beginPath(); // Base
    ctx.moveTo(-player_size*0.5, 0);
    ctx.lineTo(player_size*0.5, 0);
    ctx.moveTo(player_size*0.5, 0); // Left line
    ctx.lineTo(0, -player_size*0.5);
    ctx.moveTo(player_size*0.5, 0); // Right line
    ctx.lineTo(0, player_size*0.5);
    ctx.lineWidth = 2;
    ctx.stroke();

    // Restore everything
    ctx.restore();
    ctx.rotate(degreesToRadians(-player_rotation));
    ctx.translate(-(player_x + player_size * 0.5), -(player_y + player_size * 0.5));
}

function _3D_render(index) {
    // calculate distance, height, brightness and fix fisheye lens effect
    let distance = calculateDistance(rays[index][0] + (ray_size * 0.5), rays[index][1] + (ray_size * 0.5), player_x, player_y);
    distance = (distance * Math.cos(degreesToRadians(player_rotation - ray_rotation)));
    let height = (4000 / distance);
    let brightness_change = (1 - (distance * 0.0035));

    // Render the line
    ctx2.strokeStyle = adjustBrightness('rgb(123, 182, 231)', brightness_change);
    ctx2.lineWidth = RES;
    ctx2.beginPath();
    ctx2.moveTo(ray_x, 180 - height);
    ctx2.lineTo(ray_x, 180 + height);
    ctx2.stroke();

    // Move x for next line
    ray_x += RES;
}

function single_ray(index) {
    // Find out direction and separate into x and y
    rays[index] = [player_x + player_size * 0.5 - 2, player_y + player_size * 0.5 - 2, player_rotation];
    let sin = Math.sin(degreesToRadians(player_rotation.toFixed(0)));
    let cos = Math.cos(degreesToRadians(player_rotation.toFixed(0)));
    let dx = cos.toFixed(2);
    let dy = sin.toFixed(2);

    // IN
    let stopped = false;
    while (!stopped) {
        for (let y = 0; y < map_size; y++) {
            for (let x = 0; x < map_size; x++) {
                if (map[y][x] == 1) {
                    if (rectangle_collision([rays[index][0], rays[index][1], ray_size, ray_size], [x * tile_size, y * tile_size, tile_size, tile_size])) {
                        stopped = true;
                    }
                }
            }
        }
        rays[index][0] += dx * ray_speed;
        rays[index][1] += dy * ray_speed;
    }

    // OUT
    stopped = false;
    while (stopped == false) {
        for (let y = 0; y < map_size; y++) {
            for (let x = 0; x < map_size; x++) {
                if (map[y][x] == 1) {
                    if (rectangle_collision([rays[index][0], rays[index][1], ray_size, ray_size], [x * tile_size, y * tile_size, tile_size, tile_size])) {   
                        stopped = true;
                    }
                }
            }
        }
    if (stopped == true) {
        rays[index][0] -= dx;
        rays[index][1] -= dy;
        stopped = false;
    } else break;
    }
}

function raycast() {
    player_rotation -= FOV * 0.5;
    for (let i = 0; i < scan_lines; i++) {
        single_ray(i);
        player_rotation += (FOV / scan_lines);
    }
    player_rotation -= FOV * 0.5;
}

function check_collisions(dx, dy) {
    player_x += dx;
    player_y += dy;
    hitbox = [player_x + (player_size * 0.5) - (hitbox_size * 0.5) , player_y + (player_size * 0.5) - (hitbox_size * 0.5), hitbox_size, hitbox_size];
    for (let y = 0; y < map_size; y++) {
        for (let x = 0; x < map_size; x++) {
            if (map[y][x] == 1) {
                if (rectangle_collision([hitbox[0], hitbox[1], hitbox_size, hitbox_size], [x * tile_size, y * tile_size, tile_size, tile_size])) {
                    player_x -= dx;
                    player_y -= dy;
                }
            }
        }
    }
}

function move_player(speed, direction) {
    let sin = Math.sin(degreesToRadians(player_rotation));
    let cos = Math.cos(degreesToRadians(player_rotation));
    check_collisions(cos.toFixed(2) * speed * direction, 0);
    check_collisions(0, sin.toFixed(2) * speed * direction);
}

// Object to track pressed keys
const pressedKeys = {};

function event_loop(event) {
    // Framerate stuff
    const elapsed = event - lastFrameTime;
    lastFrameTime = event;
    frameCount++;
    if (event - lastFpsUpdate >= fpsUpdateInterval) {
        fps = frameCount;
        frameCount = 0;
        lastFpsUpdate = event;
        fpsDisplay.textContent = `FPS: ${fps}`;
    }

    if (pressedKeys['ArrowUp']) {
        move_player(player_speed, 1);
    }
    if (pressedKeys['ArrowDown']) {
        move_player(player_speed, -1);
    }
    if (pressedKeys['ArrowLeft']) {
        player_rotation -= turning_speed;
    }
    if (pressedKeys['ArrowRight']) {
        player_rotation += turning_speed;
    }
    if (pressedKeys['a']) {
        player_rotation -= 90;
        move_player(strafing_speed, 1);
        player_rotation += 90;
    }
    if (pressedKeys['d']) {
        player_rotation += 90;
        move_player(strafing_speed, 1);
        player_rotation -= 90;
    }
    if (pressedKeys[' ']) {
        player_x = 32;
        player_y = 32;
        player_rotation = 0;
        hitbox = [player_x + (player_size * 0.5) - (hitbox_size * 0.5) , player_y + (player_size * 0.5) - (hitbox_size * 0.5), hitbox_size, hitbox_size];
    }

    raycast();
    render();
    requestAnimationFrame(event_loop);
}

document.addEventListener('keydown', function(event) {
    pressedKeys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    pressedKeys[event.key] = false;
});

// Run event loop
event_loop();