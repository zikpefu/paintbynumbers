let toolbox, d;
/*
 * Documnetation for p5.js: https://p5js.org/reference/
 * @author: Zachary Ikpefua
 * @description: Pulls an image ('frog_example.png') and does a simple paintbucket fill for each regiion (starts off gray)
 * Implementation heavilly referenced from Emilia Hardej and Dominique Fortin (Stack Overflow)
 **** Original goal for Emilia is to have an entire paintbucket application, so thats why there is a "toolbox" variable (we probablily can remove this for our case)
 * Problems: Paintbucket fill is slow for bigger images, consider implementing a q-floodfill algorithm if possible
 * Future Implementations: Remove Toolbox varaible, make FillTooll global, have a modular way to take in colors, logic for finishing painting, change variable names
 */

//p5.js function - executes before page load (its possible to add a loading animation here)
function preload() {
    // preload() runs once
    img = loadImage('images/frog_example.png');
    colorMode(RGB);
}

//p5 function - runs once after preload
function setup() {
    img.loadPixels();
    createCanvas(img.width, img.height);
    d = pixelDensity();
    //ColorPallette takes in R,G,B,A in that order - returns array
    let start_color = ColorPalette(125, 125, 125, 255);
    toolbox = { 'selectedTool': new FillTool() };
    toolbox.selectedTool.setColor(start_color);
}

//p5 function - runs forever after setup
function draw() {
    image(img, 0, 0); //paint image forever

    if (!toolbox.selectedTool.hasOwnProperty("draw")) {
        alert("it doesn't look like your tool has a draw method!");
        return;
    }

    toolbox.selectedTool.draw();
}

function FillTool() {
    let self = this;

    //set an icon and a name for the object
    //self.icon = "assets/freehand.jpg";
    self.name = "FillTool";
    self.Color = ColorPalette(0, 0, 0, 255);

    self.draw = function () {
        if (mouseIsPressed) {
            //add floor function to ensure no decimals
            floodFill(Math.floor(mouseX), Math.floor(mouseY));
        }
    };

    self.setColor = function (col) {
        self.Color = col;
    };

    function matchColor(pos, oldColor) {
        var current = getPixelData(pos.x, pos.y);
        return (current[0] === oldColor[0] && current[1] === oldColor[1]
            && current[2] === oldColor[2] && current[3] === oldColor[3]);
    }

    function getKey(pos) {
        return "" + pos.x + "_" + pos.y;
    }

    function checkPixel(pos, positionSet) {
        return !positionSet.hasOwnProperty(getKey(pos));
    }
    self.changeFill = function (button) {
        //chnage current fill of colors based on button pressed, needs to be scalable
        var x = button.id;
        switch (x) {
            case '1':
                self.setColor(ColorPalette(0, 255, 0, 255));
                break;
            case '2':
                self.setColor(ColorPalette(0, 0, 255, 255));
                break;
            case '3':
                self.setColor(ColorPalette(255, 0, 0, 255));
                break;
            default:
                return false;
        }

    };
    function floodFill(xPos, yPos) {
        var stack = [];
        var pixelList = {};

        var first = { 'x': xPos, 'y': yPos };
        stack.push(first);
        pixelList[getKey(first)] = 1;

        //console.log( JSON.stringify(stack) );

        loadPixels();
        var firstColor = getPixelData(xPos, yPos);

        while (stack.length > 0) {

            var pos1 = stack.pop();

            setPixelData(pos1.x, pos1.y, self.Color);

            var up = { 'x': pos1.x, 'y': pos1.y - 1 };
            var dn = { 'x': pos1.x, 'y': pos1.y + 1 };
            var le = { 'x': pos1.x - 1, 'y': pos1.y };
            var ri = { 'x': pos1.x + 1, 'y': pos1.y };

            if (0 <= up.y && up.y < height && matchColor(up, firstColor)) addPixelToDraw(up);
            if (0 <= dn.y && dn.y < height && matchColor(dn, firstColor)) addPixelToDraw(dn);
            if (0 <= le.x && le.x < width && matchColor(le, firstColor)) addPixelToDraw(le);
            if (0 <= ri.x && ri.x < width && matchColor(ri, firstColor)) addPixelToDraw(ri);
        }

        updatePixels();

        //console.log( JSON.stringify(pixelList) );

        function addPixelToDraw(pos) {

            if (checkPixel(pos, pixelList)) {
                stack.push(pos);
                pixelList[getKey(pos)] = 1;
            }
        }
    }

}

function ColorPalette(r, g, b, a) {
    var self = (this !== window ? this : {});
    if (arguments.length === 0) {
        self['0'] = 0; self['1'] = 0; self['2'] = 0; self['3'] = 0;
    } else if (arguments.length === 1) {
        self['0'] = r[0]; self['1'] = r[1]; self['2'] = r[2]; self['3'] = r[3];
    } else if (arguments.length === 4) {
        self['0'] = r; self['1'] = g; self['2'] = b; self['3'] = a;
    } else if (arguments.length === 3) {
        self['0'] = r; self['1'] = g; self['2'] = b; self['3'] = 255;
    } else {
        return null;
    }
    return self;
}


function getPixelData(x, y) {
    var pxColor = [];
    for (var i = 0; i < d; ++i) {
        for (var j = 0; j < d; ++j) {
            let idx = 4 * ((y * d + j) * width * d + (x * d + i));
            pxColor[0] = pixels[idx];
            pxColor[1] = pixels[idx + 1];
            pxColor[2] = pixels[idx + 2];
            pxColor[3] = pixels[idx + 3];
        }
    }
    return pxColor;
}

function setPixelData(x, y, to_Color) {
    for (var i = 0; i < d; ++i) {
        for (var j = 0; j < d; ++j) {
            let idx = 4 * ((y * d + j) * width * d + (x * d + i));
            pixels[idx] = to_Color[0];
            pixels[idx + 1] = to_Color[1];
            pixels[idx + 2] = to_Color[2];
            pixels[idx + 3] = to_Color[3];
        }
    }
}
