"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingsImpl = void 0;
var HelperClasses_1 = require("../HelperClasses");
var MappingsImpl = /** @class */ (function () {
    function MappingsImpl(mappings) {
        var _this = this;
        this.mappingsReversed = new HelperClasses_1.Lazy(function () { return reverseMappingData(_this.mappings); });
        this.mappings = mappings;
    }
    MappingsImpl.prototype.serialize = function () {
        return this.mappings.toRecord(function (unmappedClass) { return unmappedClass.getUnmappedFullName(); }, function (_, _a) {
            var mappedClassName = _a.mappedClassName, methods = _a.methods;
            return ({
                c: mappedClassName.getUnmappedFullName(),
                m: methods.toArray(function (unmappedMethod, mappedMethod) {
                    var unmapped = unmappedMethod.method.getUnmappedMethodName();
                    var mapped = mappedMethod.method.getUnmappedMethodName();
                    var unmappedDescriptor = unmappedMethod.descriptor;
                    // Unmapped, mapped, unmapped descriptor
                    return [unmapped, mapped, unmappedDescriptor];
                })
            });
        });
    };
    MappingsImpl.prototype.getMappings = function (reversed) {
        return reversed ? this.mappingsReversed.get() : this.mappings;
    };
    MappingsImpl.prototype.mapClass = function (className, reverse) {
        var _a, _b;
        var maps = this.getMappings(reverse);
        return (_b = (_a = maps.get(className)) === null || _a === void 0 ? void 0 : _a.mappedClassName) !== null && _b !== void 0 ? _b : className;
    };
    MappingsImpl.prototype.mapSimpleMethod = function (methodName, reverse) {
        var _a;
        var classMappings = this.getMappings(reverse).get(methodName.classIn);
        if (classMappings !== undefined) {
            // Linear search is fine because we filter down only to the methods we use
            return (_a = classMappings.methods.linearSearch(function (unmapped) { return unmapped.method.equals(methodName); })) !== null && _a !== void 0 ? _a : methodName.withClass(classMappings.mappedClassName).withEmptyDescriptor();
        }
        else {
            // If the class name is not found - don't map this method. Mapping just by method name can create very incorrect results, e.g. if a method is called run
            // it would be remapped into something almost completely random.
            // Remapping without descriptor is ok because at worst case the wrong method is in the same class and has the same name.
            return methodName.withEmptyDescriptor();
        }
    };
    MappingsImpl.prototype.mapDescriptoredMethod = function (methodName, reverse) {
        var _a;
        // Same logic as mapSimpleMethod when it comes to mapping / not mapping
        var classMappings = this.getMappings(reverse).get(methodName.method.classIn);
        if (classMappings !== undefined) {
            return (_a = classMappings === null || classMappings === void 0 ? void 0 : classMappings.methods.get(methodName)) !== null && _a !== void 0 ? _a : methodName.withClass(classMappings.mappedClassName);
        }
        else {
            return methodName;
        }
    };
    return MappingsImpl;
}());
exports.MappingsImpl = MappingsImpl;
function reverseMappingData(data) {
    return data.map(function (_, mappings) { return mappings.mappedClassName; }, function (unmappedClass, mappings) {
        var reversed = {
            mappedClassName: unmappedClass,
            methods: mappings.methods.map(function (_, mappedName) { return mappedName; }, function (unmappedName) { return unmappedName; })
        };
        return reversed;
    });
}
