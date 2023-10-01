const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
var simplex = new SimplexNoise();

const dotDistance = 2;
const arrowLength = 10;
const numberOfParticles = 1400;
const particleRadius = 2;
const particleSpeed = 2;
const particleOpacity = 0.01;
const showArrows = false;

const dotLength = (canvas.width / dotDistance) * (canvas.height / dotDistance);
let highlightedDotIndex = 0;
let dots = [];
for (let j = 0; j < canvas.height / dotDistance; j++) {
  for (let i = 0; i < canvas.width / dotDistance; i++) {
    const angle = Math.round(360 * simplex.noise(i / 25, j / 25));
    dots.push({
      radius: 1 + 10 * Math.abs(simplex.noise(i / 25, j / 25)),
      position: { x: i * dotDistance, y: j * dotDistance },
      color: `hsl(${angle}deg, 50%, 50%)`,
      speed: 0,
      angle,
    });
  }
}

let particles = Array(numberOfParticles)
  .fill(0)
  .map((_, i) => ({
    position: {
      x: Math.round(canvas.width * Math.random()),
      y: Math.round(canvas.height * Math.random()),
    },
    color: `rgba(1,1,1,${particleOpacity})`,
    radius: particleRadius,
    speed: 1,
    angle: 360 * Math.random(),
  }));

let mouseDot = {
  radius: 5,
  speed: { value: 0, direction: { x: 0, y: 0 } },
  position: { x: -10, y: -10 },
  color: "#192388",
};
canvas.addEventListener("mousemove", (e) => {
  mouseDot.position = { x: e.offsetX, y: e.offsetY };
  highlightedDotIndex =
    Math.round(mouseDot.position.y / dotDistance) *
      Math.round(canvas.width / dotDistance) +
    Math.round(mouseDot.position.x / dotDistance);
});
canvas.addEventListener("click", () => {
  mouseDot.radius = 20;
  // for (let i = 0; i <= dots.length; i++) {
  //   dots[i].speed = {
  //     value:
  //       mouseDot.position.x -
  //       dots[i].position.x +
  //       mouseDot.position.y -
  //       dots[i].position.y,
  //     direction: { x: 0, y: 0 },
  // x: dots[i].speed.x + 1 / (mouseDot.position.x - dots[i].position.x),
  // y: dots[i].speed.y + 1 / (mouseDot.position.y - dots[i].position.y),
  // };
  // }
});

const renderArrow = (arrowLength) => (dot, index) => {
  ctx.beginPath();

  const deltaX = Math.cos((dot.angle * Math.PI) / 180) * arrowLength;
  const deltaY = Math.sin((dot.angle * Math.PI) / 180) * arrowLength;
  ctx.moveTo(dot.position.x, dot.position.y);
  ctx.lineTo(dot.position.x + deltaX, dot.position.y + deltaY);
  ctx.lineWidth = highlightedDotIndex === index ? 4 : 1.2;
  ctx.strokeStyle = dot.color;
  ctx.stroke();
  renderDot({
    radius: highlightedDotIndex === index ? 14 : 2,
    position: { x: dot.position.x, y: dot.position.y },
    color: dot.color,
  });
};

const renderDot = (dot) => {
  ctx.beginPath();
  ctx.arc(dot.position.x, dot.position.y, dot.radius, 0, Math.PI * 2);
  ctx.fillStyle = dot.color || "#ccc";
  ctx.fill();
  ctx.closePath();
};

let lookupDotIndex = 0;

const updateParticlesBySpeed = (_particles) => {
  for (let i = 0; i < _particles.length; i++) {
    // given particle's position, what's the closest direction
    lookupDotIndex =
      Math.round(_particles[i].position.y / dotDistance) *
        Math.round(canvas.width / dotDistance) +
      Math.round(_particles[i].position.x / dotDistance);

    if (dots[lookupDotIndex]) {
      // console.log(_particles[i].angle, dots[lookupDotIndex].angle);
      _particles[i].angle =
        (dots[lookupDotIndex].angle + 4 * _particles[i].angle) / 5;
      _particles[i].position.x +=
        particleSpeed * Math.cos((_particles[i].angle * Math.PI) / 180);
      _particles[i].position.y +=
        particleSpeed * Math.sin((_particles[i].angle * Math.PI) / 180);
    }
  }
};

function update() {
  updateParticlesBySpeed(particles);
  if (mouseDot.radius > 5) mouseDot.radius += -1;
}

function render() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.map(renderDot);
  if (showArrows) dots.map(renderArrow(arrowLength));
  // renderDot(mouseDot);
}

let lastTimestamp = 0;
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTimestamp;

  if (deltaTime >= 16.67) {
    lastTimestamp = timestamp;
    update();
    render();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
