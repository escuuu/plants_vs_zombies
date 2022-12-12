export class Zombie {
    constructor(PosicionVertical, canvas_width){
        this.x = canvas_width;
        this.y = PosicionVertical;
        this.width = cellSize - cell * 2;
        this.height = cellSize - cell * 2;
        this.velocidad = Math.random() * 0.1 + 0.2;
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
        ctx.font = '30px Creepster';
        ctx.fillText(Math.floor(this.vida), this.x +27, this.y + 25);
    }
}