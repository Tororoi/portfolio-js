//---------Canvas as Background-----------//

let bg = document.createElement('canvas'),        
    bgCtx = bg.getContext('2d'),
    bgw = bg.width = 1000,
    bgh = bg.height = 1000;

// bgCtx.imageSmoothingEnabled = false;
// bgCtx.drawImage(offScreenCVS,0,0, 1000, 1000)
for (let y=0; y<grid.length; y++) {
    for (let x=0; x<grid[y].length; x++) {
        if (grid[y][x].color === "transparent") {continue;}
        // draw the cube
        drawCube(
            x*10,
            y*10,
            10,
            10,
            10,
            grid[y][x].color
        );
    }
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

function drawCube(x, y, wx, wy, h, color) {
    bgCtx.beginPath();
    bgCtx.moveTo(x, y);
    bgCtx.lineTo(x - wx, y - wx * 0.5);
    bgCtx.lineTo(x - wx, y - h - wx * 0.5);
    bgCtx.lineTo(x, y - h * 1);
    bgCtx.closePath();
    bgCtx.fillStyle = shadeColor(color, -10);
    bgCtx.strokeStyle = color;
    bgCtx.stroke();
    bgCtx.fill();

    bgCtx.beginPath();
    bgCtx.moveTo(x, y);
    bgCtx.lineTo(x + wy, y - wy * 0.5);
    bgCtx.lineTo(x + wy, y - h - wy * 0.5);
    bgCtx.lineTo(x, y - h * 1);
    bgCtx.closePath();
    bgCtx.fillStyle = shadeColor(color, 10);
    bgCtx.strokeStyle = shadeColor(color, 50);
    bgCtx.stroke();
    bgCtx.fill();

    bgCtx.beginPath();
    bgCtx.moveTo(x, y - h);
    bgCtx.lineTo(x - wx, y - h - wx * 0.5);
    bgCtx.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5));
    bgCtx.lineTo(x + wy, y - h - wy * 0.5);
    bgCtx.closePath();
    bgCtx.fillStyle = shadeColor(color, 20);
    bgCtx.strokeStyle = shadeColor(color, 60);
    bgCtx.stroke();
    bgCtx.fill();
}

document.body.style.background = 'url(' + bg.toDataURL() + ')';