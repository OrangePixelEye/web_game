import { MoveableDrawable } from '../moveable_drawable/MovebleDrawable'

export class Obstacles extends MoveableDrawable{
    constructor(c : CanvasRenderingContext2D, x: number, y: number, w: number, h : number = 0, color : string, sp: number) {
        super(c,x,y,w,h)
        this.height = this.randomHeight()
        this.y = this.randomY(this.height);
        this.speed = sp
    }
    
    public randomHeight() : number
    {
        // numbers positive = down
        // numbers negative = up
        return Math.floor(Math.random() * 41) + 20;
    }

    private randomY(height : number) : number {
        
        return Math.floor((Math.random() > 0.5 ? 0 : -height)) + 250;
    }
}
