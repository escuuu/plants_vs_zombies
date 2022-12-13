const tiposZombies = [];
const zombie1 = new Image();
zombie1.src = 'assets/Zombies/zombie_andando.png';
tiposZombies.push(zombie1);

export class Zombie {
    constructor(PosicionVertical, canvas_width, cellSize, cell){
        this.x = canvas_width;
        this.y = PosicionVertical;
        this.width = cellSize - cell * 2;
        this.height = cellSize - cell * 2;
        this.velocidad = Math.random() * 0.1 + 0.3;
        this.movimiento = this.velocidad;
        this.vida = 200;
        this.vidaMax = this.vida;
        this.tipo = tiposZombies[0];
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 17;
        this.spriteWidth = 82;
        this.spriteHeigth = 128;
    }

    update(frame) {
        this.x -= this.movimiento;
        if(frame % 10 === 0) {
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }
    }

    draw() {
        ctx.font = '30px Creepster';
        ctx.fillText(Math.floor(this.vida), this.x + 20, this.y - 10);
        ctx.drawImage(this.tipo, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.x, this.y, this.width, this.height + 15);
    }
}