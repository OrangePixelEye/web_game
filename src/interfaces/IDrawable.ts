export interface IDrawable{
    ctx : CanvasRenderingContext2D;
    x?: number
    y? : number
    height : number;
    width : number;
    update() : void;
    draw() : void;
}