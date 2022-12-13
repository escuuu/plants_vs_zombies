import { Bala } from './balas.js';

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
    }

    draw() {
        if(this.disparo == false) {
            ctx.fillStyle = 'green';
        } else {
            ctx.fillStyle = 'red';
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '30px Creepster';
        ctx.fillText(Math.floor(this.vida), this.x +27, this.y + 25);
    }

    update() {
        if(this.disparo) {
            this.temp++;
            if(this.temp % 100 === 0) {
                balas.push(new Bala(this.x + 90, this.y + 35));
            }
        } else {
            this.temp = 0;
        }
    }
}