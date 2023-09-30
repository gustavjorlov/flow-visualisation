// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Define your game or visualization state
// This might include variables for position, velocity, and other game data
let dots = [
  {
    size: 5,
    speed: { x: 1, y: 0 },
    position: { x: 100, y: 10 },
  },
];

const renderDot = (dot) => {
  ctx.beginPath();
  ctx.arc(dot.position.x, dot.position.y, dot.size, 0, Math.PI * 2);
  // console.log(dot.position);
  ctx.fillStyle = "#ccc"; // Fill color of the circle
  ctx.fill();
  ctx.closePath();
};
// Define a function to update the game state
function update() {
  dots = dots.map((dot) => ({
    ...dot,
    position: {
      x: dot.position.x + dot.speed.x,
      y: dot.position.y + dot.speed.y,
    },
  }));
  // Update your game state here
}
// Define a function to render the visuals
function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.map(renderDot);
  // Draw your game visuals here
}

// Create a main game loop

let lastTimestamp = 0;
function gameLoop(timestamp) {
  // Calculate the time elapsed since the last frame
  const deltaTime = timestamp - lastTimestamp;

  // Limit the frame rate to 60 FPS (16.67 ms per frame)
  if (deltaTime >= 16.67) {
    lastTimestamp = timestamp;
    update(); // Update the game state
    render(); // Render the visuals
  }

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
