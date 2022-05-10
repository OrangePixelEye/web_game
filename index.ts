/**
 * let img = document.getElementById("imgSource");
    ctx.drawImage(img, 50, 50);
 */

interface IDrawable{
    update() : void;
    draw() : void;
}

enum GameState{
    playing,
    lose,
    ui,
}

class Player implements IDrawable{
    x: number;
    y: number;
    height : number;
    width : number;
    direction : boolean;
    jump_force = 23.6;

    constructor(){

    }
    update() : void {
        throw new Error("Method not implemented.");
    }
    draw() : void {
        throw new Error("Method not implemented.");
    }

    public jump(){

    }

    private invert(){

    }
}

class Block implements IDrawable{
    update(): void {
        throw new Error("Method not implemented.");
    }
    draw(): void {
        throw new Error("Method not implemented.");
    }

}

class ManipulateFile
{
    createBlock() : Block {
        return new Block();
    }
}

class Game implements IDrawable{
    state : GameState;
    player : Player;
    blocks : Block[];
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;

    constructor(){
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")
        document.body.appendChild(this.canvas)
    }
    
    update() : void {
        this.updateMap();
        this.player.update();
        this.blocks.forEach(element => {
            element.update()
        });
    }
    // manipular arquivo
    updateMap() : void{

    }

    draw() : void {
        this.player.draw()
        this.blocks.forEach(element => {
            element.draw()
        });
    }

    private configureScreen() : void{

    }

    // todo: pegar baseado no código de raycasting
    private configureInput() : void{}
    private getInput() : void{}

    public main() : void
    {
        this.configureScreen();
        this.configureInput();
        this.run();
    }
    public run( ) : void
    {
        this.update();

        // images
        this.getInput();
        this.draw();
    }
}