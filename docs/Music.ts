import { SaveSystem } from "../src/model/save/SaveSystem";

export default class MusicPlayer {
    playing_music : HTMLAudioElement;

    constructor(){
        this.playing_music = new Audio('./music.wav');
    }
    
    public play() : void {
        const vol = Number(SaveSystem.load('volume'));
        this.playing_music.volume = (vol == NaN ? 1 : vol)
        this.playing_music.loop = true
        this.playing_music.play();
    }

    
    public stop() : void {
        this.playing_music.pause()
    }

}