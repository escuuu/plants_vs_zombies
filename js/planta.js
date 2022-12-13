import { Bala } from './balas.js';

const tiposPlantas = [];
const planta1 = new Image();
const planta2 = new Image();
planta1.src = 'assets/Plantas/planta_reposo.png';
planta2.src = 'assets/Plantas/planta_disparo.png';
tiposPlantas.push(planta1, planta2);

export class Planta {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize - cell * 2;
        this.height = cellSize - cell * 2;
        this.disparo = false;
        this.vida = 100;
        this.balas = [];
        this.temp = 0;
        this.tipo = tiposPlantas;
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 59;
        this.spriteWidth = 417;
        this.spriteHeigth = 353;
    }

    draw() {

        if(this.disparo == false) {
            this.spriteWidth = 417;
            this.spriteHeigth = 353;
            ctx.drawImage(this.tipo[0], this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.x - 10, this.y, this.width, this.height);
        } else {
             this.spriteHeigth = 306;
             this.spriteWidth = 320;
             ctx.drawImage(this.tipo[1], this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.x - 10, this.y, this.width, this.height);
        }
    }

    update() {
        if(this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = this.minFrame;
        
        if(this.disparo) {
            this.temp++;
            console.log(this.temp);
            if(this.frameX === 33) {
                balas.push(new Bala(this.x + 90, this.y + 35));
            }
        } else {
            this.temp = 0;
        }
    }
}