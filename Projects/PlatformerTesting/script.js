canvas = document.getElementById("canvas1");
ctx = canvas.getContext('2d');
ctx.scale(2, 2);

const chunk_width = 3;
const chunk_height = 3;
const tile_size = 16;

class Player {
    constructor(rect) {
        this.x = rect[0];
        this.y = rect[1];
        this.width = rect[2];
        this.height = rect[3];
        this.speed = 100;
    }
}

function generate_chunk() {
    let out = [];
    for (let tiley = 0; tiley < chunk_height; tiley++) {
        for (let tilex = 0; tilex < chunk_width; tilex++) {
            out.push(1);
        }
    }
    return out;
}

function generate_world() {
    let world = {};
    let name = '0;0';
    let chunk = generate_chunk();
    world[name] = chunk;
    name = '1;-1';
    hunk = generate_chunk();
    world[name] = chunk;
    name = '-1;-1';
    hunk = generate_chunk();
    world[name] = chunk;
    name = '0;-2';
    hunk = generate_chunk();
    world[name] = chunk;
    return world;
}

var world = generate_world();
var physics_objects = [];

var player = new Player([0, -250, 16, 16]);
var scroll = [0, 0]

var vertical_momentum = 0
var air_timer = 0

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function render_chunk(x, y) {
    let chunk_name = x + ';' + y;
    let chunk_data = world[chunk_name];
    let chunk_x = (x * chunk_width * tile_size);
    let chunk_y = (y * chunk_height * tile_size);
    for (let index = 0; index < chunk_data.length; index++) {
        let tiley = Math.floor(index / chunk_width);
        let tilex = index - (tiley * chunk_width);
        let worldx = chunk_x + tilex * tile_size;
        let worldy = chunk_y + tiley * tile_size;
        ctx.fillRect(chunk_x, chunk_y, (chunk_width * tile_size), (chunk_height * tile_size));  // Fixes visual bugs
        ctx.fillRect(worldx, worldy, tile_size, tile_size);
        physics_objects.push([worldx, worldy]);
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // let perfect_scroll = [Math.round(scroll[0]), Math.round(scroll[1])]
    // let perfect_scroll = [scroll[0].toFixed(4), scroll[1].toFixed(4)]
    // let perfect_scroll = [Math.floor(scroll[0]), Math.floor(scroll[1])]

    ctx.save();
    ctx.translate(-scroll[0], -scroll[1]);

    // Ground
    physics_objects = [];
    render_chunk(0, 0);
    render_chunk(1, -1);
    render_chunk(-1, -1);
    render_chunk(0, -2);

    // Player
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.restore();
}

function rectangle_collision(a, b) {
    const condition1 = a[0] + a[2] > b[0];
    const condition2 = a[0] < b[0] + b[2];
    const condition3 = a[1] + a[3] > b[1];
    const condition4 = a[1] < b[1] + b[3];
    return condition1 && condition2 && condition3 && condition4;
}

function collision_test(tiles) {
    hit_list = [];
	tiles.forEach((tile) => {
        if (rectangle_collision([player.x, player.y, player.width, player.height], [tile[0], tile[1], tile_size, tile_size])) {
            hit_list.push(tile);
        }
    });
	return hit_list;
}

function move(mx, my) {
    const tiles = physics_objects;
	let collision_types = {'top':false,'bottom':false,'right':false,'left':false};
	player.x += mx;
	let hit_list = collision_test(tiles);
	hit_list.forEach((tile) => {
        if (mx > 0) {
            // rect.right = tile[0].left;
			player.x = tile[0] - player.width;
			collision_types['right'] = true;
        } else if (mx < 0) {
            // rect.left = tile.right
			player.x = tile[0] + tile_size;
			collision_types['left'] = true;
        }
    });
	player.y += my;
	hit_list = self.collision_test(tiles);
	hit_list.forEach((tile) => {
        if (my > 0) {
            // rect.bottom = tile[0].top
            player.y = tile[1] - player.height;
			collision_types['bottom'] = true;
        } else if (my < 0) {
            // rect.top = tile[0].bottom
			player.y = tile[1] + tile_size;
			collision_types['top'] = true;
        }
    });
    return collision_types;
}

window.addEventListener('keydown', function(event) {
    keys[event.code] = true;
});

window.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});

let lastTime = 0;
let keys = {};

function update(deltaTime) {
    let moveX = 0;
    let moveY = 0;

    if (keys['ArrowUp']) {
        if (air_timer < 6) {
            vertical_momentum = -3
        }
    }
    if (keys['ArrowDown']) {
        
    }
    if (keys['ArrowLeft']) {
        moveX -= 1;
    }
    if (keys['ArrowRight']) {
        moveX += 1;
    }

    moveY += vertical_momentum;
	vertical_momentum += 0.1;
	if (vertical_momentum > 3) {
		vertical_momentum = 2;
    }

    moveX += moveX * player.speed * deltaTime;
    moveY += moveY * player.speed * deltaTime;

    let collisions = move(moveX, moveY);

    if (collisions['bottom'] == true) {
        air_timer = 0;
        vertical_momentum = 0;
    }
    if (moveY != 0) {
        air_timer += 1;
    }
    if (collisions['top']) {
        vertical_momentum = 0;
    }

    scroll[0] = lerp(scroll[0], player.x - 240, 0.1);
    scroll[1] = lerp(scroll[1], player.y - 180, 0.1);
}

function gameLoop(timestamp) {
    if (!lastTime) {
        lastTime = timestamp;
    }
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);