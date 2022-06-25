/**
 * let img = document.getElementById("imgSource");
    ctx.drawImage(img, 50, 50);
 */
// tsc -w no terminal para watch ctrl shift b watch
// npx webpack serve

import { Game, GameState } from '../src/model/game/Game';
import { SaveSystem } from '../src/model/save/SaveSystem';

export class UI{
	// todo: divide the ui in multiple files
	// main
	btn_play : HTMLElement
	btn_settings : HTMLElement
	btn_credits : HTMLElement
	btn_exit : HTMLElement
	
	// credits and settings menu
	btn_back_to_menu : NodeListOf<HTMLElement>
	btn_reset_points : HTMLElement

	// lose screen
	btn_play_again : HTMLElement
	btn_menu : HTMLElement
	

	constructor(){
		this.btn_play  = document.getElementById("p") 
		this.btn_settings  = document.getElementById("settings")
		this.btn_credits  = document.getElementById("c") 
		this.btn_exit = document.getElementById("e")
		
		this.btn_menu = document.getElementById("menu")
		this.btn_play_again = document.getElementById("play_again")
		
		this.btn_back_to_menu = document.getElementsByName("back_menu")
		this.btn_reset_points = document.getElementById("configure-reset")

		UI.showUI(document.getElementById("canvas"), false)
		this.configureUI()
	}

	configureUI() : void{
		this.btn_settings.onclick = () => {
			UI.showMenu("allthethings", "ui-settings")
		}
		
		this.btn_credits.onclick = () => {
			UI.showMenu("allthethings", "ui-credits")
		}

		this.btn_play.onclick = () => {
			UI.showMenu("allthethings", "canvas")
			start()
		};

		this.btn_reset_points.onclick = () => {
			const save_map = new Map([
				['points', '0']
			])
			SaveSystem.saveArray(save_map)
			
		}

		this.btn_play_again.onclick = () => {
			UI.showMenu("game_over", "canvas")
			start()
		}

		this.btn_menu.onclick = () => {
			UI.showMenu("game_over", "allthethings")
		}
		
		this.btn_exit.onclick = () => {
			close()
		}
		this.btn_back_to_menu.forEach((e) => {
			e.onclick = event => {
				let name = "ui-" 
				name += ((event.target as HTMLElement).dataset.screen as string)
				UI.showMenu(name, "allthethings")
			}
		})
	}
	
	static showUI(UI : any, show : boolean) : void{
		UI.style.display = show ? "" : "none"
	}
	
	static showMenu(old_screen : string, new_screen: string) :void {
		UI.showUI(document.getElementById(old_screen), false)
		UI.showUI(document.getElementById(new_screen), true)
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

function openMenu(event) {
	console.log(event);
	
	//UI.showMenu(menu)
}
