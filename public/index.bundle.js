/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/index.js":
/*!*************************!*\
  !*** ./public/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n/**\n * let img = document.getElementById(\"imgSource\");\n    ctx.drawImage(img, 50, 50);\n */\n// tsc -w no terminal para watch\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UI = void 0;\nconst Game_1 = __webpack_require__(/*! ../src/model/game/Game */ \"./src/model/game/Game.js\");\nclass UI {\n    constructor() {\n        this.btn_play = document.getElementById(\"p\");\n        this.btn_settings = document.getElementById(\"s\");\n        this.btn_options = document.getElementById(\"o\");\n        this.btn_credits = document.getElementById(\"c\");\n        this.btn_play_again = document.getElementById(\"play_again\");\n        UI.showUI(document.getElementById(\"canvas\"), false);\n        this.configureUI();\n    }\n    configureUI() {\n        this.btn_play.onclick = () => {\n            UI.showUI(document.getElementById(\"allthethings\"), false);\n            UI.showUI(document.getElementById(\"canvas\"), true);\n            console.log(\"asd\");\n            start();\n        };\n        this.btn_play_again.onclick = () => {\n            UI.showUI(document.getElementById(\"game_over\"), false);\n            UI.showUI(document.getElementById(\"canvas\"), true);\n            start();\n        };\n    }\n    static showUI(UI, show) {\n        UI.style.display = show ? \"\" : \"none\";\n    }\n}\nexports.UI = UI;\nlet gm;\ngm = new Game_1.Game(500, 500);\ngm.state = Game_1.GameState.playing;\nlet u = new UI();\nfunction start() {\n    gm.init_game();\n    gm.main();\n}\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack://web_game/./public/index.js?");

/***/ }),

/***/ "./src/model/controls/Controls.js":
/*!****************************************!*\
  !*** ./src/model/controls/Controls.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Controls = void 0;\nclass Controls {\n    constructor() {\n        this.codes = { 37: 'left', 38: 'forward', 40: 'backward' };\n        this.states = { 'left': false, 'forward': false, 'backward': false };\n        document.addEventListener('keydown', this.onKey.bind(this, true), false);\n        document.addEventListener('keyup', this.onKey.bind(this, false), false);\n    }\n    onKey(val, e) {\n        var state = this.codes[e.keyCode];\n        if (typeof state === 'undefined')\n            return;\n        this.states[state] = val;\n        e.preventDefault && e.preventDefault();\n        e.stopPropagation && e.stopPropagation();\n    }\n}\nexports.Controls = Controls;\n//# sourceMappingURL=Controls.js.map\n\n//# sourceURL=webpack://web_game/./src/model/controls/Controls.js?");

/***/ }),

/***/ "./src/model/game/Game.js":
/*!********************************!*\
  !*** ./src/model/game/Game.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Game = exports.GameState = void 0;\nconst SaveSystem_1 = __webpack_require__(/*! ../save/SaveSystem */ \"./src/model/save/SaveSystem.js\");\nconst Player_1 = __webpack_require__(/*! ../player/Player */ \"./src/model/player/Player.js\");\nconst GroundBlocks_1 = __webpack_require__(/*! ../ground_blocks/GroundBlocks */ \"./src/model/ground_blocks/GroundBlocks.js\");\nconst Controls_1 = __webpack_require__(/*! ../controls/Controls */ \"./src/model/controls/Controls.js\");\nconst index_1 = __webpack_require__(/*! ../../../public/index */ \"./public/index.js\");\nvar GameState;\n(function (GameState) {\n    GameState[GameState[\"playing\"] = 0] = \"playing\";\n    GameState[GameState[\"lose\"] = 1] = \"lose\";\n    GameState[GameState[\"ui\"] = 2] = \"ui\";\n})(GameState = exports.GameState || (exports.GameState = {}));\nclass Game {\n    constructor(h, w) {\n        this.height = h;\n        this.width = w;\n        this.canvas = document.createElement(\"canvas\");\n        this.canvas.id = \"canvas\";\n        this.canvas.width = w;\n        this.canvas.height = h;\n        this.canvas.style.border = \"1px solid #000\";\n        this.ctx = this.canvas.getContext(\"2d\");\n        document.body.appendChild(this.canvas);\n        this.ctx.font = '50px serif';\n    }\n    init_game() {\n        this.ground_blocks = [new GroundBlocks_1.GroundBlock(this.ctx, 0, 240, 500, 20, \"000\")];\n        this.obstacles = this.ground_blocks[0].obstacles;\n        this.appendBlock(new GroundBlocks_1.GroundBlock(this.ctx, 570, 240, 100, 20, \"ABC\"));\n        this.obstacles = this.obstacles.concat(this.ground_blocks[1].obstacles);\n        this._player = new Player_1.Player(this.ctx, new Controls_1.Controls());\n        this.state = GameState.playing;\n        this.points = 0;\n    }\n    get player() {\n        return this._player;\n    }\n    static detectCollision(a, b) {\n        try {\n            return !(((a.y + a.height) < (b.y)) || // colide em baixo\n                (a.y > (b.y + b.height)) || // em cima\n                ((a.x + a.width) < b.x) || // direita\n                (a.x > (b.x + b.width)) // esquerda\n            );\n        }\n        catch (_a) {\n            throw \"Bloco não encontrado\";\n        }\n    }\n    update() {\n        this.points++;\n        this._player.update();\n        this.verifyCollisions();\n        this.updateMap();\n    }\n    updateMap() {\n        this.ground_blocks.forEach(element => {\n            element.update();\n            if (!element.insideScreen()) {\n                // tem q tirar os obstaculos dps\n                for (let i = 0; i < element.obstacles.length; i++)\n                    this.obstacles.shift();\n                this.ground_blocks.shift();\n                this.generateNewBlock();\n            }\n        });\n        this.obstacles.forEach(e => e.update());\n        // a colisão é sempre com o bloco atual\n        this._player.is_colliding = Game.detectCollision(this._player, this.ground_blocks[0]);\n    }\n    generateNewBlock() {\n        // se baseia no width e position do anterior\n        this.appendBlock(new GroundBlocks_1.GroundBlock(this.ctx, this.ground_blocks[this.ground_blocks.length - 1].x + 280, 240, (Math.floor(Math.random() * 190) + 50), 20, \"FFF\"));\n        this.obstacles = this.obstacles.concat(this.ground_blocks[this.ground_blocks.length - 1].obstacles);\n    }\n    verifyCollisions() {\n        if (this.obstacles === undefined)\n            return;\n        this.obstacles.forEach(element => {\n            if (Game.detectCollision(element, this._player))\n                this.state = GameState.lose;\n        });\n    }\n    appendBlock(b) {\n        this.ground_blocks.push(b);\n    }\n    draw_background() {\n        this.ctx.fillStyle = \"#101EF2\";\n        this.ctx.fillRect(0, 0, 500, 500);\n    }\n    draw() {\n        this.draw_background();\n        this.obstacles.forEach(e => e.draw());\n        this.drawGround();\n        this._player.draw();\n    }\n    drawGround() {\n        this.ground_blocks.forEach(element => {\n            element.draw();\n        });\n    }\n    main() {\n        this.run();\n    }\n    run() {\n        if (this.state != GameState.playing)\n            return;\n        this.update();\n        this.draw();\n        this.drawUI(this.state);\n        // cria o loop\n        window.requestAnimationFrame(() => this.run());\n    }\n    calculatePoints() {\n        return this.roundUp(this.points / 90, 2);\n    }\n    // todo\n    drawUI(state) {\n        switch (state) {\n            case GameState.playing:\n                this.updateScreenPoints(this.points);\n                break;\n            case GameState.lose:\n                this.gameOver();\n                break;\n            case GameState.ui:\n                // não sei '-'\n                break;\n            default:\n                throw \"Undefined status\";\n        }\n    }\n    updateScreenPoints(points) {\n        this.ctx.fillText(points.toString(), 255, 100);\n    }\n    gameOver() {\n        let show_text = this.points.toString();\n        // pause game\n        window.cancelAnimationFrame(0);\n        // todo: show lose screen\n        index_1.UI.showUI(document.getElementById(\"game_over\"), true);\n        index_1.UI.showUI(document.getElementById(\"canvas\"), false);\n        // show info\n        if (Number(SaveSystem_1.SaveSystem.load(\"points\")) < this.points) {\n            SaveSystem_1.SaveSystem.save(\"points\", this.points);\n            show_text += \" é um novo record !\";\n        }\n        document.getElementById('points').innerText = show_text;\n    }\n    roundUp(num, precision) {\n        precision = Math.pow(10, precision);\n        return Math.ceil(num * precision) / precision;\n    }\n}\nexports.Game = Game;\n//# sourceMappingURL=Game.js.map\n\n//# sourceURL=webpack://web_game/./src/model/game/Game.js?");

/***/ }),

/***/ "./src/model/ground_blocks/GroundBlocks.js":
/*!*************************************************!*\
  !*** ./src/model/ground_blocks/GroundBlocks.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.GroundBlock = void 0;\nconst MovebleDrawable_1 = __webpack_require__(/*! ../moveable_drawable/MovebleDrawable */ \"./src/model/moveable_drawable/MovebleDrawable.js\");\nconst Obstacles_1 = __webpack_require__(/*! ../obstacles/Obstacles */ \"./src/model/obstacles/Obstacles.js\");\nclass GroundBlock extends MovebleDrawable_1.MoveableDrawable {\n    constructor(c, x, y, w, h, color, s = 3.3) {\n        super(c, x, y, w, h);\n        this.color = \"#\" + color;\n        this.speed = s;\n        this.generateRandomObstacles();\n    }\n    // todo: fix this functon\n    generateRandomObstacles() {\n        let obs_ = Math.floor(Math.random() * 1) + 1;\n        this.obs = [new Obstacles_1.Obstacles(this.ctx, (Math.floor(Math.random() * 13) + this.x + 45), this.y + 10, 13, 15, \"FFF\", this.speed)];\n        /*\n        for(let i = 0; i <  obs_; i++)\n        {\n            this.obs.push(new Obstacles(this.ctx, this.x, this.y + 10, 25, 1, \"FFFF\",this.speed))\n        }*/\n    }\n    chooseRandomPosition(w) {\n        return Math.floor(Math.random() * w);\n    }\n    get obstacles() {\n        return this.obs;\n    }\n    insideScreen() {\n        // verify if its inside the screen\t\t\n        return (this.x > -this.width);\n    }\n}\nexports.GroundBlock = GroundBlock;\n//# sourceMappingURL=GroundBlocks.js.map\n\n//# sourceURL=webpack://web_game/./src/model/ground_blocks/GroundBlocks.js?");

/***/ }),

/***/ "./src/model/moveable_drawable/MovebleDrawable.js":
/*!********************************************************!*\
  !*** ./src/model/moveable_drawable/MovebleDrawable.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.MoveableDrawable = void 0;\nclass MoveableDrawable {\n    constructor(c, x, y, w, h, color) {\n        this.ctx = c;\n        this.x = x;\n        this.y = y;\n        this.width = w;\n        this.height = h;\n        this.color = color;\n        if (this.color === undefined)\n            this.color = \"#FFFFFF\";\n    }\n    update() {\n        this.x -= this.speed;\n    }\n    draw() {\n        this.ctx.fillStyle = this.color;\n        this.ctx.fillRect(this.x, this.y, this.width, this.height);\n    }\n}\nexports.MoveableDrawable = MoveableDrawable;\n//# sourceMappingURL=MovebleDrawable.js.map\n\n//# sourceURL=webpack://web_game/./src/model/moveable_drawable/MovebleDrawable.js?");

/***/ }),

/***/ "./src/model/obstacles/Obstacles.js":
/*!******************************************!*\
  !*** ./src/model/obstacles/Obstacles.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Obstacles = void 0;\nconst MovebleDrawable_1 = __webpack_require__(/*! ../moveable_drawable/MovebleDrawable */ \"./src/model/moveable_drawable/MovebleDrawable.js\");\nclass Obstacles extends MovebleDrawable_1.MoveableDrawable {\n    constructor(c, x, y, w, h = 0, color, sp) {\n        super(c, x, y, w, h);\n        this.height = this.randomHeight();\n        this.y = this.randomY(this.height);\n        this.speed = sp;\n    }\n    randomHeight() {\n        // numbers positive = down\n        // numbers negative = up\n        return Math.floor(Math.random() * 41) + 20;\n    }\n    randomY(height) {\n        return Math.floor((Math.random() > 0.5 ? 0 : -height)) + 250;\n    }\n}\nexports.Obstacles = Obstacles;\n//# sourceMappingURL=Obstacles.js.map\n\n//# sourceURL=webpack://web_game/./src/model/obstacles/Obstacles.js?");

/***/ }),

/***/ "./src/model/player/Player.js":
/*!************************************!*\
  !*** ./src/model/player/Player.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Player = void 0;\nclass Player {\n    constructor(ctx, control) {\n        this.jump_force = 15.6;\n        this.gravity = 0.6;\n        this.vertical_speed = 0;\n        this.can_jump = false;\n        this.is_colliding = false;\n        this.ctx = ctx;\n        this.direction = true;\n        this.x = 50;\n        this.y = 0;\n        this.width = 30;\n        this.height = 30;\n        this.controls = control;\n    }\n    update() {\n        this.calcGravity();\n        this.groundCollision();\n        this.getInput();\n    }\n    draw() {\n        this.ctx.fillStyle = \"#FA43D6\";\n        this.ctx.fillRect(this.x, this.y, this.width, this.height);\n    }\n    jump() {\n        if (this.is_colliding)\n            this.vertical_speed = -this.jump_force;\n    }\n    invert() {\n        this.vertical_speed -= this.jump_force;\n        this.direction = !this.direction;\n    }\n    getInput() {\n        if (this.controls.states.forward)\n            this.jump();\n        if (this.controls.states.left)\n            this.invert();\n    }\n    calcGravity() {\n        this.vertical_speed += this.gravity;\n        this.y = (this.direction ? this.y + this.vertical_speed : this.y - this.vertical_speed);\n    }\n    groundCollision() {\n        if ((((this.y > 250 - this.height) && this.direction) ||\n            ((this.y < 259) && !this.direction))) {\n            if (this.is_colliding) {\n                this.can_jump = true;\n                this.y = this.direction ? 240 - this.height : 260;\n            }\n        }\n        if (this.y > 300 && this.direction)\n            this.invert();\n        if (this.y < 200 && !this.direction)\n            this.invert();\n    }\n}\nexports.Player = Player;\n//# sourceMappingURL=Player.js.map\n\n//# sourceURL=webpack://web_game/./src/model/player/Player.js?");

/***/ }),

/***/ "./src/model/save/SaveSystem.js":
/*!**************************************!*\
  !*** ./src/model/save/SaveSystem.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SaveSystem = void 0;\nclass SaveSystem {\n    // local storage\n    static saveArray(info) {\n        info.forEach((v, k) => {\n            localStorage.setItem(k, v);\n        });\n    }\n    static save(key, value) {\n        localStorage.setItem(key, value);\n    }\n    static load(key) {\n        return localStorage.getItem(key);\n    }\n}\nexports.SaveSystem = SaveSystem;\n//# sourceMappingURL=SaveSystem.js.map\n\n//# sourceURL=webpack://web_game/./src/model/save/SaveSystem.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./public/index.js");
/******/ 	
/******/ })()
;