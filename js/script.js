var canvas  = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");

canvas.width = 1399;
canvas.height = 600;

// Variables globales
const cellSize = 90;
const cell = 3;
const gameGrid = [];
const plantas = [];
let soles = 300;
const zombies = [];
const posicionZombies = [];
let intervaloZombies = 600;
let frame = 0;

let gameOver = false;


window.onload = function() {
    console.log("Pagina cargada");
    createGrid();
    console.log(canvasPosicion);
}


// Tablero
const controlBar = {
    width: canvas.width,
    height: cellSize,
}

const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1
}

let canvasPosicion = canvas.getBoundingClientRect();

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.x - canvasPosicion.left;
    mouse.y = e.y - canvasPosicion.top;
})

canvas.addEventListener('mouseleave', function() {
    mouse.x = undefined;
    mouse.y = undefined;
})

class Celda {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }

    draw() {
        if(mouse.x && mouse.y && colision(this, mouse)){
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

function createGrid() {
    for(let y = cellSize; y < canvas.height; y+= cellSize) {
        for(let x = 0; x < canvas.width ; x += cellSize) {
            gameGrid.push(new Celda(x, y));
        }
    }
    console.log(gameGrid);
    animate();
}

function dibujarCelda() {
    for(let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
        
    }
}

// Projectiles

// Defensas
class Planta {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.disparo = false;
        this.vida = 100;
        this.projectiles = [];
        this.temp = 0;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'gold';
        ctx.font = '30px Arial';
        ctx.fillText(Math.floor(this.vida), this.x +15, this.y + 25);
    }
}

canvas.addEventListener('click', function() {
    const gridPosicionX = mouse.x - (mouse.x % cellSize);
    const gridPosicionY = mouse.y - (mouse.y % cellSize);

    let costePlanta = 100;

    if((gridPosicionY < cellSize) || (gridPosicionY > canvas.height - cellSize) || (gridPosicionX < cellSize*3) ||(gridPosicionX > canvas.width - (cellSize * 5))) {
            return;
    }
    
    for(i = 0; i < plantas.length; i++) {
        if(plantas[i].x == gridPosicionX && plantas[i].y == gridPosicionY) 
        return;
    }

    if(soles >= costePlanta) {
        plantas.push(new Planta(gridPosicionX, gridPosicionY));
        console.log(soles);
        soles = soles - costePlanta;
    }
});

function dibujarPlanta() {
    for(let i = 0; i < plantas.length; i++) {
        plantas[i].draw();
    }
}

// Enemigos
class Zombie {
    constructor(PosicionVertical){
        this.x = canvas.width;
        this.y = PosicionVertical;
        this.width = cellSize;
        this.height = cellSize;
        this.velocidad = Math.random() * 0.1 + 0.3;
        this.movimiento = this.velocidad;
        this.vida = 100;
        this.vidaMax = this.vida;
    }

    update() {
        this.x -= this.movimiento;

    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText(Math.floor(this.vida), this.x +15, this.y + 25);
    }
}

function dibujarZombies() {
    for(let i = 0; i < zombies.length; i++) {
        zombies[i].update();
        zombies[i].draw();

        if(zombies[i].x <= cellSize*2.5) {
            gameOver = true;
        }
    }

    if(frame % intervaloZombies === 0) {
        let pV = Math.floor(Math.random() * 5 + 1) * cellSize;
        zombies.push(new Zombie(pV));
        posicionZombies.push(pV);
        if(intervaloZombies > 120) intervaloZombies -= 2;
    }
}

// Recursos

// Herramientas
function EstadoPartida() {
    ctx.fillStyle = 'gold';
    ctx.font = '30px Arial';
    ctx.fillText('Soles: ' + soles, 20, 50);

    console.log(gameOver);

    if(gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '60px Arial';
        ctx.fillText('Game Over', 700, 300);
    }
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'blue';
    // ctx.fillRect(0, 0, controlBar.width, controlBar.height);
    dibujarCelda();
    dibujarPlanta();
    dibujarZombies();
    EstadoPartida();
    frame++;
    if(!gameOver) {requestAnimationFrame(animate)};
}

function colision(first, second) {
    if(!(first.x > second.x + second.width || 
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y)){
            return true;
        }
}