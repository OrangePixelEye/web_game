"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.GameState = void 0;
const SaveSystem_1 = require("../save/SaveSystem");
const Player_1 = require("../player/Player");
const GroundBlocks_1 = require("../ground_blocks/GroundBlocks");
const Controls_1 = require("../controls/Controls");
const index_1 = require("../../../public/index");
var GameState;
(function (GameState) {
    GameState[GameState["playing"] = 0] = "playing";
    GameState[GameState["lose"] = 1] = "lose";
    GameState[GameState["ui"] = 2] = "ui";
})(GameState = exports.GameState || (exports.GameState = {}));
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
        this.ground_blocks = [new GroundBlocks_1.GroundBlock(this.ctx, 0, 240, 500, 20, "000")];
        this.obstacles = this.ground_blocks[0].obstacles;
        this.appendBlock(new GroundBlocks_1.GroundBlock(this.ctx, 570, 240, 100, 20, "ABC"));
        this.obstacles = this.obstacles.concat(this.ground_blocks[1].obstacles);
        this._player = new Player_1.Player(this.ctx, new Controls_1.Controls());
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
        this.appendBlock(new GroundBlocks_1.GroundBlock(this.ctx, this.ground_blocks[this.ground_blocks.length - 1].x + 280, 240, (Math.floor(Math.random() * 190) + 50), 20, "FFF"));
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
        index_1.UI.showUI(document.getElementById("game_over"), true);
        index_1.UI.showUI(document.getElementById("canvas"), false);
        // show info
        if (Number(SaveSystem_1.SaveSystem.load("points")) < this.points) {
            SaveSystem_1.SaveSystem.save("points", this.points);
            show_text += " é um novo record !";
        }
        document.getElementById('points').innerText = show_text;
    }
    roundUp(num, precision) {
        precision = Math.pow(10, precision);
        return Math.ceil(num * precision) / precision;
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map