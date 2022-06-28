export default class MusicPlayer {
    playing_music : HTMLAudioElement;

    constructor(){
        this.playing_music = new Audio('./music.wav');
    }
    
    public play() : void {

        this.playing_music.play();
    }

    
    public stop() : void {
        this.playing_music.pause()
    }

}