// function hueToRgb(p, q, t) {
//   if (t < 0) t += 1;
//   if (t > 1) t -= 1;
//   if (t < 1/6) return p + (q - p) * 6 * t;
//   if (t < 1/2) return q;
//   if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
//   return p;
// }
// function hslToRgb(h, s, l) {
//   let r, g, b;

//   if (s === 0) {
//     r = g = b = l; // achromatic
//   } else {
//     const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//     const p = 2 * l - q;
//     r = hueToRgb(p, q, h + 1/3);
//     g = hueToRgb(p, q, h);
//     b = hueToRgb(p, q, h - 1/3);
//   }

//   return Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
// }

let scaledHeight, scaledWidth, active, running, ants, values, canvas, steps, instructions, scale;

function updateValues(data) {
  scaledHeight = data.scaledHeight ?? scaledHeight;
  scaledWidth = data.scaledWidth ?? scaledWidth;
  active = data.active ?? active;
  running = data.running ?? running;
  ants = data.ants ?? ants;
  values = data.values ?? values;
  if (data.canvas) {
    canvas = data.canvas.getContext("2d");
    canvas.fillStyle = "#000000";
    canvas.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
  }
  steps = data.steps ?? steps;
  instructions = data.instructions ?? instructions;
  scale = data.scale ?? scale;
}

function relocate(ant) {
  switch(ant.facing) {
    case(0):
      ant.y = (ant.y - 1 + scaledHeight) % scaledHeight;
      break;
    case(1):
      ant.x = (ant.x - 1 + scaledWidth) % scaledWidth;
      break;
    case(2):
      ant.y = (ant.y + 1) % scaledHeight;
      break;
    case(3):
    default:
      ant.x = (ant.x +  1) % scaledWidth;
      break;
  }
  const newDirection = (ant.facing + instructions[values[ant.x][ant.y]]) % 4;
  ant.facing = newDirection;
  return ant;
}

function move(antObj) {
  const { x, y, colors } = antObj;

  canvas.fillStyle = colors[values[x][y]];
  canvas.fillRect(x * scale, y * scale, scale, scale);

  const ant = relocate(antObj);
  values[ant.x][ant.y] = (values[ant.x][ant.y] + 1) % instructions.length;

  canvas.fillStyle = "#FFFFFF";
  canvas.fillRect(ant.x * scale, ant.y * scale, scale, scale);
  return ant;
}

function runLoop() {
  let totalSteps = 0;
  while(running & totalSteps < steps) {
    for (let i = 0; i < ants.length; i++) {
      ants[i] = move(ants[i]);
    }
    totalSteps += 1;
  }
  main();
}

function main() {
  if (running) {
    setTimeout(runLoop, 0);
  }
}

function clear() {
  canvas.fillStyle = "#000000";
  canvas.fillRect(0,0,width,height);
}

self.onmessage = ({ data }) => {
  switch(data.type) {
    case ("clear"):
      clear();
      break;
    case ("data"):
      updateValues(data)
      break;
    case ("start"):
      main();
      break;
    default:
      break;
  }
}