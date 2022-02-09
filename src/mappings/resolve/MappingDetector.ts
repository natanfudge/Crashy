import {BasicMappable, JavaClass, JavaMethod} from "crash-parser/src/model/Mappable";
import {MappingContext} from "./MappingStrategy";
import {MappingsNamespace} from "../MappingsNamespace";
import {LoaderType} from "crash-parser/src/model/RichCrashReport";

export function detectMappingNamespace(name: BasicMappable, context: MappingContext): MappingsNamespace {
    if (isIntermediaryName(name)) {
        return "Intermediary";
    } else if (context.isDeobfuscated) {
        return "Yarn";
    } else {
        switch (context.loader) {
            case LoaderType.Fabric:
                return "Intermediary"
            case LoaderType.Forge:
                return "Srg"
            case LoaderType.Vanilla:
                return "Official"
        }
    }
}

function isIntermediaryName(mappable: BasicMappable): boolean {
    if (mappable instanceof JavaMethod) {
        return isIntermediaryMethodName(mappable)
    } else {
        return isIntermediaryClassName(mappable)
    }
}

function isIntermediaryClassName(javaClass: JavaClass): boolean {
    return javaClass.getUnmappedSimpleName().startsWith("class_")
        && javaClass.getUnmappedPackageName() === "net.minecraft"
}

function isIntermediaryMethodName(javaMethod: JavaMethod): boolean {
    return isIntermediaryClassName(javaMethod.classIn)
        || javaMethod.getUnmappedMethodName().startsWith("method_")
}
