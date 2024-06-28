// get DOM elements
var text_input = document.getElementById("text_input");
var submit_button = document.getElementById("submit_button");
var button_container = document.getElementById("button_container");

var buttons = 0;

submit_button.onclick = function() {
    // Create element
    let new_element = document.createElement('button');

    // Text
    let name = text_input.value;
    if (name.length >= 1) {
        new_element.textContent = name;
    } else {
        new_element.textContent = 'Button created by code!';
    }

    // Add a data to the new element
    new_element.id = 'artificial_' + buttons;
    new_element.classList.add('artificial_buttons');

    // Add functionality to the new element
    new_element.onclick = function() {
        button_container.removeChild(new_element);
    }

    // Add button to HTML
    buttons++;
    button_container.appendChild(new_element);
}

var todo_submit_button = document.getElementById("todo_submit_button");
var todo_input = document.getElementById("todo_input");
var todo_container = document.getElementById("todo_container");

var tasks = [];

function save_data(data_input) {
    let data = data_input;
    let jsonString = JSON.stringify(data);
    localStorage.setItem('todo_data', jsonString);
}

function load_data() {
    let storedDataString = localStorage.getItem('todo_data');
    let storedData = JSON.parse(storedDataString);
    return storedData;
}

function create_task(text_data) {
    // Create element
    let new_element = document.createElement('li');

    // Text
    new_element.textContent = text_data;

    // Add button to HTML
    todo_container.appendChild(new_element);

    // Reset text input
    todo_input.value = '';
} 

todo_submit_button.onclick = function() {
    let text = todo_input.value;
    if (text.length >= 1) {
        create_task(text);
        tasks.push(text);
        save_data(tasks);
    }
}

function load_tasks() {
    let data = load_data();
    tasks = data;
    data.forEach((task, index) => {
        create_task(task);
    });
}

// Element functionality
// Add event listener to the parent element (todo_container)
todo_container.addEventListener('click', function(event) {
    if (event.target && event.target.nodeName === 'LI') {
        // REMOVE ELEMENT
        let element = event.target;
        let index = [...todo_container.children].indexOf(element);
        todo_container.removeChild(element);
        tasks.splice(index, 1);
        save_data(tasks);
    }
});

load_tasks();