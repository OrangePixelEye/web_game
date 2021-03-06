"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.GameState = void 0;
const SaveSystem_1 = require("../save/SaveSystem");
const Player_1 = require("../player/Player");
const GroundBlocks_1 = require("../ground_blocks/GroundBlocks");
const Controls_1 = require("../controls/Controls");
const index_1 = require("../../../docs/index");
var GameState;
(function (GameState) {
    GameState[GameState["playing"] = 0] = "playing";
    GameState[GameState["lose"] = 1] = "lose";
})(GameState = exports.GameState || (exports.GameState = {}));
class Game {
    constructor(h, w, music) {
        this.appendBlock = (b) => this.ground_blocks.push(b);
        this.main = () => this.run();
        this.calculatePoints = () => this.roundUp(this.points / 90, 2);
        this.height = h;
        this.width = w;
        this.canvas = document.createElement("canvas");
        this.canvas.id = "canvas";
        this.canvas.width = w;
        this.canvas.height = h;
        this.canvas.style.border = "1px solid #000";
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.ctx.font = '35px serif';
        this.music_player = music;
        this.bg = document.getElementById("bg");
    }
    init_game() {
        this.ground_blocks = [new GroundBlocks_1.GroundBlock(this.ctx, 0, 240, 500, 20, "ABC")];
        this.high_score = SaveSystem_1.SaveSystem.load("points");
        this.obstacles = this.ground_blocks[0].obstacles;
        this.appendBlock(new GroundBlocks_1.GroundBlock(this.ctx, 570, 240, 100, 20, "ABC"));
        this.obstacles = this.obstacles.concat(this.ground_blocks[1].obstacles);
        this._player = new Player_1.Player(this.ctx, new Controls_1.Controls());
        this.state = GameState.playing;
        this.points = 0;
        this.music_player.play();
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
            throw "Bloco n??o encontrado";
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
        // a colis??o ?? sempre com o bloco atual
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
    draw_background() {
        //this.ctx.fillStyle =  "#101EF2"
        //this.ctx.fillRect(0, 0, 500, 500)
        this.ctx.drawImage(this.bg, 0, 0, 500, 500);
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
    run() {
        if (this.state != GameState.playing)
            return;
        this.update();
        this.draw();
        this.drawUI(this.state);
        // cria o loop
        window.requestAnimationFrame(() => this.run());
    }
    // todo
    drawUI(state) {
        switch (state) {
            case GameState.playing:
                this.updateScreenPoints(this.points);
                this.showHighscore();
                break;
            case GameState.lose:
                this.gameOver();
                break;
            default:
                throw "Undefined status";
        }
    }
    showHighscore() {
        this.ctx.fillStyle = "orange";
        this.ctx.fillText("HI:  " + this.high_score, 25, 40);
    }
    updateScreenPoints(points) {
        this.ctx.fillStyle = "orange";
        this.ctx.fillText(points.toString(), 25, 90);
    }
    gameOver() {
        let show_text = this.points.toString();
        // pause game
        window.cancelAnimationFrame(0);
        index_1.UI.showMenu("canvas", "game_over");
        // show info
        if (Number(SaveSystem_1.SaveSystem.load("points")) < this.points) {
            SaveSystem_1.SaveSystem.save("points", this.points);
            show_text += " ?? um novo record !";
        }
        document.getElementById('points').innerText = show_text;
        this.music_player.stop();
    }
    roundUp(num, precision) {
        precision = Math.pow(10, precision);
        return Math.ceil(num * precision) / precision;
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map