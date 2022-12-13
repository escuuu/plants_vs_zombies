const guisante = new Image();
guisante.src = 'assets/Plantas/guisante.png';

export class Bala {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 23;
        this.height = 23;
        this.poder = 20;
        this.velocidad = 5;
        this.img = guisante;
    }

    update() {
        this.x += this.velocidad;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y - 17, this.width, this.height);
    }
}