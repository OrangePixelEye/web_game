"use strict";
/**
 * let img = document.getElementById("imgSource");
    ctx.drawImage(img, 50, 50);
 */
// tsc -w no terminal para watch ctrl shift b watch
// npx webpack serve
Object.defineProperty(exports, "__esModule", { value: true });
exports.UI = void 0;
const Game_1 = require("../src/model/game/Game");
class UI {
    constructor() {
        this.btn_play = document.getElementById("p");
        this.btn_settings = document.getElementById("s");
        this.btn_options = document.getElementById("o");
        this.btn_credits = document.getElementById("c");
        this.btn_exit = document.getElementById("exit");
        this.btn_menu = document.getElementById("menu");
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
        this.btn_menu.onclick = () => {
            UI.showUI(document.getElementById("game_over"), false);
            UI.showUI(document.getElementById("allthethings"), true);
        };
        this.btn_exit.onclick = () => {
            close();
        };
    }
    static showUI(UI, show) {
        UI.style.display = show ? "" : "none";
    }
}
exports.UI = UI;
let gm;
gm = new Game_1.Game(500, 500);
gm.state = Game_1.GameState.playing;
let u = new UI();
function start() {
    gm.init_game();
    gm.main();
}
//# sourceMappingURL=index.js.map