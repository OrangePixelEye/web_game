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
        this.x = 50;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.controls = control;
        this.direction = true;
    }
    update() {
        if (this.controls.states.forward)
            this.jump();
        this.speed += this.gravity;
        this.y = (this.direction ? this.y + this.speed : this.y - this.speed)

        if ((this.y > 250 && this.direction) || (this.y < 250 && !this.direction)) {
            this.y = 250; //- this.height
            this.jump_count = 0;
        }
    }
    draw() {
        this.ctx.fillStyle = "#FA43D6";
        this.ctx.fillRect(this.x, this.y, this.height, this.width);
    }
    jump() {
        this.speed = -this.jump_force;
    }
    invert() {
        this.direction = !this.direction;
    }
}
class Block {
    update() {
    }
    draw() {
    }
}
class ManipulateFile {
    createBlock() {
        return new Block();
    }
    
}
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
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.canvas.style.border = "1px solid #000";
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
    }
    set player(pl) {
        this._player = pl;
    }
    update() {
        this.updateMap();
        this._player.update();
        /*this.blocks.forEach(element => {
            element.update()
        });*/
    }
    // manipular arquivo
    updateMap() {
    }
    draw_background() {
        this.ctx.fillStyle = "#101EF2";
        this.ctx.fillRect(0, 0, 500, 500);
    }
    draw() {
        this.draw_background();
        this._player.draw();
        /*this.blocks.forEach(element => {
            element.draw()
        });*/
    }
    configureScreen() {
    }
    // todo: pegar baseado no código de raycasting
    configureInput() { }
    getInput() { }
    main() {
        this.configureScreen();
        this.configureInput();
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
let gm = new Game();
gm.player = new Player(gm.ctx, new Controls());
gm.main();

//let t = new ManipulateFile().readFile();
var filePath = '/mapa.json';

$.getJSON(filePath, function( data ) {
  $.each( data, function( key, val ) {
    console.log(val['country']);
  });
});

$.get('map.txt', function(data) {
    console.log(typeof(data) );
 }, 'text');
//# sourceMappingURL=index.js.map