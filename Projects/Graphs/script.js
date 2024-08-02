const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const origin = [width * 0.5, height * 0.5];
const pixels_between_numbers = 50;
const visual_lines = 6; // it's actually 2n + 2 so 14
const origin_lock = true;
const origin_lock_position = 10; // In pixels from the left of the viewport

var mouse_down = false;
var scroll = [0, 0];

var last_mouse_position = [0, 0];

ctx.font = '20px "Press Start 2P"';
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
    ctx.strokeStyle = 'black';

    let YaxisX = origin[0] + scroll[0];
    let XaxisY = origin[1] + scroll[1];

    if (origin_lock) {
        const lockMinX = origin_lock_position;
        const lockMaxX = width - origin_lock_position;
        const lockMinY = origin_lock_position;
        const lockMaxY = height - origin_lock_position;

        YaxisX = Math.max(lockMinX, Math.min(YaxisX, lockMaxX));
        XaxisY = Math.max(lockMinY, Math.min(XaxisY, lockMaxY));
    }

    const offset_x = Math.floor(scroll[0] / pixels_between_numbers);
    const offset_y = Math.floor(scroll[1] / pixels_between_numbers);
    const start_x = -visual_lines + offset_x + 1;
    const end_x = visual_lines + offset_x;
    const start_y = -visual_lines + offset_y + 1;
    const end_y = visual_lines + offset_y;
    const visualNumberRange = visual_lines + 1; // Adjusted to include -1 offset

    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let i = start_x; i <= end_x; i++) {
        const x = origin[0] - (i * pixels_between_numbers) + scroll[0];
        ctx.lineWidth = (i === 0) ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let i = start_y; i <= end_y; i++) {
        const y = origin[1] - (i * pixels_between_numbers) + scroll[1];
        ctx.lineWidth = (i === 0) ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Draw numbers on Y-axis
    for (let i = -visualNumberRange - offset_y; i <= visualNumberRange - offset_y; i++) {
        if (i === 0 && scroll[0] < -300) continue;
        const position = (i === 0) ? origin[0] + scroll[0] : YaxisX;
        render_number(-i, position, origin[1] + (i * pixels_between_numbers) + scroll[1]);
    }

    // Draw numbers on X-axis
    for (let i = -visualNumberRange - offset_x; i <= visualNumberRange - offset_x; i++) {
        if (i === 0) continue;
        render_number(i, origin[0] + (i * pixels_between_numbers) + scroll[0], XaxisY);
    }
}

canvas.addEventListener('mousemove', function(event) {
    if (mouse_down) {
        const deltaX = event.clientX - last_mouse_position[0];
        const deltaY = event.clientY - last_mouse_position[1];
        scroll[0] += deltaX;
        scroll[1] += deltaY;
        render();
        last_mouse_position[0] = event.clientX;
        last_mouse_position[1] = event.clientY;
    }
});

canvas.addEventListener('mousedown', function(event) {
    if (event.button === 2) { 
        mouse_down = true;
        last_mouse_position = [event.clientX, event.clientY];
    }
});

canvas.addEventListener('mouseup', function(event) {
    if (event.button === 2) { 
        mouse_down = false;
    }
});

canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

render();