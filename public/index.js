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
        this.btn_settings = document.getElementById("settings");
        this.btn_credits = document.getElementById("c");
        this.btn_exit = document.getElementById("e");
        this.btn_menu = document.getElementById("menu");
        this.btn_play_again = document.getElementById("play_again");
        this.btn_back_to_menu = document.getElementsByName("back_menu");
        UI.showUI(document.getElementById("canvas"), false);
        this.configureUI();
    }
    configureUI() {
        this.btn_settings.onclick = () => {
            UI.showMenu("allthethings", "ui-settings");
        };
        this.btn_credits.onclick = () => {
            UI.showMenu("allthethings", "ui-credits");
        };
        this.btn_play.onclick = () => {
            UI.showMenu("allthethings", "canvas");
            start();
        };
        this.btn_play_again.onclick = () => {
            UI.showMenu("game_over", "canvas");
            start();
        };
        this.btn_menu.onclick = () => {
            UI.showMenu("game_over", "allthethings");
        };
        this.btn_exit.onclick = () => {
            close();
        };
        this.btn_back_to_menu.forEach((e) => {
            e.onclick = event => {
                let name = "ui-";
                name += event.target.dataset.screen;
                UI.showMenu(name, "allthethings");
            };
        });
    }
    static showUI(UI, show) {
        UI.style.display = show ? "" : "none";
    }
    static showMenu(old_screen, new_screen) {
        UI.showUI(document.getElementById(old_screen), false);
        UI.showUI(document.getElementById(new_screen), true);
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
function openMenu(event) {
    console.log(event);
    //UI.showMenu(menu)
}
//# sourceMappingURL=index.js.map