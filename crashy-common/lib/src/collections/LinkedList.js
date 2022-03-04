"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedList = void 0;
var LinkedList = /** @class */ (function () {
    function LinkedList() {
    }
    LinkedList.prototype.find = function (func) {
        var current = this.head;
        while (current !== undefined) {
            if (func(current.value))
                return current.value;
            current = current.next;
        }
        return undefined;
    };
    LinkedList.prototype.forEach = function (func) {
        var current = this.head;
        while (current !== undefined) {
            func(current.value);
            current = current.next;
        }
    };
    LinkedList.prototype.prepend = function (value) {
        this.head = {
            next: this.head,
            value: value
        };
    };
    LinkedList.prototype.copyReversed = function () {
        var newList = new LinkedList();
        this.forEach(function (element) { return newList.prepend(element); });
        return newList;
    };
    return LinkedList;
}());
exports.LinkedList = LinkedList;
