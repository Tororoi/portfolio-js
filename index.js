//---------Canvas as Background-----------//

let bg = document.querySelector(".bg"),       
    bgCtx = bg.getContext('2d'),
    //sharpen * 4
    bgw = bg.width = window.innerWidth*4,
    bgh = bg.height = window.innerHeight*4;
    bg.style.width = window.innerWidth + "px";
    bg.style.height = window.innerHeight + "px";

// bgCtx.imageSmoothingEnabled = false;
// bgCtx.drawImage(offScreenCVS,0,0, 1000, 1000)
//draw bg
// bgCtx.fillStyle = "#282c34"
// bgCtx.fillRect(0,0,bgw,bgh)
// let xCoord = bgw*0.5;
// let yCoord = bgh*-0.7;
let cellSize = 100;
// let perspective = 0.7;
drawMaze();
function drawMaze() {
    let xCoord = bgw*0.5;
    let yCoord = bgh*-0.7;
    let perspective = 0.7;
    for (let y=0; y<grid.length; y++) {
        if (y>0) {
            xCoord -= (grid.length * cellSize) + cellSize;
            yCoord -= (grid.length * cellSize*perspective) - cellSize*perspective;
        }
        for (let x=0; x<grid[y].length; x++) {
            yCoord += cellSize*perspective;
            xCoord += cellSize; 
            if (grid[y][x].color === "transparent") {continue;}
            // draw the cube
            drawCube(
                xCoord,
                yCoord,
                cellSize,
                cellSize,
                cellSize,
                grid[y][x].color,
                perspective
            );
        }
    }
    // document.body.style.background = 'url(' + bg.toDataURL() + ')';
}

function shadeColor(color, percent) {
    color = color.substr(1);
    var num = parseInt(color, 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
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
    console.log(e.offsetX, e.offsetY)
    let x = Math.round(e.offsetX/(cellSize/4))
    let y = Math.round(e.offsetY/(cellSize/4))
    console.log(x,y);
    grid[y][x].color = "#b94f4f";
    bgCtx.clearRect(0,0,bgw,bgh);
    drawMaze();
}

//Animation
// let bgImage = new Image;
// bgImage.src = bg.toDataURL();
// function drawLoop() {
//     bgCtx.clearRect(0,0,bgw,bgh);
    
//     bgCtx.fillStyle = "#b94f4f";
//     bgCtx.fillRect(50,50,1000,1000);

//     drawMaze();
//     // drawCube(
//     //     1100,
//     //     1100,
//     //     cellSize,
//     //     cellSize,
//     //     cellSize,
//     //     "#b94f4f",
//     //     perspective
//     // );

//     window.requestAnimationFrame(drawLoop);
// }

// window.requestAnimationFrame(drawLoop);