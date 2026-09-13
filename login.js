const form = document.getElementById('loginform');
form.addEventListener('submit', function(event) {
event.preventDefault();
const clickedButton = event.submitter;
let role = clickedButton.getAttribute('data-role') || 'encargado';
localStorage.setItem('userrole', role);
window.location.href='main.html';})
