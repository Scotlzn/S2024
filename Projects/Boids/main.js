import { load_assets, degrees_to_radians } from "./support.js";
import Boid from "./boid.js";

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

ctx.imageSmoothingEnabled = false;
ctx.scale(2, 2);

const boids = [];

for (let i = 0; i < 50; i++) {
    boids.push(new Boid());
}

var img;
load_assets(main);

function main(img_data) {
    img = img_data;
    requestAnimationFrame(game_loop);
}

function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillRect(0, 0, width, height);
    boids.forEach((boid) => {
        ctx.save();
        ctx.translate(boid.x + (boid.width * 0.5), boid.y + (boid.height * 0.5));
        ctx.rotate(degrees_to_radians(boid.direction));
        ctx.drawImage(img, -(boid.width * 0.5), -(boid.height * 0.5));
        ctx.restore();
    });
}

const FPS = 60;
const frameTime = 1000 / FPS;
let lastTime = 0;
function game_loop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    let deltaTimeInSeconds = deltaTime / 1000;
    
    boids.forEach((boid) => {
        boid.update(deltaTimeInSeconds, boids);
    });

    render();
    setTimeout(() => {
        requestAnimationFrame(game_loop);
      }, frameTime);
}