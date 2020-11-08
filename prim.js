//Create an offscreen canvas. This is where we will actually be drawing,
//in order to keep the image consistent and free of distortions.
let offScreenCVS = document.createElement("canvas");
let offScreenCTX = offScreenCVS.getContext("2d");

//Set the dimensions of the drawing canvas
offScreenCVS.width = 80;
offScreenCVS.height = 80;

let grid = [];

//---------Canvas as Background-----------//

let bg = document.querySelector(".bg"),
  bgCtx = bg.getContext("2d"),
  //sharpen * 4
  bgw = (bg.width = window.innerWidth * 4),
  bgh = (bg.height = window.innerHeight * 4);
bg.style.width = window.innerWidth + "px";
bg.style.height = window.innerHeight + "px";

let xO = bgw * 0.5;
let yO = bgh * -0.7;
let cellSize = 100;
let perspective = 0.7;

//Adjust size on window resize
function setSize() {
    bgw = bg.width = window.innerWidth*4,
    bgh = bg.height = window.innerHeight*4;
    bg.style.width = window.innerWidth + "px";
    bg.style.height = window.innerHeight + "px";

    //center maze
    xO = bgw*0.5;
    yO = bgh*-0.7;
}

function flexCanvasSize() {
    setSize();
    bgCtx.clearRect(0,0,bgw,bgh);
    drawMaze();
}
window.onresize = flexCanvasSize;

//Prim's Algorithm - spanning tree
function generatePrimMaze(e) {
  let cells = [];
  let mazeHeight = 40;
  let mazeWidth = 40;
  //Generate grid template
  for (let y = 0; y < mazeHeight; y++) {
    //Step 1: Initialize empty row
    cells[y] = [];
    // mazeWidth = y+1;
    for (let x = 0; x < mazeWidth; x++) {
      //Step 2: create each cell in this row
      let cell = {
        x: x,
        y: y,
        index: [x, y],
        status: "unvisited",
        adjacents: [],
        connections: []
      };
      cells[y][x] = cell;
      //add to unvisited set
      // unvisited.add(cell);
      //add adjacents
      if (cells[y - 1]) {
        if (cells[y - 1][x]) {
          let up = cells[y - 1][x];
          cell.adjacents.push(up);
          up.adjacents.push(cell);
        }
      }
      if (cells[y][x - 1]) {
        let left = cells[y][x - 1];
        cell.adjacents.push(left);
        left.adjacents.push(cell);
      }
    }
  }
  //initialize empty visited set and frontier set
  let visited = new Set();
  let frontier = new Set();
  //get random index pair as starting point and add it to visited set
  //MAKE EACH ROW A UNIQUE SET TO ALLOW COORDINATE OFFSET?
//   let startY = Math.floor(Math.random() * cells.length);
//   let startX = Math.floor(Math.random() * cells[startY].length);
//   let start = cells[startY][startX];
  let start = cells[20][20]
  //Initialize starting cell as frontier
  frontier.add(start);
  //Set start as current
  let current = start;

  recursiveSpanningTree();
  function recursiveSpanningTree() {
    //remove current from unvisited and add it to visited
    frontier.delete(current);
    visited.add(current);
    current.status = "visited";
    grid[current.y * 2 + 1][current.x * 2 + 1].color = "transparent";

    //add unvisited adjacent cells to frontier
    function addToFrontier(adjCells) {
      for (let c of adjCells) {
        if (c.status === "unvisited") {
          // unvisited.delete(c);
          frontier.add(c);
          c.status = "frontier";
          //make current cell the frontier cell's connection
          c.connections.push(current);
        } else if (c.status === "frontier") {
          c.connections.push(current);
        }
      }
    }
    addToFrontier(current.adjacents);

    //choose random cell from frontier
    let iteratable = [...frontier.values()];
    let randomIndex = Math.floor(Math.random() * iteratable.length);
    let frontierCell = iteratable[randomIndex];

    //open wall between frontier cell and choose its connection
    if (frontierCell) {
      let randomConn = Math.floor(
        Math.random() * frontierCell.connections.length
      );
      let connectX = frontierCell.x + frontierCell.connections[randomConn].x;
      let connectY = frontierCell.y + frontierCell.connections[randomConn].y;
      grid[connectY + 1][connectX + 1].color = "transparent";
    }

    //make the frontier cell the new current
    current = frontierCell;

    bgCtx.clearRect(0, 0, bgw, bgh);
    drawMaze();
    //while there are still unvisited cells, repeat
    if (frontier.size > 0) {
      window.setTimeout(recursiveSpanningTree, 1);
    }
  }
}

function get2DArray() {
  //Make the 2D array to hold all objects
  for (let i = 0; i < offScreenCVS.height + 1; i++) {
    grid[i] = [];
    for (let j = 0; j < offScreenCVS.width + 1; j++) {
      grid[i][j] = {
        color: "#4f71b9",
        cost: 1,
        type: "free",
        x: j,
        y: i,
        gCost: 0,
        hCost: 0,
        fCost: 0
      };
    }
  }
}

get2DArray();
generatePrimMaze();
// get2DArray();

// drawMaze();
function drawMaze() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let xPos = xO + cellSize * (x - y);
      let yPos = yO + perspective * (cellSize * (x + y));
      if (grid[y][x].color === "transparent") {
        continue;
      }
      // draw the cube
      drawCube(
        xPos,
        yPos,
        cellSize,
        cellSize,
        cellSize,
        grid[y][x].color,
        perspective
      );
    }
  }
}

function shadeColor(color, percent) {
  color = color.substr(1);
  var num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

function drawCube(x, y, wx, wy, h, color, per) {
  //left
  bgCtx.beginPath();
  bgCtx.moveTo(x, y);
  bgCtx.lineTo(x - wx, y - wx * per);
  bgCtx.lineTo(x - wx, y - h - wx * per);
  bgCtx.lineTo(x, y - h * 1);
  bgCtx.closePath();
  bgCtx.fillStyle = shadeColor(color, 10);
  bgCtx.strokeStyle = shadeColor(color, 10);
  bgCtx.stroke();
  bgCtx.fill();

  //right
  bgCtx.beginPath();
  bgCtx.moveTo(x, y);
  bgCtx.lineTo(x + wy, y - wy * per);
  bgCtx.lineTo(x + wy, y - h - wy * per);
  bgCtx.lineTo(x, y - h * 1);
  bgCtx.closePath();
  bgCtx.fillStyle = shadeColor(color, -10);
  bgCtx.strokeStyle = shadeColor(color, -10);
  bgCtx.stroke();
  bgCtx.fill();

  //top
  bgCtx.beginPath();
  bgCtx.moveTo(x, y - h);
  bgCtx.lineTo(x - wx, y - h - wx * per);
  bgCtx.lineTo(x - wx + wy, y - h - (wx * per + wy * per));
  bgCtx.lineTo(x + wy, y - h - wy * per);
  bgCtx.closePath();
  bgCtx.fillStyle = shadeColor(color, 20);
  bgCtx.strokeStyle = shadeColor(color, 20);
  bgCtx.stroke();
  bgCtx.fill();
}

//Canvas Events
bg.addEventListener("click", handleCanvasClick);

function handleCanvasClick(e) {
  //Get coordinates on canvas, offset by origin
  let xCanvas = e.offsetX * 4 - xO;
  let yCanvas = e.offsetY * 4 - yO;
  //Get inverse of isometric transformation
  let invX = 0.7 + (yCanvas / perspective + xCanvas) / (2 * cellSize);
  let invY = 0.7 + (yCanvas / perspective - xCanvas) / (2 * cellSize);
  let x = Math.ceil(invX);
  let y = Math.ceil(invY);
  if (grid[y][x].color === "transparent") {
    grid[y][x].color = "#b94f4f";
    bgCtx.clearRect(0, 0, bgw, bgh);
    drawMaze();
  }
}
