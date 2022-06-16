import { IDrawable } from "../../interfaces/IDrawable";

export abstract class MoveableDrawable implements IDrawable{
    ctx: CanvasRenderingContext2D;
    x?: number;
    y?: number;
    height: number;
    width: number;

    color ?: string;

    speed : number;

    constructor(c : CanvasRenderingContext2D, x: number, y: number, w: number, h : number, color ?: string) {
        this.ctx = c
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.color = color
        if(this.color === undefined) this.color = "#FFFFFF"
    }

    update(): void {
        this.x -= this.speed
    }
    draw(): void {  
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.x,this.y, this.width, this.height)
    }

}