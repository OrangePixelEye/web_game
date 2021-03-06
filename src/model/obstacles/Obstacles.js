"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obstacles = void 0;
const MovebleDrawable_1 = require("../moveable_drawable/MovebleDrawable");
class Obstacles extends MovebleDrawable_1.MoveableDrawable {
    constructor(c, x, y, w, h = 0, color, sp) {
        super(c, x, y, w, h);
        this.height = this.randomHeight();
        this.y = this.randomY(this.height);
        this.speed = sp;
        this.img = document.getElementById("spike");
    }
    randomHeight() {
        // numbers positive = down
        // numbers negative = up
        return Math.floor(Math.random() * 41) + 20;
    }
    randomY(height) {
        return Math.floor((Math.random() > 0.5 ? 0 : -height)) + 250;
    }
    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        //this.ctx.fillStyle = this.color
        //this.ctx.fillRect(this.x,this.y, this.width, this.height)
    }
}
exports.Obstacles = Obstacles;
//# sourceMappingURL=Obstacles.js.map