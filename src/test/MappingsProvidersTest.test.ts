import {getYarnBuilds, getYarnMappings} from "../mappings/providers/YarnMappingsProvider";
import {getIntermediaryMappings} from "../mappings/providers/IntermediaryMappingsProvider";
import {AllowAllMappings} from "../mappings/storage/MappingsBuilder";
import {JavaClass, JavaMethod } from "crash-parser/src/model/Mappable";
import {getSrgMappings} from "../mappings/providers/SrgMappingsProvider";

test("Yarn mappings can be retrieved via new method", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings(versions[0].version, AllowAllMappings)
    expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.class_5973"), false))
        .toEqual(JavaClass.dotSeperated("net.minecraft.util.math.MathConstants"))
    expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365"), false))
        .toEqual({
                method: JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register"),
                descriptor: "(Lcom/mojang/brigadier/CommandDispatcher;)V"
            }
        )
    expect(mappings.mapDescriptoredMethod(
        JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
            .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"), false))
        .toEqual({
                method: JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register"),
                descriptor: "(Lcom/mojang/brigadier/CommandDispatcher;)V"
            }
        )

    expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.util.math.MathConstants"), true))
        .toEqual(JavaClass.dotSeperated("net.minecraft.class_5973"))
    expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register"), true))
        .toEqual(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
            .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"))
    expect(mappings.mapDescriptoredMethod(
        JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register")
            .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"), true)
    )
        .toEqual(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
            .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
        )
}, 40000)

test("Intermediary mappings can be retrieved", async () => {
    const mappings = await getIntermediaryMappings("1.18.1", AllowAllMappings)
    expect(mappings.mapClass(JavaClass.dotSeperated("aqb"), false)).toEqual( JavaClass.dotSeperated("net.minecraft.class_1234"))
    const result = mappings.mapSimpleMethod(JavaMethod.dotSeperated("dqx", "a"), false)
    expect(
        result.method.classIn.getUnmappedFullName() === "net.minecraft.class_276" &&
        ((result.method.getUnmappedMethodName() === "method_1232" && result.descriptor === "(I)V") ||
            (result.method.getUnmappedMethodName() === "method_1234" && result.descriptor === "(IIZ)V") ||
            (result.method.getUnmappedMethodName() === "method_1234" && result.descriptor === "(FFFF)V"))
    ).toBeTruthy()

    expect(mappings.mapDescriptoredMethod(
       JavaMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"), false))
        .toEqual(
            JavaMethod.dotSeperated("net.minecraft.class_276", "method_1234").withDescriptor("(IIZ)V"))

    expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.class_1234"), true))
        .toEqual(JavaClass.dotSeperated("aqb") )
    expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.class_276","method_1234"),true))
        .toEqual( JavaMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"))

    expect(mappings.mapDescriptoredMethod(
        JavaMethod.dotSeperated("net.minecraft.class_276", "method_1234").withDescriptor("(IIZ)V"), true)
    ).toEqual(JavaMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"))
}, 30000)


test("Srg mappings can be retrieved", async () => {
    const mappings = await getSrgMappings("1.7.10", AllowAllMappings)
    const x = 2;
    expect(mappings.mapClass(JavaClass.dotSeperated("aky"), false))
        .toEqual( JavaClass.dotSeperated("net.minecraft.block.BlockFarmland"))

    // const result = mappings.mapSimpleMethod(JavaMethod.dotSeperated("dqx", "a"), false)
    // expect(
    //     result.method.classIn.getUnmappedFullName() === "net.minecraft.class_276" &&
    //     ((result.method.getUnmappedMethodName() === "method_1232" && result.descriptor === "(I)V") ||
    //         (result.method.getUnmappedMethodName() === "method_1234" && result.descriptor === "(IIZ)V") ||
    //         (result.method.getUnmappedMethodName() === "method_1234" && result.descriptor === "(FFFF)V"))
    // ).toBeTruthy()
    //
    // expect(mappings.mapDescriptoredMethod(
    //     JavaMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"), false))
    //     .toEqual(
    //         JavaMethod.dotSeperated("net.minecraft.class_276", "method_1234").withDescriptor("(IIZ)V"))
    //
    // expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.class_1234"), true))
    //     .toEqual(JavaClass.dotSeperated("aqb") )
    // expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.class_276","method_1234"),true))
    //     .toEqual( JavaMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"))
    //
    // expect(mappings.mapDescriptoredMethod(
    //     JavaMethod.dotSeperated("net.minecraft.class_276", "method_1234").withDescriptor("(IIZ)V"), true)
    // ).toEqual(JavaMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"))
}, 30000)
