"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroundBlock = void 0;
const MovebleDrawable_1 = require("../moveable_drawable/MovebleDrawable");
const Obstacles_1 = require("../obstacles/Obstacles");
class GroundBlock extends MovebleDrawable_1.MoveableDrawable {
    constructor(c, x, y, w, h, color, s = 3.3) {
        super(c, x, y, w, h);
        this.color = "#" + color;
        this.speed = s;
        this.generateRandomObstacles();
    }
    // todo: fix this functon
    generateRandomObstacles() {
        let obs_ = Math.floor(Math.random() * 1) + 1;
        this.obs = [new Obstacles_1.Obstacles(this.ctx, (Math.floor(Math.random() * 13) + this.x + 45), this.y + 10, 13, 15, "FFF", this.speed)];
        /*
        for(let i = 0; i <  obs_; i++)
        {
            this.obs.push(new Obstacles(this.ctx, this.x, this.y + 10, 25, 1, "FFFF",this.speed))
        }*/
    }
    chooseRandomPosition(w) {
        return Math.floor(Math.random() * w);
    }
    get obstacles() {
        return this.obs;
    }
    insideScreen() {
        // verify if its inside the screen		
        return (this.x > -this.width);
    }
}
exports.GroundBlock = GroundBlock;
//# sourceMappingURL=GroundBlocks.js.map