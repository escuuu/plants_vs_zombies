import { Planta } from "./planta.js";
import { Zombie } from "./zombie.js";
import { Recurso } from "./recurso.js";

var canvas  = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");

canvas.width = 1150;
canvas.height = 600;

// Variables globales
const cellSize = 90;
const cell = 3;
const gameGrid = [];

const zombies = [];
const posicionZombies = [];
let comer = false;
let intervaloZombies = 600;

const plantas = [];
const balas = [];
let soles = 300;

const recursos = [];
const mensajesFlotantes = [];

let puntuacion = 0;
const partidaGanada = 500;

let frame = 0;
let gameOver = false;

window.onload = function() {
    createGrid();
    this.ctx = ctx;
    this.cellSize = cellSize;
    this.cell = cell;
    this.balas = balas;
}

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

//Clases
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
        this.y -= 0.3;
        this.span += 1;
        if(this.opacidad > 0.01) {
            this.opacidad -= 0.01;
        }
    }
    
    draw() {
        ctx.globalAlpha = this.opacidad;
        ctx.fillStyle = this.color;
        ctx.font = this.size + 'px Creepster';
        ctx.fillText(this.valor, this.x - 60, this.y - 15);
        ctx.globalAlpha = 1;
    }
}

//Listeners
canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.x - canvasPosicion.left;
    mouse.y = e.y - canvasPosicion.top;
})

canvas.addEventListener('mouseleave', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

canvas.addEventListener('click', function() {
    const gridPosicionX = mouse.x - (mouse.x % cellSize) + cell;
    const gridPosicionY = mouse.y - (mouse.y % cellSize)+ cell;

    let costePlanta = 100;

    if((gridPosicionY < cellSize) || (gridPosicionY > canvas.height - cellSize) || (gridPosicionX < cellSize*3) ||(gridPosicionX > canvas.width - (cellSize * 2))) {
            return;
    }
    
    for(let i = 0; i < plantas.length; i++) {
        if(plantas[i].x == gridPosicionX && plantas[i].y == gridPosicionY) 
        return;
    }

    if(soles >= costePlanta) {
        plantas.push(new Planta(gridPosicionX, gridPosicionY, cellSize, cell));
        soles = soles - costePlanta;
    } else {
        mensajesFlotantes.push(new mensajesFlotante('Se necesitan más recursos', mouse.x, mouse.y, 20, 'blue'));
    }
});

window.addEventListener('resize', function() {
    canvasPosicion = canvas.getBoundingClientRect();
});

//Tablero
function createGrid() {
    for(let y = cellSize; y < canvas.height; y+= cellSize) {
        for(let x = 0; x < canvas.width ; x += cellSize) {
            gameGrid.push(new Celda(x, y));
        }
    }
    animate();
}

//Celda
function dibujarCelda() {
    for(let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}

//Balas
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

//Planta
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
                zombies[j].comer = true;
                zombies[j].movimiento = 0;
                plantas[i].vida -= 0.1;
            }

            if(plantas[i] && plantas[i].vida <= 0){
                zombies[i].comer = false;
                plantas.splice(i, 1);
                i--;
                zombies[j].movimiento = zombies[j].velocidad;
            }
        }
    }
}

// Mensajes flotantes
function dibujarMensajesFlotantes() {
    for(let i = 0; i < mensajesFlotantes.length; i++) {
        mensajesFlotantes[i].update();
        mensajesFlotantes[i].draw();

        if(mensajesFlotantes[i].span >= 50) {
            mensajesFlotantes.splice(i, 1);
            i--;
        }
    }
}

//Zombies
function dibujarZombies() {
    for(let i = 0; i < zombies.length; i++) {
        zombies[i].update(frame);
        zombies[i].draw();

        if(zombies[i].x <= cellSize*2.5) {
            gameOver = true;
        }

        if(zombies[i].vida <= 0) {
            puntuacion += 10;
            const encontrarPos = posicionZombies.indexOf(zombies[i].y);
            posicionZombies.splice(encontrarPos, 1);
            zombies.splice(i, 1);
            i--;
        }
    }

    if(frame % intervaloZombies === 0 && puntuacion < partidaGanada) {
        let pV = Math.floor(Math.random() * 5 + 1) * cellSize + cell;
        //console.log(frame);
        zombies.push(new Zombie(pV, canvas.width, cellSize, cell));
        posicionZombies.push(pV);

        if(intervaloZombies > 120) intervaloZombies -= 10;
    }
}

//Recursos
function dibujarRecursos() {
    if(frame % 500 === 0 && puntuacion < partidaGanada) {
        recursos.push(new Recurso(cellSize, ctx));
    }

    for(let i = 0; i < recursos.length; i++) {
        recursos[i].update();
        recursos[i].draw();
        if(recursos[i] && mouse.x && mouse.y && colision(recursos[i],  mouse)) {
            soles += recursos[i].cantidad;
            mensajesFlotantes.push(new mensajesFlotante('+' + recursos[i].cantidad, recursos[i].x, recursos[i].y, 50, 'black'));
            mensajesFlotantes.push(new mensajesFlotante('+' + recursos[i].cantidad, cellSize * 3, 10, 20, 'black'));
            recursos.splice(i, 1);
            i--;
        }
    }
}

// Herramientas
function EstadoPartida() {
    ctx.fillStyle = 'black';
    ctx.font = '55px Creepster';
    ctx.fillText(soles, 100, 52);

    if(gameOver) {

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'green';
        ctx.font = '110px Creepster';
        ctx.fillText('Game Over', 350, 350);
    }

    if(puntuacion >= partidaGanada && zombies.length === 0) {
        ctx.fillStyle = 'black';
        ctx.font = '90px Creepster';
        ctx.fillText('¡GANASTE!', 350, 300);
    }
}

function animate() {
    const cuadro = new Image();
    cuadro.src = 'assets/soles.png';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cuadro, 0, 0, 200, 64);

    dibujarCelda();
    dibujarPlanta();
    dibujarRecursos();
    dibujarBalas();
    dibujarZombies();
    EstadoPartida();
    dibujarMensajesFlotantes();
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
