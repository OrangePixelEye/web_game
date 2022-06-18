"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveableDrawable = void 0;
class MoveableDrawable {
    constructor(c, x, y, w, h, color) {
        this.ctx = c;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color;
        if (this.color === undefined)
            this.color = "#FFFFFF";
    }
    update() {
        this.x -= this.speed;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
exports.MoveableDrawable = MoveableDrawable;
//# sourceMappingURL=MovebleDrawable.js.map