import { MoveableDrawable } from "../moveable_drawable/MovebleDrawable";
import { Obstacles } from "../obstacles/Obstacles";

export class GroundBlock extends MoveableDrawable{
    color : string;
    private obs : Obstacles[];
    speed : number;

    constructor(c : CanvasRenderingContext2D, x: number, y: number, w: number, h : number, color : string, s : number = 3.3)
    {
        super(c,x,y,w,h)
        this.color = "#" + color
        this.speed = s
        this.generateRandomObstacles()
    }

    // todo: fix this functon
    private generateRandomObstacles() : void{		
		let obs_ = Math.floor(Math.random() * 1) + 1;
        this.obs = [new Obstacles(this.ctx, (Math.floor(Math.random() * 13) + this.x + 45), this.y + 10, 13, 15, "FFF",this.speed)]
        /*
        for(let i = 0; i <  obs_; i++)
        {
            this.obs.push(new Obstacles(this.ctx, this.x, this.y + 10, 25, 1, "FFFF",this.speed))
        }*/
        
    }

    private chooseRandomPosition(w : number) : number{
        return Math.floor(Math.random() * w);
    }

    public get obstacles() : Obstacles[]
    {
        return this.obs;
    } 

    public insideScreen() : boolean {
        // verify if its inside the screen		
		return (this.x > -this.width)
    }
}