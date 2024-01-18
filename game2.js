const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results span');
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

// Create the grid with squares
for (let i = 0; i < 225; i++) {
  const square = document.createElement('div');
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
];

// Draw the initial state of the invaders on the grid
function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if(!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader');
    }
  }
}

draw();

// Remove invaders from the grid
function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader');
  }
}

// Add the shooter to the initial position
squares[currentShooterIndex].classList.add('shooter');

// Move the shooter based on arrow key input
function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter');
  switch(e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -=1;
      break;
    case 'ArrowRight' :
      if (currentShooterIndex % width < width -1) currentShooterIndex +=1;
      break;
  }
  squares[currentShooterIndex].classList.add('shooter');
}
// Listen for arrow key events to move the shooter
document.addEventListener('keydown', moveShooter);

// Move the invaders and handle collisions
function moveInvaders() {
  // Check if invaders are at the grid edges
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1;
  remove();

  // Move invaders based on direction
  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width +1;
      direction = -1;
      goingRight = false;
    }
  }

  if(leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width -1;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  // Redraw the updated grid with invaders
  draw();

  // Check for collision with the shooter
  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultsDisplay.innerHTML = 'GAME OVER';
    clearInterval(invadersId);
    alert('Game Over. Better luck next time!');
    if (confirm('Do you want to try again?')) {
      location.reload(); // Reload the page
    }
  }

  // Check if invaders reach the bottom of the grid
  for (let i = 0; i < alienInvaders.length; i++) {
    if(alienInvaders[i] > (squares.length)) {
      resultsDisplay.innerHTML = 'GAME OVER';
      clearInterval(invadersId);
      alert('WOW! cant even clear this one? what a newbie');
      if (confirm('Do you want to try again?')) {
        location.reload(); // Reload the page
      }
    }
  }
  // Check if all invaders are removed
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = 'YOU WIN';
    clearInterval(invadersId);
    alert('Congratulations! You Win!');
    if (confirm('Do you want to play again?')) {
      location.reload(); // Reload the page
    }
  }
}
// Move invaders at regular intervals
invadersId = setInterval(moveInvaders, 600);

// Shoot laser on arrow up key press
function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;

  // Move the laser up and handle collisions
  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser');
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add('laser');

    // Handle collision with an invader
    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser');
      squares[currentLaserIndex].classList.remove('invader');
      squares[currentLaserIndex].classList.add('boom');

      // Reset the boom effect after a short delay
      setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
      clearInterval(laserId);

      // Update score and track removed invaders
      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results++;
      resultsDisplay.innerHTML = results;
    }
  }

  // Start shooting on arrow up key press
  switch(e.key) {
    case 'ArrowUp':
      laserId = setInterval(moveLaser, 100);
  }
}

// Listen for arrow up key events to shoot
document.addEventListener('keydown', shoot);
