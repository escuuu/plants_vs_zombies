const cantidad = 20;

const sol = new Image();
sol.src = 'assets/sol.png';

export class Recurso {
    constructor(cellSize, ctx) {
        this.x = Math.random() * cellSize*2 + cellSize*4;
        this.y = (Math.floor(Math.random() * 1)) * cellSize + 25;
        this.width = cellSize * 0.8;
        this.height = cellSize * 0.8;
        this.cantidad = cantidad;
        this.velocidad = 0.9;
        this.ctx = ctx;
        this.img = sol;
    }

    update() {
        this.y += this.velocidad;
    }

    draw() {
        this.ctx.font = '20px Creepster';
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}