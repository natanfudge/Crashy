/*
Credit to https://github.com/wagyourtail/wagyourtail.xyz/blob/master/views/sections/Projects/MinecraftMappingViewer/App/app.ts
 */
// type ReleaseVersion = `${number}.${number}` | `${number}.${number}.${number}`;
// type Snapshot = `${number}w${number}${"a"|"b"|"c"|"d"|"e"}` | `${ReleaseVersion}-pre${number}` | `${ReleaseVersion}-rc${number}`;
// type MCVersionSlug =  ReleaseVersion | Snapshot;
import {MappingsNamespace} from "../MappingsNamespace";

type MCVersionSlug = string;

export const NO_CORS_BYPASS = "/Projects/CORS-Bypass/App";

export function mcVersionCompare(a: MCVersionSlug, b: MCVersionSlug) {
    if (a === b) return 0;
    // @ts-ignore
    for (const e of versionSelect.children) {
        if (e.value === a) return 1;
        if (e.value === b) return -1;
    }
    throw Error("MC version not in list.");
}

export function profiler(thing: string) {
    // currently no-op
}
export function profilerDel(thing: string) {
    // currently no-op
}

// TODO: try to remove this
const classes: Map<string, ClassData> = new Map();

async function getOrAddClass(class_name: string, mapping: MappingsNamespace) {
    if (mapping === "Official" && this.classes.has(class_name)) {
        return this.classes.get(class_name);
    }
    for (const clazz of this.classes.values()) {
        if (clazz.getMapping(mapping) === class_name) {
            return clazz;
        }
        if (clazz.getMapping("Official") === class_name) {
            return clazz;
        }
    }
    if (mapping !== "Official") console.log(`adding class: ${class_name}`);
    const clazz = new ClassData(this, class_name);
    this.classes.set(class_name, clazz);
    return clazz;
}
