var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.addEventListener("mousemove", mouseMoveHandler, false);
var mouseX = 0;
var mouseY = 0;
var mouseXPos = [];
var mouseYPos = [];

function mouseMoveHandler(e) {
    mouseX = e.clientX-canvas.offsetLeft;
    mouseY = e.clientY-canvas.offsetTop;
}

var isMouseDown = false;
var isGameOver = false;
var gameTime = 0;
var player = {
    pos: [0, 0],
    sprite: new Sprite('img/FilledCircle.png',[0,0])
};


var bullets = [];
var squareEnemies = [];

canvas.width = 600;
canvas.height = 480;
document.body.appendChild(canvas);


var playerSpeed = 200;
var bulletSpeed = 500;
// The main game loop
var lastTime;
var lastFire = Date.now();
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    update(dt);
    render();
    lastTime = now;

    requestAnimFrame(main);
};

function init() {
    document.getElementById('play-again').addEventListener('click', function() {
     //   reset();
    });

  //  reset();
    lastTime = Date.now();
    main();
}
resources.onReady(init);
function update(dt) {
    gameTime+= dt;
    handleInput(dt);
    updateEntities(dt);
}

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
    }

     if(isMouseDown &&
       !isGameOver &&
       Date.now() - lastFire > 100) {
        var x = player.pos[0] ;
        var y = player.pos[1];

        bullets.push({ pos: [x, y],            
                       sprite: new Sprite('img/OutlinedCircle.png', [8, 8]),
                       initLoc: [x,y] });
        lastFire = Date.now();
        mouseXPos.push(mouseX);
        mouseYPos.push(mouseY);
    }
}
function updateEntities(dt) {

    // Update all the bullets
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];
        var dx = mouseXPos[i] - bullet.initLoc[0];
        var dy = mouseYPos[i] - bullet.initLoc[1];
        var mag = Math.sqrt(dx*dx + dy*dy);

        bullet.pos[0] += (dx/mag) * bulletSpeed * dt;
        bullet.pos[1] += (dy/mag) * bulletSpeed * dt;
        console.log(bullets.length + "," + mouseXPos.length);
        // Remove the bullet if it goes offscreen
        if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
           bullet.pos[0] > canvas.width) {
            bullets.splice(i, 1);
            mouseXPos.splice(i,1);
            mouseYPos.splice(i,1);
            i--;
        }
    }
}
canvas.oncontextmenu = function (e) {
    //context menu seems to break game...
    e.preventDefault();
}
document.onmousedown = function(e) {
    isMouseDown = true;
}
document.onmouseup = function(e) {
    isMouseDown = false;
}
function checkPlayerBounds() {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

// Draw everything
function render() {
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(0, 0, canvas.width, canvas.length);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(player);
    }
    renderEntities(bullets);
};
function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}
function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}
resources.load([
    'img/FilledCircle.png',
    'img/OutlinedCircle.png',
    'img/Square.png'
]);