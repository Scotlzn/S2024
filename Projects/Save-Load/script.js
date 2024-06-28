// get DOM elements
var input = document.getElementById('input');
var display = document.getElementById('display');
var save_button = document.getElementById('save');
var load_button = document.getElementById('load');
var clear_button = document.getElementById('clear');

save_data = function(data_input) {
    let data = [data_input];
    let jsonString = JSON.stringify(data);
    localStorage.setItem('data1', jsonString);
}

save_button.onclick = function() {
    save_data(input.value);
}

load_button.onclick = function() {
    let storedDataString = localStorage.getItem('data1');
    let storedData = JSON.parse(storedDataString);
    display.textContent = storedData[0];
}

clear_button.onclick = function() {
    save_data("");
}