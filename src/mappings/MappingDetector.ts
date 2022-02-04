import { MappingContext} from "./MappingMethod";
import {MappingsNamespace} from "./MappingsNamespace";
import { LoaderType} from "crash-parser/src/model/RichCrashReport";
import {AnyMappable, BasicMappable, JavaClass, JavaMethod, Mappable} from "./Mappable";

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
    if (isJavaMethod(mappable)) {
        return isIntermediaryMethodName(mappable)
    } else {
        return isIntermediaryClassName(mappable)
    }
}

function isJavaMethod(mappable: BasicMappable): mappable is JavaMethod {
    return "classIn" in mappable;
}

function isIntermediaryClassName(javaClass: JavaClass): boolean {
    return javaClass.getSimpleName().startsWith("class_")
        && javaClass.getPackageName() === "net.minecraft"
}

function isIntermediaryMethodName(javaMethod: JavaMethod): boolean {
    return isIntermediaryClassName(javaMethod.classIn)
        || javaMethod.name.startsWith("method_")
}
