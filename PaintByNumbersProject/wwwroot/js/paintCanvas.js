window.addEventListener('load', () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(250, 70);
    ctx.lineTo(270, 120);
    ctx.lineTo(170, 140);
    ctx.lineTo(190, 80);
    ctx.lineTo(100, 60);
    ctx.lineTo(50, 130);
    ctx.lineTo(20, 20);
    ctx.stroke();
    ctx.beginPath();


    //ctx.fillRect(50, 50, 200, 200);

    //variables
    let painting = false;
    let conv_x = 0;
    let conv_y = 0;
    function startPostion(e) {
        if (e.button === 2) {
            //start paintbucket fill algorithm

        }
        else {
            painting = true;
            
            draw(e);
        }
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';


        conv_x = translatedX(e.clientX);
        conv_y = translatedY(e.clientY);
        ctx.lineTo(conv_x, conv_y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(conv_x, conv_y);

    }

    //events
    canvas.addEventListener('mousedown', startPostion);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);
});

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

});

window.addEventListener('click', function (e) {
    console.log(
        'page: ' + e.pageX + ',' + e.pageY,
        'client: ' + e.clientX + ',' + e.clientY,
        'screen: ' + e.screenX + ',' + e.screenY)
}, false);

function translatedX(x) {
    var rect = canvas.getBoundingClientRect();
    var factor = canvas.width / rect.width;
    return factor * (x - rect.left);
}

function translatedY(y) {
    var rect = canvas.getBoundingClientRect();
    var factor = canvas.width / rect.width;
    return factor * (y - rect.top);
}
window.oncontextmenu = function () {
    //showCustomMenu();
    return false;     // cancel default menu
}