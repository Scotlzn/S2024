// get DOM elements
const dropdown = document.querySelector('.dropdown');
const dropbtn = dropdown.querySelector('.dropbtn');
const droptxt = dropbtn.querySelector('.droptxt');
const dropdownContent = dropdown.querySelector('.dropdown-content');
var icon = droptxt.querySelector('.fa-caret-down');

dropbtn.onclick = function() {
    dropdown.classList.toggle('show');
}

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});