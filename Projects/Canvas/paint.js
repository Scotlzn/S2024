// Functions
var save_data = function(data_input) {
    let data = data_input;
    let jsonString = JSON.stringify(data);
    localStorage.setItem('canvas_data', jsonString);
}

// Paint App
export function paint() {
    // HTML elements
    var c = document.getElementById("Canvas1");
    var reset_button = document.getElementById("reset_button");
    var save_button = document.getElementById("save");
    var load_button = document.getElementById("load");
    var delete_button = document.getElementById("delete_data");
    var brush_slider = document.getElementById("range_slider");

    var ctx = c.getContext("2d");

    var mousedown = false;
    var brush_size = brush_slider.value;

    var dots = []

    // Set stroke style to RGB (255, 0, 0) which is red
    // ctx.strokeStyle = 'rgb(255, 0, 0)';

    // ctx.moveTo(0, 0);
    // ctx.lineTo(200, 100);
    // ctx.stroke();

    c.addEventListener('mousedown', function(event) {
        if (event.button === 0) { // Check if left mouse button is pressed (button 0)
            mousedown = true;
        }
    });

    c.addEventListener('mouseup', function(event) {
        if (event.button === 0) { // Check if left mouse button is released (button 0)
            mousedown = false;
        }
    });

    // Add event listener for mouse movement
    c.addEventListener('mousemove', function(event) {
        if (mousedown) {
            // Get the mouse coordinates relative to the canvas
            var rect = c.getBoundingClientRect();
            var mouseX = event.clientX - rect.left;
            var mouseY = event.clientY - rect.top;

            // ctx.clearRect(0, 0, c.width, c.height); // Clear canvas
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, brush_size, 0, 2 * Math.PI);
            dots.push([mouseX, mouseY, brush_size]);
            ctx.fillStyle = 'blue';
            ctx.fill();
        }
    });

    brush_slider.addEventListener('input', () => {
        brush_size = brush_slider.value;
        // console.log('Slider value:', brush_size); // For debugging
    });

    reset_button.onclick = function() {
        dots = []; // Clear dots
        ctx.clearRect(0, 0, c.width, c.height)
    }

    save_button.onclick = function() {
        save_data(dots);
    }

    load_button.onclick = function() {
        dots = []; // Clear dots
        ctx.clearRect(0, 0, c.width, c.height)
        let storedDataString = localStorage.getItem('canvas_data');
        let loaded_data = JSON.parse(storedDataString);
        dots = loaded_data; // Allows drawing to continue after load
        for (let i = 0; i < loaded_data.length; i++) {
            let dot = loaded_data[i];
            ctx.beginPath();
            ctx.arc(dot[0], dot[1], dot[2], 0, 2 * Math.PI);
            ctx.fillStyle = 'blue';
            ctx.fill();
        }
    }

    delete_button.onclick = function() {
        save_data([]);
    }
}