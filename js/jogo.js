//Parameters
var gameWidth = 540;
var gameHeight = 504;
var gameSpeed = 256;

var tileSize = 36;

var larguraTiles = gameHeight/tileSize;
var alturaTiles = gameWidth/tileSize;

var obstaculos = [];
var tileWall= {};
var keysDown = {};

var monkeySteep = 1;
var srcMonkeyDown = "images/monkeyDown";
var srcMonkeyUp = "images/monkeyUp";
var srcMonkeyLeft = "images/monkeyLeft";
var srcMonkeyRight = "images/monkeyRight";

var canvas =  document.createElement("canvas");
var ctx =  canvas.getContext("2d");
var itemsCaught = 0;

//Create the canvas
canvas.width = gameWidth;
canvas.height = gameHeight;
document.body.appendChild(canvas);

// Background image
bgImage = new Image();
bgImage.onload = function () {
    drawMap();
};
bgImage.src = "images/back_tile.png";

//Wall Image
var obstaculoTile = new Image();
obstaculoTile.src = "images/tree.png";

// Monkey image
var heroImage = new Image();
heroImage.src = srcMonkeyDown + "1.png";

// Banana image
var itemImage = new Image();
itemImage.src = "images/banana.png";

// Game objects
var hero = {
	speed: gameSpeed, // movement in pixels per second
	crashWith : function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (tileSize);
        var mytop = this.y;
        var mybottom = this.y + (tileSize);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (tileSize);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (tileSize);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }
};

var item = {
	crashWith : function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (tileSize);
        var mytop = this.y;
        var mybottom = this.y + (tileSize);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (tileSize);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (tileSize);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }
};


//Events
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game
var reset = function () {
	drawItem();
};

// Update game objects
var update = function (modifier) {

	var minY = 0;
	var maxY = gameHeight - tileSize;
	var minX = 0;
	var maxX = gameWidth - tileSize;

	var movement = hero.speed * modifier;;
	var posFinal = 0;

	var heroOldX = hero.x;
	var heroOldY = hero.y;

	if (38 in keysDown) { // Player holding up
		posFinal = hero.y - movement;
		if(posFinal >= minY)
		{
			hero.y = posFinal;
			makeHeroMovement(srcMonkeyUp);
		}
	}
	if (40 in keysDown) { // Player holding down
		posFinal = hero.y + movement;
		if(posFinal <= maxY)
		{
			hero.y = posFinal;
			makeHeroMovement(srcMonkeyDown);
		}
	}
	if (37 in keysDown) { // Player holding left
		posFinal = hero.x - movement;
		if(posFinal >= minX)
		{
			hero.x = posFinal;
			makeHeroMovement(srcMonkeyLeft);
		}
	}
	if (39 in keysDown) { // Player holding right
		posFinal = hero.x + movement;
		if(posFinal <= maxX)
		{
			hero.x = posFinal;
			makeHeroMovement(srcMonkeyRight);
		}
	}

	for (i = 0; i < obstaculos.length; i += 1) {
        if(hero.crashWith(obstaculos[i]))
        {
        	hero.x = heroOldX;
        	hero.y = heroOldY;
        }
    }

	// The hero touch the item?
	if (
		hero.x <= (item.x + tileSize)
		&& item.x <= (hero.x + tileSize)
		&& hero.y <= (item.y + tileSize)
		&& item.y <= (hero.y + tileSize)
	) {
		++itemsCaught;
		reset();
	}
};

function makeHeroMovement(img)
{
	monkeySteep++;
	if(monkeySteep > 2)
		monkeySteep = 1;

	heroImage.src = img + "" + monkeySteep + ".png";
}

// Draw everything
var render = function () {
	
	clear();
    drawMap();

	ctx.drawImage(heroImage, hero.x, hero.y);
	ctx.drawImage(itemImage, item.x, item.y);

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Bananas: " + itemsCaught, 0, 0);
};

function drawMap()
{
	var ptrn = ctx.createPattern(bgImage, 'repeat'); // Create a pattern with this image, and set it to "repeat".
    ctx.fillStyle = ptrn;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // context.fillRect(x, y, width, height);

	obstaculos = [];

    //UpLimits
    for (i = 0; i <= larguraTiles ;i += 1) {
    	tileWall = {};
		tileWall.x = i * tileSize;
		tileWall.y = 0;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}
	//DownLimits
    for (i = 0; i <= larguraTiles ;i += 1) {
    	tileWall = {};
		tileWall.x = i * tileSize;
		tileWall.y = gameHeight - tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}

	//Left limits
	for (i = 0; i <= alturaTiles ;i += 1) {
    	tileWall = {};
		tileWall.x = 0;
		tileWall.y = i * tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}

	//Right limits
	for (i = 0; i <= alturaTiles ;i += 1) {
    	tileWall = {};
		tileWall.x = gameWidth - tileSize;
		tileWall.y = i * tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}

	//The internal walls
	//X
	for (i = 0; i <= 5 ;i += 1) {
    	tileWall = {};
		tileWall.x = i * tileSize;
		tileWall.y = 5 * tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}
	for (i = 0; i <= 5 ;i += 1) {
    	tileWall = {};
		tileWall.x = i * tileSize;
		tileWall.y = 8 * tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}
	for (i = 8; i <= 13 ;i += 1) {
    	tileWall = {};
		tileWall.x = i * tileSize;
		tileWall.y = 10 * tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}
	for (i = 10; i <= 13 ;i += 1) {
    	tileWall = {};
		tileWall.x = i * tileSize;
		tileWall.y = 5 * tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}

	//Y
	for (i = 3; i <= 5 ;i += 1) {
    	tileWall = {};
		tileWall.x = 5 * tileSize;
		tileWall.y = i * tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}
	for (i = 3; i <= 3 ;i += 1) {
    	tileWall = {};
		tileWall.x = 8 * tileSize;
		tileWall.y = i * tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}
	for (i = 8; i <= 10;i += 1) {
    	tileWall = {};
		tileWall.x = 3 * tileSize;
		tileWall.y = i * tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}
	for (i = 6; i <= 7 ;i += 1) {
    	tileWall = {};
		tileWall.x = 10 * tileSize;
		tileWall.y = i * tileSize;
		ctx.drawImage(obstaculoTile, tileWall.x, tileWall.y);
		obstaculos.push(tileWall); 
	}
}

function clear()
{
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

function drawItem()
{
	// random banana
	item.x = tileSize + (Math.random() * (canvas.width - (tileSize * 2)));
	item.y = tileSize + (Math.random() * (canvas.height - (tileSize * 2)));

	var crash = false;
	for (i = 0; i < obstaculos.length; i += 1) {
		if(item.crashWith(obstaculos[i]))
		{
			drawItem();
			break;
		}
    }
}

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play the game
var then = Date.now();
reset();
hero.x = canvas.width / 2;
hero.y = canvas.height / 2;
main();


