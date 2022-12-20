import { Bala } from './balas.js';

const tiposPlantas = [];
const tipoDisparo = [];
const planta = new Image();
const girasol = new Image();
const planta_disparando = new Image();

girasol.src = 'assets/Plantas/girasol_reposo.png';
planta.src = 'assets/Plantas/planta_reposo.png';
planta_disparando.src = 'assets/Plantas/planta_disparo.png';

tiposPlantas.push(planta, girasol);
tipoDisparo.push(planta_disparando);

export class Planta {
    constructor(x, y, tipo) {
        this.x = x;
        this.y = y;
        this.width = cellSize - cell * 2;
        this.height = cellSize - cell * 2;
        this.disparo = false;
        this.vida = 100;
        this.balas = [];
        this.temp = 0;
        this.tipo = tipo;
        this.tipoPlanta = tiposPlantas;
        this.tipoDisparo = tipoDisparo;
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.spriteWidth = 0;
        this.spriteHeigth = 0;
    }

    draw() {
        if(this.tipo == 0) {
            this.maxFrame = 59;
            if(this.disparo == false) {
                this.spriteWidth = 417;
                this.spriteHeigth = 353;
                ctx.drawImage(this.tipoPlanta[0], this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.x, this.y, this.width, this.height);
            } else {
                this.spriteHeigth = 306;
                this.spriteWidth = 320;
                 ctx.drawImage(this.tipoDisparo[0], this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.x, this.y, this.width, this.height);
            }
        } 
        else {
            this.maxFrame = 54;
            this.spriteWidth = 183;
            this.spriteHeigth = 184;
            ctx.drawImage(this.tipoPlanta[1], this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.x, this.y, this.width, this.height);
        }
    }

    update(frame) {
        if(this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = this.minFrame;

        if(this.tipo == 0) {
            if(this.disparo) {
                this.temp++;
                if(this.frameX === 33) {
                    balas.push(new Bala(this.x + 90, this.y + 35));
                }
            } else {
                this.temp = 0;
            }
        }
    }
}