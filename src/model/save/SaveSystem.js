"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveSystem = void 0;
class SaveSystem {
    // local storage
    static saveArray(info) {
        info.forEach((v, k) => {
            localStorage.setItem(k, v);
        });
    }
    static save(key, value) {
        localStorage.setItem(key, value);
    }
    static load(key) {
        var _a;
        return (_a = localStorage.getItem(key)) !== null && _a !== void 0 ? _a : '';
    }
}
exports.SaveSystem = SaveSystem;
//# sourceMappingURL=SaveSystem.js.map