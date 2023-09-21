// In these versions, Forge uses pure SRG for the names in the Minecraft runtime.
// In later versions, Forge uses a combination of SRG and Mojmap. This method is called 'ForgeRuntime' namespace.
import {Mappings} from "../Mappings";
import {DescriptoredMethod, JavaClass, JavaMethod, SimpleMethod} from "../../crash/model/Mappable";
import {HashSet} from "../../fudge-lib/collections/hashmap/HashSet";

const forgeSrgRuntimeVersions = HashSet.of(
    '1.14.2', '1.14.3', '1.14',
    '1.15', '1.12', '1.15.1',
    '1.14.4', '1.11', '1.8',
    '1.7.10', '1.10.2', '1.9',
    '1.13.1', '1.14.1', '1.8.8',
    '1.8.9', '1.9.4', '1.13.2',
    '1.13', "1.15.2", "1.16", "1.16.1", "1.16.2", "1.16.3", "1.16.4", "1.16.5"
)

export function forgeUsesPureSrgForMinecraftVersion(version: string): boolean {
    return forgeSrgRuntimeVersions.contains(version)
}

export class ForgeRuntimeToOfficialSrgMappings implements Mappings {
    private mojmap: Mappings;
    private reverseAll: boolean;

    private id: string

    constructor(mojmap: Mappings, reverse: boolean, id: string) {
        this.mojmap = mojmap;
        this.reverseAll = reverse;
        this.id = id;
    }

    mapClass(className: JavaClass, reverse: boolean): JavaClass {
        return this.mojmap.mapClass(className, xor(reverse, this.reverseAll))
    }

    // Note: descriptors are not remapped.
    // This should be ok for our use case since this class is not used as an intermediary step (aside from being used back to back with itself)
    mapDescriptoredMethod(methodName: DescriptoredMethod, reverse: boolean): DescriptoredMethod {
        const mojmapClass = methodName.method.classIn;
        const officialClass = this.mapClass(mojmapClass, reverse)
        return methodName.withClass(officialClass)
    }

    mapSimpleMethod(methodName: SimpleMethod, reverse: boolean): JavaMethod {
        const mojmapClass = methodName.classIn;
        const officialClass = this.mapClass(mojmapClass,reverse)
        return methodName.withClass(officialClass)
    }

}

/**
 * Used to make the flip the 'reverse' parameter if 'this.reverseAll' is true
 */
function xor(bool1: boolean, bool2: boolean): boolean {
    if (bool1) return !bool2
    else return bool2;
}

//TODO: merge these two classes into one

export class OfficialSrgToSrgMappings implements Mappings {
    private srg: Mappings;

    constructor(srg: Mappings) {
        this.srg = srg;
    }

    mapClass(className: JavaClass, reverse: boolean): JavaClass {
        return this.srg.mapClass(className, reverse)
    }

    mapDescriptoredMethod(methodName: DescriptoredMethod, reverse: boolean): DescriptoredMethod {
        const officialClass = methodName.method.classIn;
        const srgClass = this.mapClass(officialClass, reverse)
        return methodName.withClass(srgClass)
    }

    mapSimpleMethod(methodName: SimpleMethod, reverse: boolean): JavaMethod {
        const officialClass = methodName.classIn;
        const srgClass = this.mapClass(officialClass, reverse)
        return methodName.withClass(srgClass)
    }

}