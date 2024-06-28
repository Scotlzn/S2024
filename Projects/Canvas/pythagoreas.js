export function pythagoreas() {

    // DOM elements
    var canvas = document.getElementById("Canvas2");
    var x_output = document.getElementById("triangle_x");
    var y_output = document.getElementById("triangle_y");
    var h_output = document.getElementById("triangle_h");

    const width = canvas.width;
    const height = canvas.height;
    const midpoint = [width / 2, height / 2]

    var ctx = canvas.getContext("2d");

    // Set stroke style to RGB (255, 0, 0) which is red
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 5;

    function drawline(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function update_math(mouseX, mouseY) {
        // Math
        let x = Math.abs(mouseX - midpoint[0]);
        let y = Math.abs(mouseY - midpoint[1]);
        let h = Math.sqrt(x * x + y * y).toFixed(2)

        // Update text
        x_output.textContent = 'X: ' + x + 'px';
        y_output.textContent = 'Y: ' + y + 'px';
        h_output.textContent = 'H: ' + h + 'px';
    }

    canvas.addEventListener('mousemove', function(event) {
        let rect = canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;

        update_math(mouseX, mouseY);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawline(ctx, midpoint[0], midpoint[1], mouseX, mouseY);
        drawline(ctx, mouseX, midpoint[1], mouseX, mouseY);
        drawline(ctx, mouseX, midpoint[1], midpoint[0], midpoint[1]);
    });

}