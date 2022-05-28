/**
 * let img = document.getElementById("imgSource");
    ctx.drawImage(img, 50, 50);
 */
// tsc -w no terminal para watch
var GameState;
(function (GameState) {
    GameState[GameState["playing"] = 0] = "playing";
    GameState[GameState["lose"] = 1] = "lose";
    GameState[GameState["ui"] = 2] = "ui";
})(GameState || (GameState = {}));
class Player {
    constructor(ctx, control) {
        this.jump_force = 23.6;
        this.jump_count = 0;
        this.gravity = 1.6;
        this.speed = 0;
        this.ctx = ctx;
        this.direction = true;
        this.x = 50;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.controls = control;
    }
    update() {
        if (this.controls.states.forward)
            this.jump();
        if (this.controls.states.left)
            this.invert();
        this.speed += this.gravity;
        this.y = (this.direction ? this.y + this.speed : this.y - this.speed);
        //- this.height  + this.height
        if ((this.y > 250 - this.height && this.direction) || (this.y < 250 && !this.direction)) {
            this.y = this.direction ? 240 - this.height : 260;
            this.jump_count = 0;
        }
    }
    draw() {
        this.ctx.fillStyle = "#FA43D6";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    jump() {
        this.speed = -this.jump_force;
    }
    invert() {
        this.direction = !this.direction;
    }
}
class Block {
    constructor(c, x, y, w, h, color) {
        this.ctx = c;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = "#" + color;
    }
    update() {
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
/*
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
}*/
class Controls {
    constructor() {
        this.codes = { 37: 'left', 38: 'forward', 40: 'backward' };
        this.states = { 'left': false, 'forward': false, 'backward': false };
        document.addEventListener('keydown', this.onKey.bind(this, true), false);
        document.addEventListener('keyup', this.onKey.bind(this, false), false);
    }
    onKey(val, e) {
        var state = this.codes[e.keyCode];
        if (typeof state === 'undefined')
            return;
        this.states[state] = val;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
    }
}
class Game {
    constructor(h, w) {
        this.height = h;
        this.width = w;
        this.canvas = document.createElement("canvas");
        this.canvas.width = w;
        this.canvas.height = h;
        this.canvas.style.border = "1px solid #000";
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.blocks = [new Block(this.ctx, 0, 240, 500, 20, "000")];
    }
    set player(pl) {
        this._player = pl;
    }
    // colocar com IDrawable
    isCollide(a, b) {
        return !(((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width)));
    }
    update() {
        this.updateMap();
        this.blocks.forEach(element => {
            //if(!this.isCollide(this._player, element))
            element.update();
        });
        this._player.update();
    }
    // manipular arquivo
    updateMap() {
    }
    appendBlock(b) {
        this.blocks.push(b);
    }
    draw_background() {
        this.ctx.fillStyle = "#101EF2";
        this.ctx.fillRect(0, 0, 500, 500);
    }
    draw() {
        this.draw_background();
        this.blocks.forEach(element => {
            element.draw();
        });
        this._player.draw();
    }
    getInput() { }
    main() {
        this.run();
    }
    run() {
        this.update();
        this.draw();
        // cria o loop
        window.requestAnimationFrame(() => this.run());
        // images
        this.getInput();
    }
}
let gm = new Game(500, 500);
gm.player = new Player(gm.ctx, new Controls());
gm.main();
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
//# sourceMappingURL=index.js.map