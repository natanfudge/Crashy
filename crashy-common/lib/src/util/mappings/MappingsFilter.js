"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mappingFilterForMappables = exports.AllowAllMappings = void 0;
exports.AllowAllMappings = {
    needClass: function (name) {
        return true;
    },
    needMethod: function (method) {
        return true;
    },
    usingReverse: false
};
function mappingFilterForMappables(mappables, reverse) {
    return {
        needClass: function (javaClass) {
            return mappables.contains(javaClass);
        },
        needMethod: function (method) {
            return mappables.contains(method);
        },
        usingReverse: reverse
    };
}
exports.mappingFilterForMappables = mappingFilterForMappables;
