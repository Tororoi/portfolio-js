//---------Canvas as Background-----------//

let bg = document.querySelector(".bg"),       
    bgCtx = bg.getContext('2d'),
    //sharpen * 4
    bgw = bg.width = window.innerWidth*4,
    bgh = bg.height = window.innerHeight*4;
    bg.style.width = window.innerWidth + "px";
    bg.style.height = window.innerHeight + "px";

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

// bgCtx.imageSmoothingEnabled = false;
// bgCtx.drawImage(offScreenCVS,0,0, 1000, 1000)
//draw bg
// bgCtx.fillStyle = "#282c34"
// bgCtx.fillRect(0,0,bgw,bgh)
// let yO = bgh*-0.7;
let xO = bgw*0.5;
let yO = bgh*-0.7;
let cellSize = 100;
let perspective = 0.7;
drawMaze();
function drawMaze() {
    for (let y=0; y<grid.length; y++) {
        for (let x=0; x<grid[y].length; x++) {
            let xPos = xO+(cellSize*(x-y));
            let yPos = yO+(perspective*(cellSize*(x+y)));
            if (grid[y][x].color === "transparent") {continue;}
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
    //Get coordinates on canvas, offset by origin
    let xCanvas = e.offsetX*4-xO;
    let yCanvas = e.offsetY*4-yO;
    //Get inverse of isometric transformation
    let newX = 0.7+((yCanvas/perspective)+xCanvas)/(2*cellSize);
    let newY = 0.7+((yCanvas/perspective)-xCanvas)/(2*cellSize);
    let x = Math.ceil(newX);
    let y = Math.ceil(newY);
    if (grid[y][x].color === "transparent") {
        grid[y][x].color = "#b94f4f";
        bgCtx.clearRect(0,0,bgw,bgh);
        drawMaze();
    }
}

//Animation
// let bgImage = new Image;
// bgImage.src = bg.toDataURL();
// function drawLoop() {
//     bgCtx.clearRect(0,0,bgw,bgh);

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

//Nav interaction
let navbar = document.querySelector(".nav");

let projectPopUp = document.querySelector(".popup");
let elPer = document.querySelector(".perspective");
elPer.style.webkitAnimationPlayState = "paused";

//pause animation after completing iteration

elPer.addEventListener("webkitAnimationIteration", () => {
    elPer.style.webkitAnimationPlayState = "paused";
})

navbar.addEventListener("click", handleNavClick);

function handleNavClick(e) {
    if (e.target.innerText === "PROJECTS") {
        //run animation
        if (elPer.style.webkitAnimationPlayState === "paused") {
            elPer.style.webkitAnimationPlayState = "running";
        }
    }
}

//Project card interaction
let projects = document.querySelectorAll(".project");

projects.forEach(p => {
    p.addEventListener("click", handleProjectClick);
    //set initial style properties
    p.style.width = "40%";
})

function handleProjectClick(e) {
    //ignore children
    let project = e.path.reverse()[8];
    // let popupWindow = e.path.reverse()[6];

    if (project.style.width === "40%") {
        project.style.width = "80%";
        project.style.height = "80%";
    } else {
        project.style.width = "40%";
        project.style.height = "60%";
    }

    // if (project.className === "project") {
    //     popupWindow.className = "popup-card";
    //     project.className = "project-card";
    //     // .project class turn display off
    //     document.querySelectorAll(".project").forEach(p => {
    //         p.style.display = "none";
    //     })
    // } else if (project.className === "project-card") {
    //     popupWindow.className = "popup";
    //     project.className = "project";
    //     // .project class turn display off
    //     document.querySelectorAll(".project").forEach(p => {
    //         p.style.display = "flex";
    //     })
    // }
}