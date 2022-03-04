"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lazy = void 0;
var Lazy = /** @class */ (function () {
    function Lazy(init) {
        this.init = init;
    }
    Lazy.prototype.get = function () {
        if (this.value === undefined) {
            this.value = this.init();
        }
        return this.value;
    };
    return Lazy;
}());
exports.Lazy = Lazy;
