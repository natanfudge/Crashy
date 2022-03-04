"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./Extensions");
String.prototype.removeExpectedSuffix = function (suffix) {
    if (!this.endsWith(suffix))
        throw new Error("Expected string to end with '".concat(suffix, "', but is actually: '").concat(this, "'"));
    return this.slice(0, -1 * suffix.length);
};
String.prototype.removeExpectedPrefix = function (prefix) {
    if (!this.startsWith(prefix))
        throw new Error("Expected string to start with '".concat(prefix, "', but is actually: '").concat(this, "'"));
    return this.slice(prefix.length);
};
String.prototype.removeSuffix = function (suffix) {
    if (!this.endsWith(suffix))
        return this;
    return this.slice(0, -1 * suffix.length);
};
String.prototype.removePrefix = function (prefix) {
    if (!this.startsWith(prefix))
        return this;
    return this.slice(prefix.length);
};
String.prototype.splitToTwo = function (splitOn) {
    var index = this.indexOf(splitOn);
    if (index === -1)
        throw new Error("Could not split to two because split string '".concat(splitOn, "' does not exist in target string '").concat(this, "'"));
    return [this.slice(0, index), this.slice(index + 1)];
};
String.prototype.splitToTwoOnLast = function (splitOn) {
    var index = this.lastIndexOf(splitOn);
    // if (index === -1) throw new Error(`Could not split to two because split string '${splitOn}' does not exist in target string '${this}'`)
    if (index === -1)
        return undefined;
    return [this.slice(0, index), this.slice(index + 1)];
};
String.prototype.removeAfterFirst = function (removeAfter) {
    var index = this.indexOf(removeAfter);
    if (index === -1) {
        return this;
    }
    else {
        return this.slice(0, index + 1);
    }
};
String.prototype.removeAfterFirstExclusive = function (removeAfter) {
    var index = this.indexOf(removeAfter);
    if (index === -1) {
        return this;
    }
    else {
        return this.slice(0, index);
    }
};
String.prototype.removeAfterLast = function (removeAfter) {
    var index = this.lastIndexOf(removeAfter);
    if (index === -1) {
        return this;
    }
    else {
        return this.slice(0, index + 1);
    }
};
String.prototype.removeBeforeLastExclusive = function (removeBefore) {
    var index = this.lastIndexOf(removeBefore);
    if (index === -1) {
        return this;
    }
    else {
        return this.slice(index + 1);
    }
};
// String.prototype.removeBeforeLast = function (this: string, removeBefore: string): string {
//     const index = this.lastIndexOf(removeBefore);
//     if (index === -1) {
//         return this;
//     } else {
//         return this.slice(index);
//     }
// }
Array.prototype.arrayEquals = function (b) {
    return this.length === b.length &&
        this.every(function (val, index) { return val === b[index]; });
};
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index !== -1)
        this.splice(index, 1);
};
Array.prototype.firstOr = function (or) {
    if (this.length === 0) {
        return or();
    }
    else {
        return this[0];
    }
};
Array.prototype.drop = function (amount) {
    var newArr = new Array(this.length - amount);
    for (var i = amount; i < this.length; i++) {
        newArr[i - amount] = this[i];
    }
    return newArr;
};
Array.prototype.mapSync = function (map) {
    return __awaiter(this, void 0, void 0, function () {
        var newArr, i, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    newArr = new Array(this.length);
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < this.length)) return [3 /*break*/, 4];
                    _a = newArr;
                    _b = i;
                    return [4 /*yield*/, map(this[i], i)];
                case 2:
                    _a[_b] = _c.sent();
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, newArr];
            }
        });
    });
};
Array.prototype.isEmpty = function () {
    return this.length === 0;
};
Array.prototype.none = function (test) {
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var item = _a[_i];
        if (test(item))
            return false;
    }
    return true;
};
