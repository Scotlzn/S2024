// get DOM elements
var range_input = document.getElementById('range_input');
var output_text = document.getElementById('output_text');
var start_button = document.getElementById('start_button');

var higher_button = document.getElementById('higher');
var lower_button = document.getElementById('lower');
var correct_button = document.getElementById('correct');

// Elements to show on start
var game_container = document.getElementById('game_container');
var guess_line = document.getElementById('guess_horizontal-line');

var min;
var max;
var mid;

var guesses = 1;

function update_display() {
    mid = Math.floor((max + min) * 0.5);
    output_text.textContent = formatNumberWithCommas(mid);
}

function formatNumberWithCommas(number) {
    return number.toLocaleString();
}

start_button.onclick = function() {
    min = 0;
    max = Number(range_input.value);
    game_container.style.display = 'flex';
    guess_line.style.display = 'block';
    start_button.textContent = 'Reset Game';
    update_display();
}

higher_button.onclick = function() {
    min = mid;
    guesses++;
    update_display();
}

lower_button.onclick = function() {
    max = mid;
    guesses++;
    update_display();
}

correct_button.onclick = function() {
    output_text.textContent = 'I got it in ' + guesses + '!';
}