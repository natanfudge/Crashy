"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingsBuilder = void 0;
var Mappable_1 = require("../../crash/model/Mappable");
var HashMap_1 = require("../../collections/hashmap/HashMap");
var MappingsImpl_1 = require("./MappingsImpl");
var MappingsBuilder = /** @class */ (function () {
    function MappingsBuilder(filter) {
        this.methodsToAdd = [];
        this.classMappings = new HashMap_1.HashMap(undefined);
        this.filter = filter;
    }
    // Returns undefined if this class's  methods are not needed (it's still put in the Dict for remapping)
    MappingsBuilder.prototype.addClass = function (unmapped, mapped) {
        var unmappedClass = new Mappable_1.JavaClass(unmapped, true);
        var mappedClass = new Mappable_1.JavaClass(mapped, true);
        this.classMappings.put(unmappedClass, mappedClass);
        return this.filter.needClass(this.filter.usingReverse ? mappedClass : unmappedClass) ? unmappedClass : undefined;
    };
    MappingsBuilder.prototype.addMethod = function (unmappedClassName, unmappedMethodName, unmappedDescriptor, mappedMethodName) {
        var method = unmappedClassName.withMethod(unmappedMethodName);
        this.methodsToAdd.push({ unmapped: method.withDescriptor(unmappedDescriptor), mappedName: mappedMethodName });
    };
    MappingsBuilder.prototype.remapDescriptor = function (descriptor) {
        var _this = this;
        return descriptor.replace(/L(.+?);/g, function (match, p1) {
            var _a, _b, _c;
            var remapped = (_c = (_b = (_a = _this.classMappings.get(new Mappable_1.JavaClass(p1, true))) === null || _a === void 0 ? void 0 : _a.getUnmappedFullName()) === null || _b === void 0 ? void 0 : _b.replace(/"."/g, "/")) !== null && _c !== void 0 ? _c : p1;
            return "L".concat(remapped, ";");
        });
    };
    MappingsBuilder.prototype.build = function () {
        var _this = this;
        var finalMappings = new HashMap_1.HashMap(undefined);
        this.classMappings.forEach(function (unmapped, mapped) {
            if (_this.filter.needClass(_this.filter.usingReverse ? mapped : unmapped)) {
                finalMappings.put(unmapped, {
                    mappedClassName: mapped,
                    methods: new HashMap_1.HashMap(undefined)
                });
            }
        });
        // We only add the methods once we are done with everything, so we have all the classes ready for remapping method descriptors
        for (var _i = 0, _a = this.methodsToAdd; _i < _a.length; _i++) {
            var _b = _a[_i], unmapped = _b.unmapped, mappedName = _b.mappedName;
            var classEntry = finalMappings.get(unmapped.method.classIn);
            if (classEntry === undefined) {
                throw new Error("Class ".concat(unmapped.method.classIn.toString(), " not found in mappings"));
            }
            // Possible optimization: we don't need to store this remapped descriptor, we can only calculate it when we actually need it
            // based off of the class mappings
            var mapped = classEntry.mappedClassName.withDescMethod(mappedName, this.remapDescriptor(unmapped.descriptor));
            if (this.filter.needMethod(this.filter.usingReverse ? mapped.method : unmapped.method)) {
                classEntry.methods.put(unmapped, mapped);
            }
        }
        return new MappingsImpl_1.MappingsImpl(finalMappings);
    };
    return MappingsBuilder;
}());
exports.MappingsBuilder = MappingsBuilder;
