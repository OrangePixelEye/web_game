/**
 * let img = document.getElementById("imgSource");
    ctx.drawImage(img, 50, 50);
 */
// tsc -w no terminal para watch

// todo: styles
// todo: complete a save
// todo: tutorial
// todo: level generation


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
        if(this.color === undefined) this.color = "#FFFFFF"
    }

    update(): void {
        this.x -= this.speed
    }
    draw(): void {
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.x,this.y, this.width, this.height)
    }

}

abstract class SaveSystem{
    // local storage
    public static save(info : Map<string, string>) : void{
        info.forEach((v, k) => {
            localStorage.setItem(k,v)
        });
    }

    public static load(key : string) : string{
        return localStorage.getItem(key)
    }
}

class Player implements IDrawable{
    ctx : CanvasRenderingContext2D;
    x: number;
    y: number;
    height : number;
    width : number;

    private direction : boolean;
    private controls : Controls;
    private jump_force = 23.6;
    private gravity = 0.6;
    private vertical_speed = 0;

    public is_colliding : boolean = false;
    
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
        this.getInput();
        
        this.calcGravity();
        this.groundCollision();
    }
    draw() : void {
        this.ctx.fillStyle = "#FA43D6"
        this.ctx.fillRect(this.x,this.y, this.width, this.height)
    }
    
    public jump() : void {
        // trava o pulo para apenas colisão
        if(this.is_colliding)
            this.vertical_speed = -this.jump_force
    }

    private invert() : void {
        this.direction = !this.direction;
    }

    private getInput() : void {
        if (this.controls.states.forward) this.jump();
        if (this.controls.states.left) this.invert();
    }

    private calcGravity() : void {
        this.vertical_speed += this.gravity;
        this.y = (this.direction ? this.y + this.vertical_speed : this.y - this.vertical_speed)
    }

    private groundCollision() :void {
        if (
            ((this.y > 250 - this.height && this.direction) || 
            (this.y < 250  && !this.direction))
            ) {
                if(this.is_colliding){
                    this.y = this.direction ? 240 - this.height : 260

                }
        }
        if(this.y > 300 && this.direction) this.invert()
        if(this.y < 200 && !this.direction) this.invert()
        
    }
    
}

class Obstacles extends MoveableDrawable{
    constructor(c : CanvasRenderingContext2D, x: number, y: number, w: number, h : number = 0, color : string, sp: number) {
        super(c,x,y,w,h)
        this.height = this.randomHeight()
        this.speed = sp
    }

    // do some math '-' and generate + and - obstacles
    public randomHeight() : number
    {
        return Math.floor(Math.random() * 255) - 255;
    }
}

class GroundBlock extends MoveableDrawable{
    color : string;
    private obs : Obstacles[];
    speed : number;

    constructor(c : CanvasRenderingContext2D, x: number, y: number, w: number, h : number, color : string, s : number = 1)
    {
        super(c,x,y,w,h)
        this.color = "#" + color
        this.speed = s
        this.generateRandomObstacles()
    }

    private generateRandomObstacles() : void{
        let obs_n = Math.floor(Math.random() * (this.width / 50)) + 1;
        
        this.obs = [new Obstacles(this.ctx, 640, this.y, 135, 15, "FFF",this.speed)]
        console.log(this.obs[0])
        for(let i = 0; i < obs_n; i++)
        {
            this.obs.push(new Obstacles(this.ctx,this.chooseRandomPosition(), this.y, 25, 1, "FFFF",this.speed))
        }
    }

    private chooseRandomPosition() : number{
        return Math.floor(Math.random() * this.width) + this.x;
    }

    public get obstacles()
    {
        return this.obs;
    }

    update(): void {
        super.update()
    }

    public insideScreen() : boolean {
        // verify if its inside the screen
        return (this.x > -510)
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
    ground_blocks : GroundBlock[]
    obstacles : MoveableDrawable[]
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    height: number;
    width: number;
    points : number;

    constructor(h, w){
        this.height = h
        this.width = w
        this.canvas = document.createElement("canvas");
        
        this.canvas.width = w
        this.canvas.height = h
        this.canvas.style.border = "1px solid #000";
        
        this.ctx = this.canvas.getContext("2d")
        document.body.appendChild(this.canvas)
        
        this.ground_blocks = [new GroundBlock(this.ctx, 0, 240, 500, 20,"000")]
        this.obstacles = this.ground_blocks[0].obstacles;
        
        this.appendBlock(new GroundBlock( this.ctx, 630, 240 , 100,20, "ABC"))
        this.obstacles.concat(this.ground_blocks[1].obstacles)
        
        
        
        this._player = new Player(this.ctx, new Controls());
        this.points = 0
    }

    public get player()
    {
        return this._player;
    }

    public static detectCollision(a : IDrawable, b : IDrawable) : boolean {
        try{
            return !(
                ((a.y + a.height) < (b.y)) ||
                (a.y > (b.y + b.height)) ||
                ((a.x + a.width) < b.x) ||
                (a.x > (b.x + b.width))
            );
        }
        catch{
            throw "Bloco não encontrado"
        }
    }
    
    update() : void {
        this.points++;
        this.verifyCollisions();
        this.updateMap();
           
        this._player.update();
    }
    updateMap() : void{
        this.ground_blocks.forEach(element => {
            element.update()
        });
        this.obstacles.forEach(e => e.update());

        // a colisão é sempre com o bloco atual
        this._player.is_colliding = Game.detectCollision(this._player, this.ground_blocks[0])
        if(!this.ground_blocks[0].insideScreen())  this.ground_blocks.shift() 
    }

    verifyCollisions() : void{
        if(this.obstacles === undefined) return;
        this.obstacles.forEach(element => {
            if(Game.detectCollision(this._player, element))
                this.gameOver()
        });
    }

    appendBlock(b : GroundBlock)
    {
        this.ground_blocks.push(b)
    }

    private draw_background() : void {
        this.ctx.fillStyle =  "#101EF2"
        this.ctx.fillRect(0, 0, 500, 500)
    }

    draw() : void {
        this.draw_background()
        this.obstacles.forEach(e => e.draw())

        this.ground_blocks.forEach(element => {
            element.draw()
        });
        this._player.draw()
    }


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
    }

    public calculatePoints() : number{
    
        return this.roundUp(this.points/90, 2)
    }

    private gameOver() : void{
        // todo
    }

    private roundUp(num : number, precision : number) : number{
        precision = Math.pow(10, precision)
        return Math.ceil(num * precision) / precision
    }
}

class Tutorial extends Game{

}

let gm = new Game(500, 500);

//gm.player = 

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