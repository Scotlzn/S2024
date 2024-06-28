var display = document.getElementById("display");
var reset_button = document.getElementById("reset_button");

const maxLength = 35; // Max length of text content
var output = "";

// Loop through buttons 1 to 9 and assign click event handlers
for (let i = 1; i <= 9; i++) {
    let button = document.getElementById(i.toString());
    button.onclick = function() {
        if (output.length < maxLength) {
            output += button.textContent;
            display.textContent = output;
        }
    }
}

// Reset button functionality
reset_button.onclick = function() {
    output = "";
    display.textContent = "\u00A0"; // non-breaking space
}