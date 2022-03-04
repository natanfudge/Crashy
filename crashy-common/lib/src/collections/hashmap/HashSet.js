"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashSet = void 0;
var HashMap_1 = require("./HashMap");
var HashSet = /** @class */ (function () {
    function HashSet(map) {
        this._map = map;
    }
    HashSet.ofCapacity = function (capacity) {
        return new HashSet(new HashMap_1.HashMap(capacity));
    };
    HashSet.of = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return this.from(items);
    };
    HashSet.from = function (items) {
        var set = this.ofCapacity(items.length);
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            set.put(item);
        }
        return set;
    };
    HashSet.prototype.put = function (value) {
        this._map.put(value, 1);
    };
    HashSet.prototype.contains = function (value) {
        return this._map.get(value) !== undefined;
    };
    HashSet.prototype.copy = function () {
        return new HashSet(this._map.copy());
    };
    HashSet.prototype.map = function (mapper) {
        return new HashSet(this._map.map(mapper, function (_) { return 1; }));
    };
    HashSet.prototype.forEach = function (iterator) {
        this._map.forEach(iterator);
    };
    Object.defineProperty(HashSet.prototype, "isEmpty", {
        get: function () {
            return this.size === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HashSet.prototype, "size", {
        get: function () {
            return this._map.size;
        },
        enumerable: false,
        configurable: true
    });
    HashSet.prototype.toString = function () {
        return "{" + this.toArray().join(", ") + "}";
    };
    HashSet.prototype.toArray = function () {
        var arr = new Array(this.size);
        var i = 0;
        this.forEach(function (v) {
            arr[i] = v;
            i++;
        });
        return arr;
    };
    return HashSet;
}());
exports.HashSet = HashSet;
