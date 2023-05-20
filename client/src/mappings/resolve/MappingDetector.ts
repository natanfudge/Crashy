import {MappingContext} from "./MappingStrategy";
import {MappingsNamespace} from "../MappingsNamespace";
import {JavaClass, SimpleMappable, SimpleMethod} from "../../crash/model/Mappable";
import {LoaderType} from "../../crash/model/RichCrashReport";
import {forgeUsesPureSrgForMinecraftVersion} from "../providers/ForgeRuntimeMappingsProvider";

export function detectMappingNamespace(name: SimpleMappable, context: MappingContext): MappingsNamespace {
    if (isIntermediaryName(name)) {
        return "Intermediary";
    } else if (context.isDeobfuscated) {
        return "Yarn";
    } else {
        switch (context.loader) {
            case LoaderType.Fabric:
            case LoaderType.Quilt:
                return "Intermediary"
            case LoaderType.Forge:
                if (forgeUsesPureSrgForMinecraftVersion(context.minecraftVersion)) {
                    return "Srg"
                } else {
                    return "ForgeRuntime"
                }
            case LoaderType.Vanilla:
                return "Official"
        }
    }
}

function isIntermediaryName(mappable: SimpleMappable): boolean {
    if (mappable instanceof SimpleMethod) {
        return isIntermediaryMethodName(mappable)
    } else {
        return isIntermediaryClassName(mappable)
    }
}

function isIntermediaryClassName(javaClass: JavaClass): boolean {
    return javaClass.getUnmappedSimpleName().startsWith("class_")
        && javaClass.getUnmappedPackageName() === "net.minecraft"
}

function isIntermediaryMethodName(javaMethod: SimpleMethod): boolean {
    return isIntermediaryClassName(javaMethod.classIn)
        || javaMethod.getUnmappedMethodName().startsWith("method_")
}

