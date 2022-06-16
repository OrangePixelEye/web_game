/**
 * let img = document.getElementById("imgSource");
    ctx.drawImage(img, 50, 50);
 */
// tsc -w no terminal para watch

import { Game, GameState } from './model/game/Game';

export class UI{
	btn_play : any
	btn_settings : any
	btn_options : any
	btn_credits : any

	btn_play_again : any
	

	constructor(){
		this.btn_play  = document.getElementById("p") 
		this.btn_settings  = document.getElementById("s") 
		this.btn_options  = document.getElementById("o") 
		this.btn_credits  = document.getElementById("c") 
		this.btn_play_again = document.getElementById("play_again")
		UI.showUI(document.getElementById("canvas"), false)
		this.configureUI()
	}
	configureUI() : void{
		this.btn_play.onclick = () => {
			UI.showUI(document.getElementById("allthethings"), false)
			UI.showUI(document.getElementById("canvas"), true)

			start()
		};
		this.btn_play_again.onclick = () => {
			UI.showUI(document.getElementById("game_over"), false);
			UI.showUI(document.getElementById("canvas"), true)

			start()
		}
	}

	static showUI(UI : any, show : boolean) : void{
		UI.style.display = show ? "" : "none"
	}
}

let gm : Game
gm = new Game(500, 500);
gm.state = GameState.playing
let u = new UI();

function start() : void{
	gm.init_game()
	gm.main()
}
