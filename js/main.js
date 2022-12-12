import { Planta } from "./planta.js";
import { Zombie } from "./zombie.js"

var canvas  = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");

canvas.width = 1399;
canvas.height = 600;

// Variables globales
const cellSize = 90;
const cell = 3;
const gameGrid = [];

const zombies = [];
const posicionZombies = [];
let intervaloZombies = 600;

const plantas = [];
const balas = [];
let soles = 300;

const recursos = [];

let puntuacion = 0;
const partidaGanada = 300;

let frame = 0;
let gameOver = false;

window.onload = function() {
    createGrid();
    this.ctx = ctx;
    this.cellSize = cellSize;
    this.cell = cell;
    this.balas = balas;
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
    animate();
}

function dibujarCelda() {
    for(let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}

//Posibilidad de poner setTimeout en funcion draw;
function dibujarBalas() {
    for(let i = 0; i < balas.length; i++) {
        balas[i].update();
        balas[i].draw();

        for(let j = 0; j < zombies.length; j++) {
            if(zombies[j] && balas[i] && colision(balas[i], zombies[j])){
                zombies[j].vida -= balas[i].poder;
                balas.splice(i, 1);
                i--;
            }
        }

        if(balas[i] && balas[i].x > canvas.width - cellSize) {
            balas.splice(i, 1);
            i--;
        }
    }
}

canvas.addEventListener('click', function() {
    const gridPosicionX = mouse.x - (mouse.x % cellSize) + cell;
    const gridPosicionY = mouse.y - (mouse.y % cellSize)+ cell;

    let costePlanta = 100;

    if((gridPosicionY < cellSize) || (gridPosicionY > canvas.height - cellSize) || (gridPosicionX < cellSize*3) ||(gridPosicionX > canvas.width - (cellSize * 5))) {
            return;
    }
    
    for(let i = 0; i < plantas.length; i++) {
        if(plantas[i].x == gridPosicionX && plantas[i].y == gridPosicionY) 
        return;
    }

    if(soles >= costePlanta) {
        plantas.push(new Planta(gridPosicionX, gridPosicionY, cellSize, cell));

        soles = soles - costePlanta;
    }
});

function dibujarPlanta() {
    for(let i = 0; i < plantas.length; i++) {
        plantas[i].draw();
        plantas[i].update();

        if(posicionZombies.indexOf(plantas[i].y) !== -1){
            plantas[i].disparo = true;
        } else {
            plantas[i].disparo = false;
        }
        
        for(let j = 0; j < zombies.length; j++) {

            if(plantas[i] && colision(plantas[i], zombies[j])) {
                zombies[j].movimiento = 0;
                plantas[i].vida -= 0.1;
            }

            if(plantas[i] && plantas[i].vida <= 0){
                plantas.splice(i, 1);
                i--;
                zombies[j].movimiento = zombies[j].velocidad;
            }
        }
    }
}

// Mensajes flotantes
const mensajesFlotantes = [];

class mensajesFlotante {
    constructor(valor, x, y, size, color) {
        this.valor = valor;
        this. x = x;
        this.y = y;
        this.size = size;
        this.span = 0;
        this.color = color;
        this.opacidad = 1;
    }

    update() {
        this.x -= 0.3;
        this.span += 1;
        if(this.opacidad > 0.01) {
            this.opacidad -= 0.01;
        }
    }
    
    draw() {
        ctx.globalAlpha = this.opacidad;
        ctx.fillStyle = this.color;
        ctx.font = this.size + 'px Creepster';
        ctx.fillText(this.valor, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

function dibujarMensajesFlotantes() {
    for(let i = 0; i < mensajesFlotantes.length; i++) {
        mensajesFlotantes[i].update();
        mensajesFlotantes[i].draw();
    }
}

// Enemigos
// class Zombie {
//     constructor(PosicionVertical){
//         this.x = canvas.width;
//         this.y = PosicionVertical;
//         this.width = cellSize - cell * 2;
//         this.height = cellSize - cell * 2;
//         this.velocidad = Math.random() * 0.1 + 0.2;
//         this.movimiento = this.velocidad;
//         this.vida = 100;
//         this.vidaMax = this.vida;
//     }

//     update() {
//         this.x -= this.movimiento;

//     }

//     draw() {
//         ctx.fillStyle = 'red';
//         ctx.fillRect(this.x, this.y, this.width, this.height);
//         ctx.fillStyle = 'black';
//         ctx.font = '30px Creepster';
//         ctx.fillText(Math.floor(this.vida), this.x +27, this.y + 25);
//     }
// }

function dibujarZombies() {
    for(let i = 0; i < zombies.length; i++) {
        zombies[i].update();
        zombies[i].draw();

        if(zombies[i].x <= cellSize*2.5) {
            gameOver = true;
        }

        if(zombies[i].vida <= 0) {
            let solecito = zombies[i].vidaMax/5;
            soles += solecito;
            puntuacion += 10;
            const encontrarPos = posicionZombies.indexOf(zombies[i].y);
            posicionZombies.splice(encontrarPos, 1);
            zombies.splice(i, 1);
            i--;
            console.log(posicionZombies);
        }
    }

    if(frame % intervaloZombies === 0 && puntuacion < partidaGanada) {
        let pV = Math.floor(Math.random() * 5 + 1) * cellSize + cell;
        zombies.push(new Zombie(pV, canvas.width));
        posicionZombies.push(pV);
        if(intervaloZombies > 120) intervaloZombies -= 20;
        console.log(posicionZombies);
    }
}

// Recursos
const cantidad = 20;
class Recurso {
    constructor() {
        this.x = Math.random() * cellSize*2 + cellSize*4;
        this.y = (Math.floor(Math.random() * 1)) * cellSize + 25;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        this.cantidad = cantidad;
        this.velocidad = 0.5;
    }

    update() {
        this.y += this.velocidad;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Creepster';
        ctx.fillText(this.cantidad, this.x + 15, this.y + 25);
    }
}

function dibujarRecursos() {
    if(frame % 500 === 0 && puntuacion < partidaGanada) {
        recursos.push(new Recurso());
    }

    for(let i = 0; i < recursos.length; i++) {
        recursos[i].update();
        recursos[i].draw();
        if(recursos[i] && mouse.x && mouse.y && colision(recursos[i],  mouse)) {
            soles += recursos[i].cantidad;
            recursos.splice(i, 1);
            i--;
        }
    }
}

// Herramientas
function EstadoPartida() {
    ctx.fillStyle = 'gold';
    ctx.font = '30px Creepster';
    ctx.fillText('Puntuacion: ' + puntuacion, 35, 35);
    ctx.fillText('Soles: ' + soles, 35, 75);

    if(gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '90px Creepster';
        ctx.fillText('Game Over', 550, 300);
    }

    if(puntuacion >= partidaGanada && zombies.length === 0) {
        ctx.fillStyle = 'black';
        ctx.font = '90px Creepster';
        ctx.fillText('¡GANASTE!', 550, 300);
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cellSize*3, controlBar.height);
    dibujarCelda();
    dibujarPlanta();
    dibujarRecursos();
    dibujarBalas();
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

window.addEventListener('resize', function() {
    canvasPosicion = canvas.getBoundingClientRect();
});