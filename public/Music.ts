export default abstract class MusicPlayer {
    audio : HTMLAudioElement
    
    constructor(){
        this.audio = new Audio('./music.wav');
    }
    
    public play() : void {
        this.audio.play();
    }

    public stop() : void {
        this.audio.pause()
    }

}