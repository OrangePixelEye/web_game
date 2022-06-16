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
        return localStorage.getItem(key);
    }
}
exports.SaveSystem = SaveSystem;
//# sourceMappingURL=SaveSystem.js.map