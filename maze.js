//Create an offscreen canvas. This is where we will actually be drawing, 
//in order to keep the image consistent and free of distortions.
let offScreenCVS = document.createElement('canvas');
let offScreenCTX = offScreenCVS.getContext("2d");

//Set the dimensions of the drawing canvas
offScreenCVS.width = 80;
offScreenCVS.height = 80;

let grid = [];

// Eller's algorithm
function generateEllerMaze() {
    offScreenCTX.fillStyle = "black";
    offScreenCTX.fillRect(0,0,offScreenCVS.width,offScreenCVS.height);
    let imageData = offScreenCTX.getImageData(0,0,offScreenCVS.width,offScreenCVS.height);
    let cells = [];
    //Generate Maze
    for (let y = 0; y < imageData.height; y++) {
        if (y%2 === 0) {
            continue;
        }
        //Step 1: Initialize empty row if it doesn't exist
        let rowSets = {};
        if (!cells[y]) {cells[y] = []};
        for (let x = 0; x < imageData.width; x++) {
            if (x%2 === 0) {
                continue;
            }
            
            if (!cells[y][x]) {
                //Step 2: create each cell in this row if it doesn't exist yet, assign a unique set
                let setID = `${y}${x}`;
                let uniqueSet = new Set()
                let cell = {x: x, y: y, set: setID, connections: {}};
                cells[y][x] = cell;
                //add to set
                uniqueSet.add(cell);
                //add to row sets
                rowSets[setID] = uniqueSet;
            } else {
                //add existing cells to row sets
                let cell = cells[y][x];
                if (rowSets[cell.set]) {
                    rowSets[cell.set].add(cell);
                } else {
                    let uniqueSet = new Set();
                    uniqueSet.add(cell);
                    rowSets[cell.set] = uniqueSet;
                }
            }
        }
        function removeWall() {return Math.random() > 0.5;}
        //Step 3: Create right connections
        cells[y].forEach(c => {
            let rightCell = cells[y][c.x+2];
            //if right cell are in different sets, check remove wall
            if (rightCell) {
                if (c.set !== rightCell.set) {
                    if (removeWall() || y===imageData.height-1) {
                        //open the right path
                        c.connections.right = true;
                        let oldSet = rightCell.set;
                        //merge right cell's set into left cell's set
                        rowSets[oldSet].forEach(rc => {
                            rc.set = c.set;
                            rowSets[c.set].add(rc);
                        })
                        delete rowSets[oldSet];
                    }
                }
            }
        })
        //Step 4: Create down connections
        //only continue if not on last row
        if (y < imageData.height-1) {
            Object.entries(rowSets).forEach(kv => {
                let connects = 0;
                let last;
                let thisSet = kv[1];
                let thisSetID = kv[0];
                //if set only has one entry, create a path down
                thisSet.forEach(c => {
                    //check removeWall or if this is the last row of the maze
                    if (removeWall() || thisSet.size === 1) {
                        //open the down path
                        c.connections.down = true;
                        connects += 1;
                        if (!cells[y+2]) {cells[y+2] = []};
                        let downCell = {x: c.x, y: y+2, set: thisSetID, connections: {}};
                        cells[y+2][c.x] = downCell;
                    }
                    last = c;
                })
                //make sure at least one connects
                if (connects === 0) {
                    //open the down path
                    last.connections.down = true;
                    if (!cells[y+2]) {cells[y+2] = []};
                    let downCell = {x: last.x, y: y+2, set: thisSetID, connections: {}};
                    cells[y+2][last.x] = downCell;
                }
            })
        }
    }
    //draw
    let j = 1;
    function recursiveDrawMaze() {
        cells[j].forEach(c => {
            if (c) {
                offScreenCTX.clearRect(c.x,c.y,1,1);
                if (c.connections.right) {
                    offScreenCTX.clearRect(c.x+1,c.y,1,1);
                }
                if (c.connections.down) {
                    offScreenCTX.clearRect(c.x,c.y+1,1,1);
                }
            }
        })
        j+=2;
        if (j < cells.length) {
            recursiveDrawMaze();
        }
    }
    recursiveDrawMaze();
}

function get2DArray() {
      //Make the 2D array to hold all objects
    for (let i=0; i<offScreenCVS.height+1; i++) {
        grid[i] = [];
        for (let j=0; j<offScreenCVS.width+1; j++) {
            grid[i][j] = {color: "#4f71b9", cost: 1, type: "free", x: j, y: i, gCost: 0, hCost: 0, fCost: 0}
        }
    }
    let imageData = offScreenCTX.getImageData(0,0,offScreenCVS.width,offScreenCVS.height);
    for (let i=0; i<imageData.data.length; i+=4) {
        let x = i/4%offScreenCVS.width, y = (i/4-x)/offScreenCVS.width;
        let color = `rgba(${imageData.data[i]}, ${imageData.data[i+1]}, ${imageData.data[i+2]}, ${imageData.data[i+3]})`
        switch(color) {
          case "rgba(0, 0, 0, 255)":
            //black pixel
            grid[y][x].color = "#4f71b9";
            break;
          default: 
            //transparent pixel
            grid[y][x].color = "transparent";
        }
    }
}

generateEllerMaze();
get2DArray();