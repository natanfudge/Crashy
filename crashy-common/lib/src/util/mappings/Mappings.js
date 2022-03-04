"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyMappings = void 0;
var MappingsImpl_1 = require("./MappingsImpl");
var HashMap_1 = require("../../collections/hashmap/HashMap");
var MappingsBuilder_1 = require("./MappingsBuilder");
var MappingsFilter_1 = require("./MappingsFilter");
function deserializeMappings(serialized) {
    var builder = new MappingsBuilder_1.MappingsBuilder(MappingsFilter_1.AllowAllMappings);
    for (var unmappedClass in serialized) {
        var _a = serialized[unmappedClass], c = _a.c, m = _a.m;
        var javaClass = builder.addClass(unmappedClass, c);
        if (javaClass !== undefined) {
            for (var _i = 0, m_1 = m; _i < m_1.length; _i++) {
                var _b = m_1[_i], unmappedMethod = _b[0], mappedMethod = _b[1], unmappedDescriptor = _b[2];
                builder.addMethod(javaClass, unmappedMethod, unmappedDescriptor, mappedMethod);
            }
        }
    }
    return builder.build();
}
exports.EmptyMappings = new MappingsImpl_1.MappingsImpl(HashMap_1.HashMap.empty());
