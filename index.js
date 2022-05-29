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
class MoveableDrawable {
    constructor(c, x, y, w, h, color) {
        this.ctx = c;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color;
        if (this.color === undefined)
            this.color = "#FFFFFF";
    }
    update() {
        this.x -= this.speed;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class SaveSystem {
    // local storage
    static save(info) {
        info.forEach((v, k) => {
            localStorage.setItem(k, v);
        });
    }
    static load(key) {
        return localStorage.getItem(key);
    }
}
class Player {
    constructor(ctx, control) {
        this.jump_force = 23.6;
        this.gravity = 0.6;
        this.vertical_speed = 0;
        this.is_colliding = false;
        this.ctx = ctx;
        this.direction = true;
        this.x = 50;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.controls = control;
    }
    update() {
        this.getInput();
        this.calcGravity();
        this.groundCollision();
    }
    draw() {
        this.ctx.fillStyle = "#FA43D6";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    jump() {
        // trava o pulo para apenas colisão
        if (this.is_colliding)
            this.vertical_speed = -this.jump_force;
    }
    invert() {
        this.direction = !this.direction;
    }
    getInput() {
        if (this.controls.states.forward)
            this.jump();
        if (this.controls.states.left)
            this.invert();
    }
    calcGravity() {
        this.vertical_speed += this.gravity;
        this.y = (this.direction ? this.y + this.vertical_speed : this.y - this.vertical_speed);
    }
    groundCollision() {
        if (((this.y > 250 - this.height && this.direction) ||
            (this.y < 250 && !this.direction))) {
            if (this.is_colliding) {
                this.y = this.direction ? 240 - this.height : 260;
            }
        }
        if (this.y > 300 && this.direction)
            this.invert();
        if (this.y < 200 && !this.direction)
            this.invert();
    }
}
class Obstacles extends MoveableDrawable {
    constructor(c, x, y, w, h = 0, color, sp) {
        super(c, x, y, w, h);
        this.height = this.randomHeight();
        this.speed = sp;
    }
    // do some math '-' and generate + and - obstacles
    randomHeight() {
        return Math.floor(Math.random() * 255) - 255;
    }
}
class GroundBlock extends MoveableDrawable {
    constructor(c, x, y, w, h, color, s = 1) {
        super(c, x, y, w, h);
        this.color = "#" + color;
        this.speed = s;
        this.generateRandomObstacles();
    }
    generateRandomObstacles() {
        let obs_n = Math.floor(Math.random() * (this.width / 50)) + 1;
        this.obs = [new Obstacles(this.ctx, 640, this.y, 135, 15, "FFF", this.speed)];
        console.log(this.obs[0]);
        for (let i = 0; i < obs_n; i++) {
            this.obs.push(new Obstacles(this.ctx, this.chooseRandomPosition(), this.y, 25, 1, "FFFF", this.speed));
        }
    }
    chooseRandomPosition() {
        return Math.floor(Math.random() * this.width) + this.x;
    }
    get obstacles() {
        return this.obs;
    }
    update() {
        super.update();
    }
    insideScreen() {
        // verify if its inside the screen
        return (this.x > -510);
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
    constructor(h, w) {
        this.height = h;
        this.width = w;
        this.canvas = document.createElement("canvas");
        this.canvas.width = w;
        this.canvas.height = h;
        this.canvas.style.border = "1px solid #000";
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.ground_blocks = [new GroundBlock(this.ctx, 0, 240, 500, 20, "000")];
        this.obstacles = this.ground_blocks[0].obstacles;
        this.appendBlock(new GroundBlock(this.ctx, 630, 240, 100, 20, "ABC"));
        this.obstacles.concat(this.ground_blocks[1].obstacles);
        this._player = new Player(this.ctx, new Controls());
        console.log(this.obstacles.length);
    }
    get player() {
        return this._player;
    }
    static detectCollision(a, b) {
        try {
            return !(((a.y + a.height) < (b.y)) ||
                (a.y > (b.y + b.height)) ||
                ((a.x + a.width) < b.x) ||
                (a.x > (b.x + b.width)));
        }
        catch (_a) {
            throw "Bloco não encontrado";
        }
    }
    update() {
        this.verifyCollisions();
        this.updateMap();
        this._player.update();
    }
    updateMap() {
        this.ground_blocks.forEach(element => {
            element.update();
        });
        this.obstacles.forEach(e => e.update());
        // a colisão é sempre com o bloco atual
        this._player.is_colliding = Game.detectCollision(this._player, this.ground_blocks[0]);
        if (!this.ground_blocks[0].insideScreen())
            this.ground_blocks.shift();
    }
    verifyCollisions() {
        if (this.obstacles === undefined)
            return;
        this.obstacles.forEach(element => {
            if (Game.detectCollision(this._player, element))
                this.gameOver();
        });
    }
    appendBlock(b) {
        this.ground_blocks.push(b);
    }
    draw_background() {
        this.ctx.fillStyle = "#101EF2";
        this.ctx.fillRect(0, 0, 500, 500);
    }
    draw() {
        this.draw_background();
        this.obstacles.forEach(e => e.draw());
        this.ground_blocks.forEach(element => {
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
    gameOver() {
    }
}
class Tutorial extends Game {
}
let gm = new Game(500, 500);
//gm.player = 
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