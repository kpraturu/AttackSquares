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

var isGameOver = false;
var gameTime = 0;
var player = {
    pos: [0, 0],
    sprite: new Sprite('img/FilledCircle.png', [0, 0])
};

canvas.width = 600;
canvas.height = 480;
document.body.appendChild(canvas);


var playerSpeed = 200;
// The main game loop
var lastTime;
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
    player.sprite.render(ctx);
    lastTime = Date.now();
    main();
}
function update(dt) {
    gameTime+= dt;
    handleInput(dt);
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
};

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
resources.onReady(init);