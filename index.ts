/**
 * let img = document.getElementById("imgSource");
    ctx.drawImage(img, 50, 50);
 */
// tsc -w no terminal para watch

interface IDrawable{
    ctx : CanvasRenderingContext2D;
    x?: number
    y? : number
    height : number;
    width : number;
    update() : void;
    draw() : void;
}

enum GameState{
    playing,
    lose,
    ui,
}

abstract class MoveableDrawable implements IDrawable{
    ctx: CanvasRenderingContext2D;
    x?: number;
    y?: number;
    height: number;
    width: number;

    color ?: string;

    speed : number;

    constructor(c : CanvasRenderingContext2D, x: number, y: number, w: number, h : number, color ?: string) {
        this.ctx = c
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.color = color
    }

    update(): void {
        this.x -= this.speed
    }
    draw(): void {
        this.ctx.fillStyle = this.color == undefined ? "#FFF" : this.color
        this.ctx.fillRect(this.x,this.y, this.width, this.height)
    }

}

class Player implements IDrawable{
    ctx : CanvasRenderingContext2D;
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
    

    constructor(ctx : CanvasRenderingContext2D, control : Controls){
        this.ctx = ctx
        this.direction = true
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
        //- this.height  + this.height
        if ((this.y > 250 - this.height && this.direction) || (this.y < 250  && !this.direction)) {
            this.y = this.direction ? 240 - this.height : 260
            this.jump_count = 0;
        }
    }
    draw() : void {
        this.ctx.fillStyle = "#FA43D6"
        this.ctx.fillRect(this.x,this.y, this.width, this.height)
    }
    

    public jump(){
        this.speed = -this.jump_force
    }

    private invert(){
        this.direction = !this.direction;
    }
}

class Obstacles extends MoveableDrawable{
    constructor(c : CanvasRenderingContext2D, x: number, y: number, w: number, h : number, color ?: string) {
        super(c,x,y,w,h)
    }
}

class GroundBlock extends MoveableDrawable{
    color : string;
    obs : Obstacles[];
    speed : number;

    constructor(c : CanvasRenderingContext2D, x: number, y: number, w: number, h : number, color : string, s : number = 1)
    {
        super(c,x,y,w,h)
        this.color = "#" + color
        this.speed = s
        this.generateRandomObstacles()
    }

    generateRandomObstacles() : void{

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
    blocks : GroundBlock[]
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    height: number;
    width: number;

    constructor(h, w){
        this.height = h
        this.width = w
        this.canvas = document.createElement("canvas");
        
        this.canvas.width = w
        this.canvas.height = h
        this.canvas.style.border = "1px solid #000";
        
        this.ctx = this.canvas.getContext("2d")
        document.body.appendChild(this.canvas)
        this.blocks = [new GroundBlock(this.ctx, 0, 240, 500, 20,"000")]
    }
    
    public set player(pl : Player) {
        this._player = pl;
    } 

    // colocar com IDrawable
    isCollide(a : IDrawable, b : IDrawable) : boolean {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }
    
    update() : void {
        this.updateMap();
        
        this.blocks.forEach(element => {
            //if(!this.isCollide(this._player, element))   
            element.update()
        });
        this._player.update();
    }
    // manipular arquivo
    updateMap() : void{

    }

    appendBlock(b : GroundBlock)
    {
        this.blocks.push(b)
    }

    private draw_background() : void {
        this.ctx.fillStyle =  "#101EF2"
        this.ctx.fillRect(0, 0, 500, 500)
    }

    draw() : void {
        this.draw_background()
        this.blocks.forEach(element => {
            element.draw()
        });
        this._player.draw()
    }

    private getInput() : void{}

    public main() : void
    {
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

let gm = new Game(500, 500);

gm.player = new Player(gm.ctx, new Controls());

gm.main()
/*
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

 // desenhar chão*/