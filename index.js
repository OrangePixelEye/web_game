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
    static saveArray(info) {
        info.forEach((v, k) => {
            localStorage.setItem(k, v);
        });
    }
    static save(key, value) {
        localStorage.setItem(key, value);
    }
    static load(key) {
        return localStorage.getItem(key);
    }
}
class Player {
    constructor(ctx, control) {
        this.jump_force = 15.6;
        this.gravity = 0.6;
        this.vertical_speed = 0;
        this.is_colliding = false;
        this.ctx = ctx;
        this.direction = true;
        this.x = 50;
        this.y = 0;
        this.width = 30;
        this.height = 30;
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
        this.vertical_speed -= this.jump_force;
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
        this.y = this.randomY(this.height);
        this.speed = sp;
    }
    randomHeight() {
        // numbers positive = down
        // numbers negative = up
        return Math.floor(Math.random() * 51) + 10;
    }
    randomY(height) {
        return Math.floor((Math.random() > 0.5 ? 0 : -height)) + 250;
    }
}
class GroundBlock extends MoveableDrawable {
    constructor(c, x, y, w, h, color, s = 1.8) {
        super(c, x, y, w, h);
        this.color = "#" + color;
        this.speed = s;
        this.generateRandomObstacles();
    }
    // todo: fix this functon
    generateRandomObstacles() {
        let obs_n = Math.floor(Math.random() * (this.width / 50)) + 1;
        this.obs = [new Obstacles(this.ctx, 640, this.y + 10, 13, 15, "FFF", this.speed)];
        for (let i = 0; i < obs_n; i++) {
            this.obs.push(new Obstacles(this.ctx, this.chooseRandomPosition(), this.y + 10, 25, 1, "FFFF", this.speed));
        }
    }
    chooseRandomPosition() {
        return Math.floor(Math.random() * this.width) + this.x;
    }
    get obstacles() {
        return this.obs;
    }
    insideScreen() {
        // verify if its inside the screen		
        return (this.x > -this.width);
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
        this.canvas.id = "canvas";
        this.canvas.width = w;
        this.canvas.height = h;
        this.canvas.style.border = "1px solid #000";
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.ground_blocks = [new GroundBlock(this.ctx, 0, 240, 500, 20, "000")];
        this.obstacles = this.ground_blocks[0].obstacles;
        this.appendBlock(new GroundBlock(this.ctx, 570, 240, 100, 20, "ABC"));
        this.obstacles.concat(this.ground_blocks[1].obstacles);
        this.ctx.font = '50px serif';
        this._player = new Player(this.ctx, new Controls());
        this.state = GameState.playing;
        this.points = 0;
    }
    get player() {
        return this._player;
    }
    static detectCollision(a, b) {
        try {
            return !(((a.y + a.height) < (b.y)) || // colide em baixo
                (a.y > (b.y + b.height)) || // em cima
                ((a.x + a.width) < b.x) || // direita
                (a.x > (b.x + b.width)) // esquerda
            );
        }
        catch (_a) {
            throw "Bloco não encontrado";
        }
    }
    update() {
        this.points++;
        this.verifyCollisions();
        this.updateMap();
        this._player.update();
    }
    updateMap() {
        this.ground_blocks.forEach(element => {
            element.update();
            if (!element.insideScreen()) {
                // tem q tirar os obstaculos dps
                this.ground_blocks[0].obstacles.length;
                this.ground_blocks.shift();
                this.generateNewBlock();
            }
        });
        this.obstacles.forEach(e => e.update());
        // a colisão é sempre com o bloco atual
        this._player.is_colliding = Game.detectCollision(this._player, this.ground_blocks[0]);
    }
    generateNewBlock() {
        this.appendBlock(new GroundBlock(this.ctx, 350, 240, 100, 20, "ABC"));
        this.obstacles.concat(this.ground_blocks[1].obstacles);
    }
    verifyCollisions() {
        if (this.obstacles === undefined)
            return;
        this.obstacles.forEach(element => {
            if (Game.detectCollision(element, this._player))
                this.state = GameState.lose;
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
        this.drawGround();
        this._player.draw();
    }
    drawGround() {
        this.ground_blocks.forEach(element => {
            element.draw();
        });
    }
    main() {
        this.run();
    }
    run() {
        if (this.state != GameState.playing)
            return;
        this.update();
        this.draw();
        this.drawUI(this.state);
        // cria o loop
        window.requestAnimationFrame(() => this.run());
    }
    calculatePoints() {
        return this.roundUp(this.points / 90, 2);
    }
    // todo
    drawUI(state) {
        switch (state) {
            case GameState.playing:
                this.updateScreenPoints(this.points);
                break;
            case GameState.lose:
                this.gameOver();
                break;
            case GameState.ui:
                // não sei '-'
                break;
            default:
                throw "Undefined status";
        }
    }
    updateScreenPoints(points) {
        this.ctx.fillText(points.toString(), 255, 100);
    }
    gameOver() {
        // pause game
        window.cancelAnimationFrame(0);
        // todo: show lose screen
        UI.showUI(document.getElementById("game_over"), true);
        UI.showUI(document.getElementById("canvas"), false);
        // show info
        SaveSystem.save("points", this.points);
        document.getElementById('points').innerText = this.points.toString();
    }
    roundUp(num, precision) {
        precision = Math.pow(10, precision);
        return Math.ceil(num * precision) / precision;
    }
}
class Tutorial extends Game {
}
class UI {
    constructor() {
        this.btn_play = document.getElementById("p");
        this.btn_settings = document.getElementById("s");
        this.btn_options = document.getElementById("o");
        this.btn_credits = document.getElementById("c");
        this.configureUI();
    }
    configureUI() {
        this.btn_play.onclick = () => {
            UI.showUI(document.getElementById("allthethings"), false);
            start();
        };
    }
    static showUI(UI, show) {
        UI.style.display = show ? "" : "none";
    }
}
let u = new UI();
let gm;
function start() {
    gm = new Game(500, 500);
    gm.main();
}
//# sourceMappingURL=index.js.map