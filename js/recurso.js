const cantidad = 20;

export class Recurso {
    constructor(cellSize, ctx) {
        this.x = Math.random() * cellSize*2 + cellSize*4;
        this.y = (Math.floor(Math.random() * 1)) * cellSize + 25;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        this.cantidad = cantidad;
        this.velocidad = 0.5;
        this.ctx = ctx;
    }

    update() {
        this.y += this.velocidad;
    }

    draw() {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Creepster';
        this.ctx.fillText(this.cantidad, this.x + 15, this.y + 25);
    }
}