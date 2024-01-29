const map = document.getElementById('map');
const SnakeTime = 200;
let score= 0;
let bestScore = localStorage.getItem('Bestscore') || 0;
document.getElementById('Bestscore').innerText = 'Best Score: ' + bestScore;