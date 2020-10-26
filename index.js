//---------Canvas as Background-----------//

let bg = document.createElement('canvas'),        
    bgCtx = bg.getContext('2d'),
    bgw = bg.width = 1000,
    bgh = bg.height = 1000;

bgCtx.imageSmoothingEnabled = false;
bgCtx.drawImage(offScreenCVS,0,0, 1000, 1000)

document.body.style.background = 'url(' + bg.toDataURL() + ')';