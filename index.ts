/**
 * let img = document.getElementById("imgSource");
    ctx.drawImage(img, 50, 50);
 */
// tsc -w no terminal para watch

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
    controls : Controls;
    jump_force = 23.6;
    jump_count = 0;
    gravity = 1.6;
    speed = 0;
    ctx : CanvasRenderingContext2D;

    constructor(ctx : CanvasRenderingContext2D, control : Controls){
        this.ctx = ctx
        this.x =50
        this.y = 0
        this.width = 50
        this.height = 50
        this.controls = control
    }
    update() : void {
        if (this.controls.states.forward) this.jump();
        if (this.controls.states.left) this.invert();

        this.speed += this.gravity;
        this.y = (this.direction ? this.y + this.speed : this.y - this.speed)

        if ((this.y > 250 && this.direction) || (this.y < 250 && !this.direction)) {
            this.y = 250; //- this.height
            this.jump_count = 0;
        }
    }
    draw() : void {
        this.ctx.fillStyle = "#FA43D6"
        this.ctx.fillRect(this.x,this.y, this.height, this.width)
    }

    public jump(){
        this.speed = -this.jump_force
    }

    private invert(){
        this.direction = !this.direction;
    }
}

class Block implements IDrawable{
    x : number;
    y : number;
    sprite : any; 
    update(): void {
        
    }
    draw(): void {
        
    }

}

class ManipulateFile
{
    block_types : Map<string, any>;
    createBlock() : Block {
        return new Block();
    }
    convertTextToBlock(str : string) : void{
        let temp = str.split('');
        temp.map((v) => {
            
        })
    }
    appendBlockType(str : string,  spr : any) : void
    {
        this.block_types.set(str, spr)
    }
}

class Controls{
    codes : any;
    public states : any;

    constructor(){
        this.codes  = { 37: 'left', 38: 'forward', 40: 'backward' };
        this.states = { 'left': false, 'forward': false, 'backward': false };
        document.addEventListener('keydown', this.onKey.bind(this, true), false);
        document.addEventListener('keyup', this.onKey.bind(this, false), false);
    }

    onKey(val : Function, e : any){
        var state = this.codes[e.keyCode];
        if (typeof state === 'undefined') return;
        this.states[state] = val;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
    }
}

class Game implements IDrawable{
    state : GameState;
    private _player : Player;
    blocks : Block[];
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;

    constructor(){
        this.canvas = document.createElement("canvas");
        
        this.canvas.width = 500
        this.canvas.height = 500
        this.canvas.style.border = "1px solid #000";
        
        this.ctx = this.canvas.getContext("2d")
        document.body.appendChild(this.canvas)
    }
    
    public set player(pl : Player) {
        this._player = pl;
        
    } 
    
    update() : void {
        this.updateMap();
        this._player.update();
        /*this.blocks.forEach(element => {
            element.update()
        });*/
    }
    // manipular arquivo
    updateMap() : void{

    }

    private draw_background() : void {
        this.ctx.fillStyle =  "#101EF2"
        this.ctx.fillRect(0, 0, 500, 500)
    }

    draw() : void {
        this.draw_background()
        this._player.draw()
        /*this.blocks.forEach(element => {
            element.draw()
        });*/
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

    public run() : void
    {
        this.update();
        this.draw();
        
        // cria o loop
        window.requestAnimationFrame(() => this.run())
        // images
        this.getInput();
    }
}

let gm = new Game();

gm.player = new Player(gm.ctx, new Controls());

gm.main()

let t = new ManipulateFile();
var filePath = '/mapa.json';

$.getJSON(filePath, function( data ) {
  $.each( data, function( key, val ) {
    console.log(val['country']);
  });
});

$.get('map.txt', function(data) {
    console.log(typeof(data) );
 }, 'text');