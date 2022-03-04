"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashMap = void 0;
var EqualsImplementation_1 = require("./EqualsImplementation");
var LinkedList_1 = require("../LinkedList");
var Hashing_1 = require("./Hashing");
var InitialCapacityPadding = 1.35;
var DefaultCapacity = 16;
var LoadFactor = 0.75;
var SizeIncreaseMultiplier = 1.5;
// type B
/**
 * All objects are treated as values (as the key), so don't make the key too complex (e.g. a record with 10,000 entries)
 * Treating objects as references is perhaps possible but not implemented
 *
 * Define `equals(other: T): boolean` and `hashCode(): number` for classes with unrelated fields.
 */
var HashMap = /** @class */ (function () {
    ////////// Constructors ////////////
    function HashMap(capacity) {
        this._size = 0;
        this._bucketsFilled = 0;
        // Pad some space for better performance
        this.capacity = capacity === undefined ? DefaultCapacity : Math.ceil(capacity * InitialCapacityPadding);
        this.buckets = new Array(this.capacity);
    }
    HashMap.fromArray = function (items) {
        var map = new HashMap(items.length);
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            map.putEntry(item);
        }
        return map;
    };
    HashMap.empty = function () {
        return this.Empty;
    };
    //////// Primary API //////////
    HashMap.prototype.get = function (key) {
        var _a;
        return (_a = this.getEntry(key)) === null || _a === void 0 ? void 0 : _a.value;
    };
    HashMap.prototype.put = function (key, value) {
        this.putEntry({ key: key, value: value });
    };
    Object.defineProperty(HashMap.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    /////////// Utility //////////
    HashMap.prototype.forEach = function (func) {
        this.forEachImpl(this.buckets, function (_a) {
            var key = _a.key, value = _a.value;
            return func(key, value);
        });
    };
    HashMap.prototype.map = function (keyMap, valueMap) {
        var newMap = new HashMap(this.capacity);
        this.forEach(function (key, value) { return newMap.put(keyMap(key, value), valueMap(key, value)); });
        return newMap;
    };
    HashMap.prototype.linearSearch = function (func) {
        for (var i = 0; i < this.buckets.length; i++) {
            var bucket = this.buckets[i];
            if (bucket === undefined)
                continue;
            var found = bucket.find(function (_a) {
                var key = _a.key, value = _a.value;
                return func(key, value);
            });
            if (found !== undefined)
                return found.value;
        }
        return undefined;
    };
    HashMap.prototype.copy = function () {
        var newMap = new HashMap(this.capacity);
        for (var i = 0; i < this.buckets.length; i++) {
            var bucket = this.buckets[i];
            newMap.buckets[i] = bucket.copyReversed();
        }
        return newMap;
    };
    HashMap.prototype.toArray = function (map) {
        var arr = new Array();
        var i = 0;
        this.forEach(function (k, v) {
            arr[i] = map(k, v);
            i++;
        });
        return arr;
    };
    // toArray(): [K, V][] {
    //     const arr = new Array<[K, V]>()
    //     let i = 0;
    //     this.forEach((k, v) => {
    //         arr[i] = [k, v]
    //         i++;
    //     })
    //     return arr;
    // }
    /**
     * If contains `key`, returns its value and does not mutate the map
     * If doesn't contain `key`, sets map[key] = value and returns undefined
     */
    HashMap.prototype.putIfAbsent = function (key, value) {
        var entry = this.getEntry(key);
        if (entry !== null) {
            return entry === null || entry === void 0 ? void 0 : entry.value;
        }
        else {
            this.put(key, value);
            return undefined;
        }
    };
    ///////////// Implementation ////////////
    HashMap.prototype.putEntry = function (newEntry) {
        var hash = this.getHash(newEntry.key);
        var entry = this.getEntry(newEntry.key, hash);
        if (entry !== undefined) {
            entry.value = newEntry.value;
        }
        else {
            if (this.buckets[hash] === undefined) {
                this.buckets[hash] = new LinkedList_1.LinkedList();
                this._bucketsFilled++;
            }
            this.buckets[hash].prepend(newEntry);
            this._size++;
            // If the map is starting to get too full we should expand it
            if (this._bucketsFilled > this.capacity * LoadFactor)
                this.expand();
        }
    };
    HashMap.prototype.expand = function () {
        var _this = this;
        this.capacity = Math.floor(this.capacity * SizeIncreaseMultiplier);
        var oldBuckets = this.buckets;
        // Delete all buckets and do over
        this.buckets = new Array(this.capacity);
        this._bucketsFilled = 0;
        this._size = 0;
        this.forEachImpl(oldBuckets, function (entry) { return _this.putEntry(entry); });
    };
    HashMap.prototype.getHash = function (key) {
        return ((0, Hashing_1.hashCodeOfAnything)(key) & 0xfffffff) % this.capacity;
    };
    HashMap.prototype.getEntry = function (key, hash) {
        var usedHash = hash !== null && hash !== void 0 ? hash : this.getHash(key);
        var bucket = this.buckets[usedHash];
        if (bucket === undefined)
            return undefined;
        return bucket.find(function (entry) { return (0, EqualsImplementation_1.equalsOfAnything)(entry.key, key); });
    };
    // eslint-disable-next-line class-methods-use-this
    HashMap.prototype.forEachImpl = function (buckets, func) {
        for (var i = 0; i < buckets.length; i++) {
            var bucket = buckets[i];
            bucket === null || bucket === void 0 ? void 0 : bucket.forEach(function (entry) { return func(entry); });
        }
    };
    HashMap.prototype.toRecord = function (keyMap, valueMap) {
        var record = {};
        this.forEach(function (k, v) {
            record[keyMap(k, v)] = valueMap(k, v);
        });
        return record;
    };
    HashMap.Empty = new HashMap(0);
    return HashMap;
}());
exports.HashMap = HashMap;
