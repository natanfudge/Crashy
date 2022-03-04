"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderType = exports.OperatingSystemType = exports.unfoldRichStackTrace = void 0;
/**
 * Converts the recursive structure of the 'causedBy' of RichStackTraces into a list that is easily accessible by index.
 */
function unfoldRichStackTrace(trace) {
    var causeList = [];
    var currentCauser = trace;
    while (currentCauser !== undefined) {
        causeList.push(currentCauser);
        currentCauser = currentCauser.causedBy;
    }
    return causeList;
}
exports.unfoldRichStackTrace = unfoldRichStackTrace;
var OperatingSystemType;
(function (OperatingSystemType) {
    OperatingSystemType[OperatingSystemType["Windows"] = 0] = "Windows";
    OperatingSystemType[OperatingSystemType["Macos"] = 1] = "Macos";
    OperatingSystemType[OperatingSystemType["Linux"] = 2] = "Linux";
    OperatingSystemType[OperatingSystemType["Unknown"] = 3] = "Unknown";
})(OperatingSystemType = exports.OperatingSystemType || (exports.OperatingSystemType = {}));
var LoaderType;
(function (LoaderType) {
    LoaderType[LoaderType["Fabric"] = 0] = "Fabric";
    LoaderType[LoaderType["Forge"] = 1] = "Forge";
    LoaderType[LoaderType["Vanilla"] = 2] = "Vanilla";
})(LoaderType = exports.LoaderType || (exports.LoaderType = {}));
