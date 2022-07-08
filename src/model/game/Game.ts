import { SaveSystem } from '../save/SaveSystem';
import { Player } from '../player/Player';
import { IDrawable } from '../../interfaces/IDrawable';
import { MoveableDrawable } from '../moveable_drawable/MovebleDrawable';
import { GroundBlock } from '../ground_blocks/GroundBlocks';
import { Controls } from '../controls/Controls';


import { UI } from '../../../docs/index'
import MusicPlayer from '../../../docs/Music';


export enum GameState{
    playing,
    lose,
}


export class Game implements IDrawable{
    state : GameState;
    private _player : Player;
    ground_blocks : GroundBlock[]
    obstacles : MoveableDrawable[]
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    height: number;
    width: number;
    points : number;
    high_score : string;
    music_player : MusicPlayer
    bg : CanvasImageSource

    constructor(h : number, w : number, music : MusicPlayer){
        this.height = h
        this.width = w
        this.canvas = document.createElement("canvas");
		this.canvas.id = "canvas"
        
        this.canvas.width = w
        this.canvas.height = h
        this.canvas.style.border = "1px solid #000";
        
        this.ctx = this.canvas.getContext("2d")
        document.body.appendChild(this.canvas)
        this.ctx.font = '35px serif';

        this.music_player = music

        this.bg = document.getElementById("bg") as CanvasImageSource
    }
    
	public init_game() : void{
        this.ground_blocks = [new GroundBlock(this.ctx, 0, 240, 500, 20,"ABC")]
        this.high_score = SaveSystem.load("points")
        this.obstacles = this.ground_blocks[0].obstacles;
        
        this.appendBlock(new GroundBlock( this.ctx, 570, 240 , 100, 20, "ABC"))
        this.obstacles = this.obstacles.concat(this.ground_blocks[1].obstacles)
		this._player = new Player(this.ctx, new Controls());
        
        this.state = GameState.playing
        this.points = 0
        this.music_player.play();
	}

    public get player()
    {
        return this._player;
    }

    public static detectCollision(a : IDrawable, b : IDrawable) : boolean {
        try{
            return !(
                ((a.y + a.height) < (b.y)) || // colide em baixo
                (a.y > (b.y + b.height)) || // em cima
                ((a.x + a.width) < b.x) || // direita
                (a.x > (b.x + b.width)) // esquerda
            );
        }
        catch{
            throw "Bloco não encontrado"
        }
    }
    
    update() : void {
        this.points++;
		this._player.update();
        this.verifyCollisions();
        this.updateMap();        
    }

    updateMap() : void{
        this.ground_blocks.forEach(element => {
            element.update()
			if(!element.insideScreen()){
				// tem q tirar os obstaculos dps
				for(let i = 0; i < element.obstacles.length;i++)
					this.obstacles.shift()
				this.ground_blocks.shift() 
				this.generateNewBlock();
			}
        });

        this.obstacles.forEach(e => e.update());

        // a colisão é sempre com o bloco atual
        this._player.is_colliding = Game.detectCollision(this._player, this.ground_blocks[0])
        
    }

	generateNewBlock() : void{
		// se baseia no width e position do anterior
		this.appendBlock(new GroundBlock( this.ctx, this.ground_blocks[this.ground_blocks.length - 1].x + 280, 240 , (Math.floor(Math.random() * 190) + 50), 20, "FFF"))
		this.obstacles = this.obstacles.concat(this.ground_blocks[this.ground_blocks.length - 1].obstacles)
	}

    verifyCollisions() : void{
        if(this.obstacles === undefined) return;
        this.obstacles.forEach(element => {
            if(Game.detectCollision(element, this._player))
                this.state = GameState.lose
        });
    }

    appendBlock = (b : GroundBlock) => this.ground_blocks.push(b)
    

    private draw_background() : void {
        //this.ctx.fillStyle =  "#101EF2"
        //this.ctx.fillRect(0, 0, 500, 500)
        this.ctx.drawImage(this.bg, 0, 0, 500, 500)
    }

    draw() : void {
        this.draw_background()
        this.obstacles.forEach(e => e.draw())

        this.drawGround();
        
        this._player.draw()
    }

    drawGround() : void{
        this.ground_blocks.forEach(element => {
            element.draw()
        });
    }

    main = () : void => this.run();


    public run() : void
    {
		if(this.state != GameState.playing) return
        this.update();
        this.draw();
        this.drawUI(this.state);
        // cria o loop
        window.requestAnimationFrame(() => this.run())
    }

    calculatePoints = () : number => this.roundUp(this.points/90, 2)
    

    // todo
    public drawUI(state : GameState) : void{
        switch(state){
            case GameState.playing:
                this.updateScreenPoints(this.points)
                this.showHighscore()
                break;
            case GameState.lose:
                this.gameOver();
                break;
            default:
                throw "Undefined status"
        }
    }
    public showHighscore() : void {
        this.ctx.fillStyle = "orange";
        this.ctx.fillText("HI:  " + this.high_score, 25, 40)
    }
    
    public updateScreenPoints(points : number) : void {
        this.ctx.fillStyle = "orange";
        this.ctx.fillText(points.toString(), 25, 90)
    }
    
    private gameOver() : void {
		let show_text : string = this.points.toString()
		// pause game
		window.cancelAnimationFrame(0)
		
        UI.showMenu("canvas","game_over");
		
        // show info
		if(Number(SaveSystem.load("points")) < this.points){
			SaveSystem.save("points", this.points)
			show_text += " é um novo record !"
		}
		document.getElementById('points').innerText = show_text
		this.music_player.stop()
	}

    private roundUp(num : number, precision : number) : number{
        precision = Math.pow(10, precision)
        return Math.ceil(num * precision) / precision
    }
}
