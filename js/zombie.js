const tiposZombies = [];
const tiposZombiesComiendo = [];
const zombie1 = new Image();
const zombie1Comiendo = new Image(); 
zombie1.src = 'assets/Zombies/zombie_andando.png';
zombie1Comiendo.src = 'assets/Zombies/zombie_comiendo.png';
tiposZombies.push(zombie1);
tiposZombiesComiendo.push(zombie1Comiendo);

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
        this.comer = false;
        this.tipoComiendo = tiposZombiesComiendo[0];
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
        if(this.comer == false) {
            if(frame % 10 === 0) {
                if(this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = this.minFrame;
            }
        } else {
            if(frame % 5 === 0) {
                if(this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = this.minFrame;
            }
        }
    }

    draw() {
        if(this.comer == false) {

            this.maxFrame = 17;
            this.spriteWidth = 82;
            this.spriteHeigth = 128;
            ctx.drawImage(this.tipo, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.x, this.y, this.width, this.height + 15);

        } else {

            this.maxFrame = 65;
            this.spriteWidth = 129;
            this.spriteHeigth = 168;

            ctx.drawImage(this.tipoComiendo, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, this.x, this.y - 10, this.width, this.height + 30);
        }
        
    }
}