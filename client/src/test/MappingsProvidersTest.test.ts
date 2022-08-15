import {getYarnBuilds, getYarnMappings} from "../mappings/providers/YarnMappingsProvider";
import {getIntermediaryMappings} from "../mappings/providers/IntermediaryMappingsProvider";
import {AllowAllMappings} from "../mappings/MappingsFilter";
import {
    IntermediaryToYarnMappingsProvider, OfficialToIntermediaryMappingsProvider,
    OfficialToSrgMappingsProvider
} from "../mappings/providers/MappingsProvider";
import {JavaClass, JavaMethod} from "../crash/model/Mappable";
import {MappingAssertions, testMappingsProvider} from "./MappingsProviderTester";

//remove this if it ever breaks (superseded by new tests)
test("Yarn mappings can be retrieved via new method", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings(versions[0].version, AllowAllMappings)
    expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.class_5973"), false))
        .toEqual(JavaClass.dotSeperated("net.minecraft.util.math.MathConstants"))
    expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365"), false))
        .toEqual(
            JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register").withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
        )
    expect(mappings.mapDescriptoredMethod(
        JavaMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
            .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"), false))
        .toEqual(
            JavaMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register").withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
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

test("New test - Yarn mappings can be retrieved via new method", async () => {
    const assertions: MappingAssertions = {
        classes: {
            "net.minecraft.class_5973": "net.minecraft.util.math.MathConstants"
        },
        methods: {
            "net.minecraft.class_3060#method_13365(Lcom/mojang/brigadier/CommandDispatcher;)V": "net.minecraft.server.command.ForceLoadCommand#register(Lcom/mojang/brigadier/CommandDispatcher;)V"
        }
    }
    await testMappingsProvider(IntermediaryToYarnMappingsProvider, "1.18.1", assertions);
}, 40000)

//remove this if it ever breaks
test("Intermediary mappings can be retrieved", async () => {
    const mappings = await getIntermediaryMappings("1.18.1", AllowAllMappings)
    expect(mappings.mapClass(JavaClass.dotSeperated("aqb"), false)).toEqual(JavaClass.dotSeperated("net.minecraft.class_1234"))
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
        .toEqual(JavaClass.dotSeperated("aqb"))
    expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.class_276", "method_1234"), true))
        .toEqual(JavaMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"))

    expect(mappings.mapDescriptoredMethod(
        JavaMethod.dotSeperated("net.minecraft.class_276", "method_1234").withDescriptor("(IIZ)V"), true)
    ).toEqual(JavaMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"))
}, 30000)

//	m	(II)V	a	method_1237
// 	m	(IIZ)V	a	method_1234
// 	m	(Z)V	a	method_1235
//	m	(Ldqx;)V	a	method_29329
//  m	()V	a	method_1238
test("New Tests - Intermediary mappings work", async () => {
    const assertions: MappingAssertions = {
        classes: {"aqb": "net.minecraft.class_1234"},
        methods: {
            "dqx#a(I)V": "net.minecraft.class_276#method_1232(I)V",
            "dqx#a(II)V": "net.minecraft.class_276#method_1237(II)V",
            "dqx#a(IIZ)V": "net.minecraft.class_276#method_1234(IIZ)V",
            "dqx#a(Z)V": "net.minecraft.class_276#method_1235(Z)V",
            "dqx#a(Ldqx;)V": "net.minecraft.class_276#method_29329(Lnet.minecraft.class_276;)V",
            "dqx#a()V": "net.minecraft.class_276#method_1238()V",
        }
    }
    await testMappingsProvider(OfficialToIntermediaryMappingsProvider,"1.18.1",assertions);
})

// Remove this if it ever breaks
test("Srg mappings can be retrieved", async () => {
    throw new Error("TODO")
    // const mappings = await getSrgMappings("1.7.10", AllowAllMappings)
    // expect(mappings.mapClass(JavaClass.dotSeperated("aky"), false))
    //     .toEqual(JavaClass.dotSeperated("net.minecraft.block.BlockFarmland"))
    //
    // const result = mappings.mapSimpleMethod(JavaMethod.dotSeperated("zs", "b"), false)
    // expect(
    //     result.method.classIn.getUnmappedFullName() === "net.minecraft.inventory.Container" &&
    //     ((result.method.getUnmappedMethodName() === "func_75142_b" && result.descriptor === "()V") ||
    //         (result.method.getUnmappedMethodName() === "func_94529_b" && result.descriptor === "(I)I") ||
    //         (result.method.getUnmappedMethodName() === "func_75137_b" && result.descriptor === "(II)V"))
    // ).toBeTruthy()
    //
    // expect(mappings.mapDescriptoredMethod(
    //     JavaMethod.dotSeperated("zs", "b").withDescriptor("(Laac;)V"), false)
    // )
    //     .toEqual(
    //         JavaMethod.dotSeperated("net.minecraft.inventory.Container", "func_82847_b").withDescriptor("(Lnet.minecraft.inventory.ICrafting;)V"),
    //     )
    //
    // expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.block.BlockFarmland"), true))
    //     .toEqual(JavaClass.dotSeperated("aky"))
    //
    // expect(mappings.mapSimpleMethod(JavaMethod.dotSeperated("net.minecraft.inventory.Container", "func_82847_b"), true))
    //     .toEqual(JavaMethod.dotSeperated("zs", "b").withDescriptor("(Laac;)V"))
    //
    // expect(mappings.mapDescriptoredMethod(
    //     JavaMethod.dotSeperated("net.minecraft.inventory.Container", "func_82847_b").withDescriptor("(Lnet.minecraft.inventory.ICrafting;)V"), true)
    // ).toEqual(JavaMethod.dotSeperated("zs", "b").withDescriptor("(Laac;)V"),)
}, 40000)
//MD: zs/b ()V net/minecraft/inventory/Container/func_75142_b ()V
// MD: zs/b (I)I net/minecraft/inventory/Container/func_94529_b (I)I
// MD: zs/b (II)V net/minecraft/inventory/Container/func_75137_b (II)V
// MD: zs/b (Laac;)V net/minecraft/inventory/Container/func_82847_b (Lnet/minecraft/inventory/ICrafting;)V
// MD: zs/b (Laay;)Z net/minecraft/inventory/Container/func_94531_b (Lnet/minecraft/inventory/Slot;)Z
// MD: zs/b (Lrb;)I net/minecraft/inventory/Container/func_94526_b (Lnet/minecraft/inventory/IInventory;)I
// MD: zs/b (Lyz;)V net/minecraft/inventory/Container/func_75134_a (Lnet/minecraft/entity/player/EntityPlayer;)V
// MD: zs/b (Lyz;I)Ladd; net/minecraft/inventory/Container/func_82846_b (Lnet/minecraft/entity/player/EntityPlayer;I)Lnet/minecraft/item/ItemStack;
test("New Tests - Srg mappings work", async () => {
    const assertions: MappingAssertions = {
        classes: {"aky": "net.minecraft.block.BlockFarmland"},
        methods: {
            "zs#b()V": "net.minecraft.inventory.Container#func_75142_b()V",
            "zs#b(I)I": "net.minecraft.inventory.Container#func_94529_b(I)I",
            "zs#b(II)V": "net.minecraft.inventory.Container#func_75137_b(II)V",
            "zs#b(Laac;)V": "net.minecraft.inventory.Container#func_82847_b(Lnet.minecraft.inventory.ICrafting;)V",
            "zs#b(Laay;)Z": "net.minecraft.inventory.Container#func_94531_b(Lnet.minecraft.inventory.Slot;)Z",
            "zs#b(Lrb;)I": "net.minecraft.inventory.Container#func_94526_b(Lnet.minecraft.inventory.IInventory;)I",
            "zs#b(Lyz;)V": "net.minecraft.inventory.Container#func_75134_a(Lnet.minecraft.entity.player.EntityPlayer;)V",
            "zs#b(Lyz;I)Ladd;": "net.minecraft.inventory.Container#func_82846_b(Lnet.minecraft.entity.player.EntityPlayer;I)Lnet.minecraft.item.ItemStack;",
        }
    }
    await testMappingsProvider(OfficialToSrgMappingsProvider,"1.7.10",assertions);
})

test("New Tests - TSrg1 mappings work", async () => {
    const assertions: MappingAssertions = {
        classes: {"aky": "net.minecraft.block.BlockFarmland"},
        methods: {
            "zs#b()V": "net.minecraft.inventory.Container#func_75142_b()V",
            "zs#b(I)I": "net.minecraft.inventory.Container#func_94529_b(I)I",
            "zs#b(II)V": "net.minecraft.inventory.Container#func_75137_b(II)V",
            "zs#b(Laac;)V": "net.minecraft.inventory.Container#func_82847_b(Lnet.minecraft.inventory.ICrafting;)V",
            "zs#b(Laay;)Z": "net.minecraft.inventory.Container#func_94531_b(Lnet.minecraft.inventory.Slot;)Z",
            "zs#b(Lrb;)I": "net.minecraft.inventory.Container#func_94526_b(Lnet.minecraft.inventory.IInventory;)I",
            "zs#b(Lyz;)V": "net.minecraft.inventory.Container#func_75134_a(Lnet.minecraft.entity.player.EntityPlayer;)V",
            "zs#b(Lyz;I)Ladd;": "net.minecraft.inventory.Container#func_82846_b(Lnet.minecraft.entity.player.EntityPlayer;I)Lnet.minecraft.item.ItemStack;",
        }
    }
    await testMappingsProvider(OfficialToSrgMappingsProvider,"1.12.2",assertions);
}, 40000)
