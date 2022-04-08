////window.addEventListener('load', () => {
////    const canvas = document.querySelector('canvas');
////    const ctx = canvas.getContext('2d');
////    canvas.height = window.innerHeight;
////    canvas.width = window.innerWidth;
////    ctx.beginPath();
////    ctx.moveTo(20, 20);
////    ctx.lineTo(250, 70);
////    ctx.lineTo(270, 120);
////    ctx.lineTo(170, 140);
////    ctx.lineTo(190, 80);
////    ctx.lineTo(100, 60);
////    ctx.lineTo(50, 130);
////    ctx.lineTo(20, 20);
////    ctx.stroke();
////    ctx.beginPath();


////    //ctx.fillRect(50, 50, 200, 200);

////    //variables
////    let painting = false;
////    let conv_x = 0;
////    let conv_y = 0;
////    function startPostion(e) {
////        if (e.button === 2) {
////            conv_y = translatedY(e.clientY);
////            //start pai40et50algorithm
////            //floodFill(ctx, conv_x, conv_y, 0xFF0000FF);
////        }
////        else {
////            painting = true;
            
////            draw(e);
////        }
////    }

////    function finishedPosition() {
////        painting = false;
////        ctx.beginPath();
////    }

////    function draw(e) {
////        if (!painting) return;
////        ctx.lineWidth = 10;
////        ctx.lineCap = 'round';


////        conv_x = translatedX(e.clientX);
////        conv_y = translatedY(e.clientY);
////        ctx.lineTo(conv_x, conv_y);
////        ctx.stroke();
////        ctx.beginPath();
////        ctx.moveTo(conv_x, conv_y);

////    }

////    //events
////    canvas.addEventListener('mousedown', startPostion);
////    canvas.addEventListener('mouseup', finishedPosition);
////    canvas.addEventListener('mousemove', draw);
////});

////window.addEventListener('resize', () => {
////    canvas.height = window.innerHeight;
////    canvas.width = window.innerWidth;

////});

////window.addEventListener('click', function (e) {
////    console.log(
////        'page: ' + e.pageX + ',' + e.pageY,
////        'client: ' + e.clientX + ',' + e.clientY,
////        'screen: ' + e.screenX + ',' + e.screenY)
////}, false);

////function translatedX(x) {
////    var rect = canvas.getBoundingClientRect();
////    var factor = canvas.width / rect.width;
////    return factor * (x - rect.left);
////}

////function translatedY(y) {
////    var rect = canvas.getBoundingClientRect();
////    var factor = canvas.width / rect.width;
////    return factor * (y - rect.top);
////}
////window.oncontextmenu = function () {
////    //showCustomMenu();
////    return false;     // cancel default menu
////}



////function getPixel(pixelData, x, y) {
////    if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
////        return -1;  // impossible color
////    } else {
////        return pixelData.data[y * pixelData.width + x];
////    }
////}

////function floodFill(ctx, x, y, fillColor) {
////    // read the pixels in the canvas
////    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

////    // make a Uint32Array view on the pixels so we can manipulate pixels
////    // one 32bit value at a time instead of as 4 bytes per pixel
////    const pixelData = {
////        width: imageData.width,
////        height: imageData.height,
////        data: new Uint32Array(imageData.data.buffer),
////    };

////    // get the color we're filling
////    const targetColor = getPixel(pixelData, x, y);

////    // check we are actually filling a different color
////    if (targetColor !== fillColor) {

////        const pixelsToCheck = [x, y];
////        while (pixelsToCheck.length > 0) {
////            const y = pixelsToCheck.pop();
////            const x = pixelsToCheck.pop();

////            const currentColor = getPixel(pixelData, x, y);
////            if (currentColor === targetColor) {
////                pixelData.data[y * pixelData.width + x] = fillColor;
////                pixelsToCheck.push(x + 1, y);
////                pixelsToCheck.push(x - 1, y);
////                pixelsToCheck.push(x, y + 1);
////                pixelsToCheck.push(x, y - 1);
////            }
////        }

////        // put the data back
////        ctx.putImageData(imageData, 0, 0);
////    }
////}

var tool;
var tool_default = 'bucket';
var tools = {};
var canvas, ctx;
var curColor = {
    r: 0,
    g: 0,
    b: 0
};

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    width = 200;
    height = 200;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    if (tools[tool_default]) {
        tool = new tools['bucket']();
    };

    canvas.addEventListener('mousedown', ev_canvas, false);
}

function ev_canvas(ev) {
    if (ev.layerX || ev.layerX == 0) {
        ev._x = ev.layerX;
        ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) {
        ev._x = ev.offsetX;
        ev._y = ev.offsetY;
    }

    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
        func(ev);
    }
}

function clearCanvas() {
    canvas.width = canvas.width;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
}

function setColor(value) {
    var color = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    curColor.r = parseInt(color[1], 16);
    curColor.g = parseInt(color[2], 16);
    curColor.b = parseInt(color[3], 16);
}

$(function () {
    tools.bucket = function () {
        var tool = this;
        this.mousedown = function (e) {
            var drawingBoundTop = 0;
            var imageData = ctx.getImageData(0, 0, width, height);
            pixelStack = [
                [e._x, e._y]
            ];
            var cnt = 0;
            while (pixelStack.length) {
                //if(cnt++ > 10) return;
                var newPos, x, y, pixelPos, reachLeft, reachRight;
                newPos = pixelStack.pop();
                x = newPos[0];
                y = newPos[1];

                pixelPos = (y * width + x) * 4;
                while (y-- >= drawingBoundTop && matchStartColor(pixelPos)) {
                    pixelPos -= width * 4;
                }
                pixelPos += width * 4;
                ++y;
                reachLeft = false;
                reachRight = false;
                while (y++ < height - 1 && matchStartColor(pixelPos)) {
                    colorPixel(pixelPos);

                    if (x > 0) {
                        if (matchStartColor(pixelPos - 4)) {
                            if (!reachLeft) {
                                pixelStack.push([x - 1, y]);
                                reachLeft = true;
                            }
                        } else if (reachLeft) {
                            reachLeft = false;
                        }
                    }

                    if (x < width - 1) {
                        if (matchStartColor(pixelPos + 4)) {
                            if (!reachRight) {
                                pixelStack.push([x + 1, y]);
                                reachRight = true;
                            }
                        } else if (reachRight) {
                            reachRight = false;
                        }
                    }

                    pixelPos += width * 4;
                }
            }
            ctx.putImageData(imageData, 0, 0);

            function matchStartColor(pixelPos) {
                var r = imageData.data[pixelPos];
                var g = imageData.data[pixelPos + 1];
                var b = imageData.data[pixelPos + 2];

                return (r !== curColor.r || g !== curColor.g || b !== curColor.b);
            }

            function colorPixel(pixelPos) {
                imageData.data[pixelPos] = curColor.r;
                imageData.data[pixelPos + 1] = curColor.g;
                imageData.data[pixelPos + 2] = curColor.b;
                imageData.data[pixelPos + 3] = 255;
            }
        }
    }

    init();
});