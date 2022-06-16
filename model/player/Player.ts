import { IDrawable } from '../../interfaces/IDrawable'
import { Controls } from '../controls/Controls';

export class Player implements IDrawable{
    ctx : CanvasRenderingContext2D;
    x: number;
    y: number;
    height : number;
    width : number;

    private direction : boolean;
    private controls : Controls;
    private jump_force = 15.6;
    private gravity = 0.6;
    private vertical_speed = 0;
	can_jump = false;
    public is_colliding : boolean = false;
    
    constructor(ctx : CanvasRenderingContext2D, control : Controls){
        this.ctx = ctx
        this.direction = true
        this.x = 50
        this.y = 0
        this.width = 30
        this.height = 30
        this.controls = control
    }
    update() : void {
        this.calcGravity();
        this.groundCollision();
		
		this.getInput();
    }
    draw() : void {
        this.ctx.fillStyle = "#FA43D6"
        this.ctx.fillRect(this.x,this.y, this.width, this.height)
    }
    
    public jump() : void {
		if(this.is_colliding)
        	this.vertical_speed = -this.jump_force
    }

    private invert() : void {
		this.vertical_speed -= this.jump_force
        this.direction = !this.direction;
    }

    private getInput() : void {
        if (this.controls.states.forward) this.jump();
        if (this.controls.states.left) this.invert();
    }

    private calcGravity() : void {
        this.vertical_speed += this.gravity;
        this.y = (this.direction ? this.y + this.vertical_speed : this.y - this.vertical_speed)
    }

    private groundCollision() :void {
        if (
            (((this.y > 250 - this.height) && this.direction) || 
            ((this.y < 259)  && !this.direction))
            ) {
                if(this.is_colliding){
					this.can_jump = true
					this.y = this.direction ? 240 - this.height : 260
                }
        }
        if(this.y > 300 && this.direction) this.invert()
        if(this.y < 200 && !this.direction) this.invert()
    }
    
}