"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SaveSystem_1 = require("../src/model/save/SaveSystem");
class MusicPlayer {
    constructor() {
        this.playing_music = new Audio('./music.wav');
    }
    play() {
        const vol = Number(SaveSystem_1.SaveSystem.load('volume'));
        this.playing_music.volume = (vol == NaN ? 1 : vol);
        this.playing_music.loop = true;
        this.playing_music.play();
    }
    stop() {
        this.playing_music.pause();
    }
}
exports.default = MusicPlayer;
//# sourceMappingURL=Music.js.map