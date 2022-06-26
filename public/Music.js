"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MusicPlayer {
    constructor() {
        this.audio = new Audio('./music.wav');
    }
    play() {
        this.audio.play();
    }
    stop() {
        this.audio.pause();
    }
}
exports.default = MusicPlayer;
//# sourceMappingURL=Music.js.map