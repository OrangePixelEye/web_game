"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MusicPlayer {
    constructor() {
        this.playing_music = new Audio('./music.wav');
    }
    play() {
        this.playing_music.play();
    }
    stop() {
        this.playing_music.pause();
    }
}
exports.default = MusicPlayer;
//# sourceMappingURL=Music.js.map