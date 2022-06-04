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
        this.can_jump = false;
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
        this.calcGravity();
        this.groundCollision();
        this.getInput();
    }
    draw() {
        this.ctx.fillStyle = "#FA43D6";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    jump() {
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
        if ((((this.y > 250 - this.height) && this.direction) ||
            ((this.y < 259) && !this.direction))) {
            if (this.is_colliding) {
                this.can_jump = true;
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
        return Math.floor(Math.random() * 41) + 20;
    }
    randomY(height) {
        return Math.floor((Math.random() > 0.5 ? 0 : -height)) + 250;
    }
}
class GroundBlock extends MoveableDrawable {
    constructor(c, x, y, w, h, color, s = 3.3) {
        super(c, x, y, w, h);
        this.color = "#" + color;
        this.speed = s;
        this.generateRandomObstacles();
    }
    // todo: fix this functon
    generateRandomObstacles() {
        let obs_ = Math.floor(Math.random() * 1) + 1;
        this.obs = [new Obstacles(this.ctx, (Math.floor(Math.random() * 13) + this.x + 45), this.y + 10, 13, 15, "FFF", this.speed)];
        /*
        for(let i = 0; i <  obs_; i++)
        {
            this.obs.push(new Obstacles(this.ctx, this.x, this.y + 10, 25, 1, "FFFF",this.speed))
        }*/
    }
    chooseRandomPosition(w) {
        return Math.floor(Math.random() * w);
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
        this.ctx.font = '50px serif';
    }
    init_game() {
        this.ground_blocks = [new GroundBlock(this.ctx, 0, 240, 500, 20, "000")];
        this.obstacles = this.ground_blocks[0].obstacles;
        this.appendBlock(new GroundBlock(this.ctx, 570, 240, 100, 20, "ABC"));
        this.obstacles = this.obstacles.concat(this.ground_blocks[1].obstacles);
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
        this._player.update();
        this.verifyCollisions();
        this.updateMap();
    }
    updateMap() {
        this.ground_blocks.forEach(element => {
            element.update();
            if (!element.insideScreen()) {
                // tem q tirar os obstaculos dps
                for (let i = 0; i < element.obstacles.length; i++)
                    this.obstacles.shift();
                this.ground_blocks.shift();
                this.generateNewBlock();
            }
        });
        this.obstacles.forEach(e => e.update());
        // a colisão é sempre com o bloco atual
        this._player.is_colliding = Game.detectCollision(this._player, this.ground_blocks[0]);
    }
    generateNewBlock() {
        // se baseia no width e position do anterior
        this.appendBlock(new GroundBlock(this.ctx, this.ground_blocks[this.ground_blocks.length - 1].x + 280, 240, (Math.floor(Math.random() * 190) + 50), 20, "FFF"));
        this.obstacles = this.obstacles.concat(this.ground_blocks[this.ground_blocks.length - 1].obstacles);
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
        let show_text = this.points.toString();
        // pause game
        window.cancelAnimationFrame(0);
        // todo: show lose screen
        UI.showUI(document.getElementById("game_over"), true);
        UI.showUI(document.getElementById("canvas"), false);
        // show info
        if (Number(SaveSystem.load("points")) < this.points) {
            SaveSystem.save("points", this.points);
            show_text += " é um novo record !";
        }
        document.getElementById('points').innerText = show_text;
    }
    roundUp(num, precision) {
        precision = Math.pow(10, precision);
        return Math.ceil(num * precision) / precision;
    }
}
class UI {
    constructor() {
        this.btn_play = document.getElementById("p");
        this.btn_settings = document.getElementById("s");
        this.btn_options = document.getElementById("o");
        this.btn_credits = document.getElementById("c");
        this.btn_play_again = document.getElementById("play_again");
        UI.showUI(document.getElementById("canvas"), false);
        this.configureUI();
    }
    configureUI() {
        this.btn_play.onclick = () => {
            UI.showUI(document.getElementById("allthethings"), false);
            UI.showUI(document.getElementById("canvas"), true);
            start();
        };
        this.btn_play_again.onclick = () => {
            UI.showUI(document.getElementById("game_over"), false);
            UI.showUI(document.getElementById("canvas"), true);
            start();
        };
    }
    static showUI(UI, show) {
        UI.style.display = show ? "" : "none";
    }
}
let gm;
gm = new Game(500, 500);
gm.state = GameState.playing;
let u = new UI();
function start() {
    gm.init_game();
    gm.main();
}
//# sourceMappingURL=index.js.map