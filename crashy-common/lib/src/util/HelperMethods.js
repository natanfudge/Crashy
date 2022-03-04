"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObj = exports.typedKeys = void 0;
function typedKeys(object) {
    return Object.keys(object);
}
exports.typedKeys = typedKeys;
function isObj(x) {
    return typeof x === 'object' && x != null;
}
exports.isObj = isObj;
