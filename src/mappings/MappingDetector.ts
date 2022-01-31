import {Mappable, MappingContext} from "./MappingMethod";
import {MappingsNamespace} from "./MappingsNamespace";
import {JavaClass, JavaMethod, LoaderType} from "crash-parser/src/model/RichCrashReport";

export function detectMappingNamespace(name: Mappable, context: MappingContext): MappingsNamespace {
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

function isIntermediaryName(mappable: Mappable): boolean {
    if (isJavaMethod(mappable)) {
        return isIntermediaryMethodName(mappable)
    } else {
        return isIntermediaryClassName(mappable)
    }
}

function isJavaMethod(mappable: Mappable): mappable is JavaMethod {
    return "class" in mappable;
}

function isIntermediaryClassName(javaClass: JavaClass): boolean {
    return javaClass.simpleName.startsWith("class_")
        && javaClass.packageName === "net.minecraft"
}

function isIntermediaryMethodName(javaMethod: JavaMethod): boolean {
    return isIntermediaryClassName(javaMethod.classIn)
        || javaMethod.name.startsWith("method_")
}
