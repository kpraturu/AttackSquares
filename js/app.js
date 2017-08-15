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
var score = 0;

//size = 32px
var player = {
    pos: [0, 0],
    sprite: new Sprite('img/FilledCircle.png',[0,0]),
    size: 32 
};

//size = 36px
var enemy = {
    pos: [564,444],
    sprite: new Sprite('img/Square.png', [0, 0]),
    size: 36
}


var bullets = [];


var updateCount = false;
var count = [];

var multiplier = [];
canvas.width = 600;
canvas.height = 480;
document.body.appendChild(canvas);


var playerSpeed = 200;
var bulletSpeed = 500;
var enemySpeed = 200;
// The main game loop
var lastTime;
var lastFire = Date.now();
var lastMove = Date.now();
var direction = [1,1];
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

resources.load([
    'img/FilledCircle.png',
    'img/OutlinedCircle.png',
    'img/Square.png'
]);

var score = 0;
var scoreEl = document.getElementById('score');

resources.onReady(init);
function update(dt) {
    gameTime+= dt;

    handleInput(dt);
    updateEntities(dt);
    enemyMovement(dt);

    checkCollisions();
    scoreEl.innerHTML = score;
}

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
        direction[1] = 1;
    } 

    if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
        direction[1] = -1;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
        direction[0] = -1;
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
        direction[0] = 1;
    }

    if(isMouseDown &&
       !isGameOver &&
       Date.now() - lastFire > 1000) {
        var x = player.pos[0] ;
        var y = player.pos[1];

        bullets.push({ pos: [x, y],            
                       sprite: new Sprite('img/OutlinedCircle.png', [8, 8]),
                       size: 14,
                       initLoc: [x,y] });
        lastFire = Date.now();
        mouseXPos.push(mouseX);
        mouseYPos.push(mouseY);
        count.push(0);
        multiplier.push(1);
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

        // Remove the bullet if it goes offscreen
        if(bullet.pos[0] < -14 || bullet.pos[0] > canvas.width-14) {
            if( bullet.pos[0] < -14) {
                mouseXPos[i] += 300;
            } else {
                mouseXPos[i] = -mouseXPos[i];
            }
            updateCount = true;
        }
        if (bullet.pos[1] < -14 || bullet.pos[1] > canvas.height - 14 ) {
            if( bullet.pos[1] < -14) {
                mouseYPos[i] += 240;
            } else {
                mouseYPos[i] = -mouseYPos[i];
            }
            updateCount = true;
        }
        if(updateCount) {
            count[i]++;
            multiplier[i] *= 2;

        }
        if(count[i] > 3) {
            bullets.splice(i, 1);
            mouseXPos.splice(i,1);
            mouseYPos.splice(i,1);
            count.splice(i,1);
            multiplier.splice(i,1);
            i--;
        }
        updateCount = false;
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
var xMove;
var yMove;
function checkBounds() {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0]+32 > canvas.width) {
        player.pos[0] = canvas.width - 32;
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] + 32 > canvas.height) {
        player.pos[1] = canvas.height - 32;
    }

    if(enemy.pos[0] < 0) {
        enemy.pos[0] = 0;
        xMove = -xMove;
    }
    else if(enemy.pos[0]+36 > canvas.width) {
        enemy.pos[0] = canvas.width - 36;
        xMove = -xMove;
    }

    if(enemy.pos[1] < 0) {
        enemy.pos[1] = 0;
        yMove = -yMove;
    }
    else if(enemy.pos[1] + 36 > canvas.height) {
        enemy.pos[1] = canvas.height - 36;
        yMove = -yMove;
    }

}
var flag = true;
function enemyMovement(dt) {
    if (flag) {
        xMove = Math.floor(Math.random()*3)*enemySpeed-300;
        yMove = Math.floor(Math.random()*3)*enemySpeed-300;
        flag = false;
    }
    if(Date.now() - lastMove > 1500){
        xMove = Math.floor(Math.random()*3)*enemySpeed-300;
        yMove = Math.floor(Math.random()*3)*enemySpeed-300;
        lastMove = Date.now();
    }
    //console.log(xMove +","+ yMove);
    enemy.pos[0] += xMove*dt;
    enemy.pos[1] += yMove*dt;


    
}

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size, pos[1] + size,
                    pos2[0], pos2[1],
                    pos2[0] + size2, pos2[1] + size2);
}

function checkCollisions() {
    checkBounds();

    // Run collision detection for all enemies and bullets
    var pos = enemy.pos;
    var size = enemy.size;
    for(var i=0; i<bullets.length; i++) {

        var pos2 = bullets[i].pos;
        var size2 = bullets[i].size;
        if(boxCollides(pos, size, pos2, size2)) {

            score+= 20 * multiplier[i];
            // Remove the bullet and stop this iteration
            bullets.splice(i, 1);
            mouseXPos.splice(i,1);
            multiplier.splice(i,1);
            break;
        }
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
        renderEntity(enemy);
    }
    renderEntities(bullets);
  //  renderEntities(enemies);
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
