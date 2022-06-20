/**
 * let img = document.getElementById("imgSource");
    ctx.drawImage(img, 50, 50);
 */
// tsc -w no terminal para watch ctrl shift b watch
// npx webpack serve

import { Game, GameState } from '../src/model/game/Game';

export class UI{
	btn_play : HTMLElement
	btn_settings : HTMLElement
	btn_options : HTMLElement
	btn_credits : HTMLElement
	btn_exit : HTMLElement

	btn_play_again : HTMLElement
	btn_menu : HTMLElement
	

	constructor(){
		this.btn_play  = document.getElementById("p") 
		this.btn_settings  = document.getElementById("s") 
		this.btn_options  = document.getElementById("o") 
		this.btn_credits  = document.getElementById("c") 
		this.btn_exit = document.getElementById("exit")
		
		this.btn_menu = document.getElementById("menu")
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

		this.btn_menu.onclick = () => {
			UI.showUI(document.getElementById("game_over"), false);
			UI.showUI(document.getElementById("allthethings"), true)
		}
		this.btn_exit.onclick = () => {
			close()
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
