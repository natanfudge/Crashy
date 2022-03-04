"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescriptoredMethod = exports.JavaMethod = exports.JavaClass = void 0;
var Constants_1 = require("../../Constants");
var Hashing_1 = require("../../collections/hashmap/Hashing");
var JavaClass = /** @class */ (function () {
    function JavaClass(fullName, slashSeperated) {
        if (Constants_1.EnableAssertions && ((fullName.includes("/") && !slashSeperated) || (fullName.includes(".") && slashSeperated)) && (!fullName.startsWith("java.base"))) {
            throw new Error("Unexpected slash/period when defined otherwise");
        }
        this._fullUnmappedName = slashSeperated ? fullName.replace(/\//g, ".") : fullName;
    }
    JavaClass.dotSeperated = function (fullName) {
        return new JavaClass(fullName, false);
    };
    JavaClass.slashSeperated = function (fullName) {
        return new JavaClass(fullName, true);
    };
    JavaClass.dotSeperatedObject = function (obj) {
        return this.dotSeperated(obj.packageName + "." + obj.simpleName);
    };
    JavaClass.prototype.getUnmappedFullName = function () {
        return this._fullUnmappedName;
    };
    JavaClass.prototype.fullName = function (mappings) {
        return mappings.mapClass(this)._fullUnmappedName;
    };
    JavaClass.prototype.getUnmappedPackageName = function () {
        if (this._packageName === undefined)
            this.populatePackageSplit();
        return this._packageName;
    };
    JavaClass.prototype.getUnmappedSimpleName = function () {
        if (this._simpleName === undefined)
            this.populatePackageSplit();
        return this._simpleName;
    };
    JavaClass.prototype.simpleName = function (mappings) {
        return mappings.mapClass(this).getUnmappedSimpleName();
    };
    JavaClass.prototype.withMethod = function (methodName) {
        return new JavaMethod(this, methodName);
    };
    JavaClass.prototype.withDescMethod = function (methodName, descriptor) {
        return new JavaMethod(this, methodName).withDescriptor(descriptor);
    };
    JavaClass.prototype.populatePackageSplit = function () {
        var split = this._fullUnmappedName.splitToTwoOnLast(".");
        if (split === undefined) {
            this._packageName = "";
            this._simpleName = this._fullUnmappedName;
        }
        else {
            this._packageName = split[0];
            this._simpleName = split[1];
        }
    };
    JavaClass.prototype.remap = function (mappings, reverse) {
        return mappings.mapClass(this, reverse);
    };
    JavaClass.prototype.equals = function (other) {
        return other._fullUnmappedName === this._fullUnmappedName;
    };
    // We have a lot of extra fields so we override hashCode()
    JavaClass.prototype.hashCode = function () {
        return (0, Hashing_1.hashString)(this._fullUnmappedName);
    };
    JavaClass.prototype.toString = function () {
        return this._fullUnmappedName;
    };
    return JavaClass;
}());
exports.JavaClass = JavaClass;
/**
 * Full Name: package.class#method
 * Simple Name: class#method
 * Method Name: method
 */
var JavaMethod = /** @class */ (function () {
    function JavaMethod(classIn, name) {
        this.classIn = classIn;
        this._name = name;
    }
    JavaMethod.dotSeperated = function (classIn, name) {
        return new JavaMethod(JavaClass.dotSeperated(classIn), name);
    };
    JavaMethod.dotSeperatedObject = function (obj) {
        return new JavaMethod(JavaClass.dotSeperatedObject(obj.classIn), obj.name);
    };
    JavaMethod.parse = function (methodDotSeperated) {
        var _a = methodDotSeperated.splitToTwo(Constants_1.ClassMethodSeparator), classIn = _a[0], name = _a[1];
        return this.dotSeperated(classIn, name);
    };
    JavaMethod.prototype.getUnmappedMethodName = function () {
        return this._name;
    };
    JavaMethod.prototype.simpleName = function (mappings) {
        var mapped = mappings.mapMethod(this);
        return mapped.classIn.getUnmappedSimpleName() + Constants_1.ClassMethodSeparator + mapped.getUnmappedMethodName();
    };
    JavaMethod.prototype.getUnmappedFullName = function () {
        return this.classIn.getUnmappedFullName() + Constants_1.ClassMethodSeparator + this.getUnmappedMethodName();
    };
    JavaMethod.prototype.fullName = function (mappings) {
        return mappings.mapMethod(this).getUnmappedFullName();
    };
    JavaMethod.prototype.withEmptyDescriptor = function () {
        return new DescriptoredMethod(this, "");
    };
    JavaMethod.prototype.withDescriptor = function (desc) {
        return new DescriptoredMethod(this, desc);
    };
    JavaMethod.prototype.withClass = function (classIn) {
        return new JavaMethod(classIn, this.getUnmappedMethodName());
    };
    JavaMethod.prototype.remap = function (mappings, reverse) {
        return mappings.mapSimpleMethod(this, reverse);
    };
    JavaMethod.prototype.equals = function (other) {
        return other.getUnmappedMethodName() === this.getUnmappedMethodName() && other.classIn.equals(this.classIn);
    };
    JavaMethod.prototype.toString = function () {
        return this.getUnmappedFullName();
    };
    return JavaMethod;
}());
exports.JavaMethod = JavaMethod;
var DescriptoredMethod = /** @class */ (function () {
    function DescriptoredMethod(method, descriptor) {
        this.method = method;
        this.descriptor = descriptor;
    }
    DescriptoredMethod.parse = function (dotQualifiedMethod) {
        var _a = dotQualifiedMethod.splitToTwo("("), method = _a[0], descWithoutParen = _a[1];
        return JavaMethod.parse(method).withDescriptor("(" + descWithoutParen);
    };
    DescriptoredMethod.prototype.getUnmappedFullName = function () {
        return this.method.getUnmappedFullName() + this.descriptor;
    };
    DescriptoredMethod.prototype.toString = function () {
        return this.getUnmappedFullName();
    };
    DescriptoredMethod.prototype.withClass = function (classIn) {
        return new DescriptoredMethod(this.method.withClass(classIn), this.descriptor);
    };
    DescriptoredMethod.prototype.remap = function (mappings, reverse) {
        return mappings.mapDescriptoredMethod(this, reverse);
    };
    return DescriptoredMethod;
}());
exports.DescriptoredMethod = DescriptoredMethod;
