const cantidad = 20;

const sol = new Image();
sol.src = 'assets/sol.png';

export class Recurso {
    constructor(cellSize, ctx) {
        this.x = Math.random() * cellSize*2 + cellSize*4;
        this.y = (Math.floor(Math.random() * 1)) * cellSize + 25;
        this.width = cellSize;
        this.height = cellSize;
        this.cantidad = cantidad;
        this.velocidad = 0.9;
        this.ctx = ctx;
        this.img = sol;
    }

    update() {
        if(this.y <= this.height * 5) {
            this.y += this.velocidad;
        } else {
            this.velocidad = 0;
        }
        
    }

    draw() {
        this.ctx.font = '20px Creepster';
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}