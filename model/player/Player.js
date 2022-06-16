"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(ctx, control) {
        this.jump_force = 15.6;
        this.gravity = 0.6;
        this.vertical_speed = 0;
        this.can_jump = false;
        this.is_colliding = false;
        this.ctx = ctx;
        this.direction = true;
        this.x = 50;
        this.y = 0;
        this.width = 30;
        this.height = 30;
        this.controls = control;
    }
    update() {
        this.calcGravity();
        this.groundCollision();
        this.getInput();
    }
    draw() {
        this.ctx.fillStyle = "#FA43D6";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    jump() {
        if (this.is_colliding)
            this.vertical_speed = -this.jump_force;
    }
    invert() {
        this.vertical_speed -= this.jump_force;
        this.direction = !this.direction;
    }
    getInput() {
        if (this.controls.states.forward)
            this.jump();
        if (this.controls.states.left)
            this.invert();
    }
    calcGravity() {
        this.vertical_speed += this.gravity;
        this.y = (this.direction ? this.y + this.vertical_speed : this.y - this.vertical_speed);
    }
    groundCollision() {
        if ((((this.y > 250 - this.height) && this.direction) ||
            ((this.y < 259) && !this.direction))) {
            if (this.is_colliding) {
                this.can_jump = true;
                this.y = this.direction ? 240 - this.height : 260;
            }
        }
        if (this.y > 300 && this.direction)
            this.invert();
        if (this.y < 200 && !this.direction)
            this.invert();
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map