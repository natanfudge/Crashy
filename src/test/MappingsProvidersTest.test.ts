import {getYarnBuilds, getYarnMappings} from "../mappings/providers/YarnMappingsProvider";
import {getIntermediaryMappings} from "../mappings/providers/IntermediaryMappingsProvider";
import {JavaClass, JavaMethod} from "crash-parser/src/model/RichCrashReport";

test("Yarn mappings can be retrieved via new method", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings(versions[0].version)
    expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.class_5973"), false))
        .toEqual(JavaClass.dotSeperated("net.minecraft.util.math.MathConstants"))
    expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365"), false))
        .toEqual({
                method: JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register"),
                descriptor: "(Lcom/mojang/brigadier/CommandDispatcher;)V"
            }
        )
    expect(mappings.mapDescriptoredMethod({
        method: JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365"),
        descriptor: "(Lcom/mojang/brigadier/CommandDispatcher;)V"
    }, false))
        .toEqual({
                method: JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register"),
                descriptor: "(Lcom/mojang/brigadier/CommandDispatcher;)V"
            }
        )

    expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.util.math.MathConstants"), true))
        .toEqual(JavaClass.dotSeperated("net.minecraft.class_5973"))
    expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register"), true))
        .toEqual({
                method: JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365"),
                descriptor: "(Lcom/mojang/brigadier/CommandDispatcher;)V"
            }
        )
    expect(mappings.mapDescriptoredMethod({
            method: JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register"),
            descriptor: "(Lcom/mojang/brigadier/CommandDispatcher;)V"
        }
        , true))
        .toEqual({
                method: JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365"),
                descriptor: "(Lcom/mojang/brigadier/CommandDispatcher;)V"
            }
        )
}, 40000)

test("Intermediary mappings can be retrieved", async () => {
    const mappings = await getIntermediaryMappings("1.18.1")
    expect(mappings.mapClass(JavaClass.dotSeperated("aqb"), false)).toEqual( JavaClass.dotSeperated("net.minecraft.class_1234"))
    const result = mappings.mapSimpleMethod(JavaMethod.dotSeperated("dqx", "a"), false)
    expect(
        result.method.classIn.fullUnmappedName === "net.minecraft.class_276" &&
        ((result.method.name === "method_1232" && result.descriptor === "(I)V") ||
            (result.method.name === "method_1234" && result.descriptor === "(IIZ)V") ||
            (result.method.name === "method_1234" && result.descriptor === "(FFFF)V"))
    ).toBeTruthy()

    expect(mappings.mapDescriptoredMethod({
        method: JavaMethod.dotSeperated("dqx", "a"),
        descriptor: "(IIZ)V"
    }, false)).toEqual(
        {
            method: JavaMethod.dotSeperated("net.minecraft.class_276", "method_1234"),
            descriptor: "(IIZ)V"
        }
    )

    expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.class_1234"), true))
        .toEqual(JavaClass.dotSeperated("aqb") )
    expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.class_276","method_1234"),true))
        .toEqual({method: JavaMethod.dotSeperated("dqx", "a"), descriptor: "(IIZ)V"})

    expect(mappings.mapDescriptoredMethod({
        method:JavaMethod.dotSeperated("net.minecraft.class_276", "method_1234") ,
        descriptor: "(IIZ)V"
    }, true)).toEqual(
        {
            method: JavaMethod.dotSeperated("dqx", "a"),
            descriptor: "(IIZ)V"
        }
    )
}, 30000)

