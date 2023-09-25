import {getYarnBuilds, getYarnMappings} from "../../mappings/providers/YarnMappingsProvider";
import {getIntermediaryMappings} from "../../mappings/providers/IntermediaryMappingsProvider";
import {AllowAllMappings} from "../../mappings/MappingsFilter";
import {
    IntermediaryToYarnMappingsProvider, OfficialToIntermediaryMappingsProvider, OfficialToMojmapMappingsProvider,
    OfficialToSrgMappingsProvider
} from "../../mappings/providers/MappingsProvider";
import {DescriptoredMethod, JavaClass, SimpleMethod} from "../../crash/model/Mappable";
import {MappingAssertions, testMappingsProvider} from "./MappingsProviderTester";
import {getMcpBuilds} from "../../mappings/providers/McpMappingsProvider";
import {expect, test} from 'vitest'
import fetch from "node-fetch"
import {getQuiltBuilds, getQuiltMappings} from "../../mappings/providers/QuiltMappingsProvider";
import "../../fudge-lib/extensions/ExtensionsImpl"
import {fetcher} from "../../fudge-lib/methods/Http";

// @ts-ignore
fetcher.fetch = fetch

//remove this if it ever breaks (superseded by new tests)
test("Yarn mappings can be retrieved via new method", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings(versions[0].version, AllowAllMappings)
    expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.class_5973"), false))
        .toEqual(JavaClass.dotSeperated("net.minecraft.util.math.MathConstants"))
    expect(mappings.mapSimpleMethod(SimpleMethod.dotSeperated("net.minecraft.class_3060", "method_13365"), false))
        .toEqual(
            SimpleMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register").withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
        )
    expect(mappings.mapDescriptoredMethod(
        SimpleMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
            .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"), false))
        .toEqual(
            SimpleMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register").withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V")
        )

    expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.util.math.MathConstants"), true))
        .toEqual(JavaClass.dotSeperated("net.minecraft.class_5973"))
    expect(mappings.mapSimpleMethod(SimpleMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register"), true))
        .toEqual(SimpleMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
            .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"))
    expect(mappings.mapDescriptoredMethod(
        SimpleMethod.dotSeperated("net.minecraft.server.command.ForceLoadCommand", "register")
            .withDescriptor("(Lcom/mojang/brigadier/CommandDispatcher;)V"), true)
    )
        .toEqual(SimpleMethod.dotSeperated("net.minecraft.class_3060", "method_13365")
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
    const result = mappings.mapSimpleMethod(SimpleMethod.dotSeperated("dqx", "a"), false) as DescriptoredMethod;

    expect(
        result.method.classIn.getUnmappedFullClassName() === "net.minecraft.class_276" &&
        ((result.method.getUnmappedMethodName() === "method_1232" && result.descriptor === "(I)V") ||
            (result.method.getUnmappedMethodName() === "method_1234" && result.descriptor === "(IIZ)V") ||
            (result.method.getUnmappedMethodName() === "method_1234" && result.descriptor === "(FFFF)V"))
    ).toBeTruthy()

    expect(mappings.mapDescriptoredMethod(
        SimpleMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"), false))
        .toEqual(
            SimpleMethod.dotSeperated("net.minecraft.class_276", "method_1234").withDescriptor("(IIZ)V"))

    expect(mappings.mapClass(JavaClass.dotSeperated("net.minecraft.class_1234"), true))
        .toEqual(JavaClass.dotSeperated("aqb"))
    expect(mappings.mapSimpleMethod(SimpleMethod.dotSeperated("net.minecraft.class_276", "method_1234"), true))
        .toEqual(SimpleMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"))

    expect(mappings.mapDescriptoredMethod(
        SimpleMethod.dotSeperated("net.minecraft.class_276", "method_1234").withDescriptor("(IIZ)V"), true)
    ).toEqual(SimpleMethod.dotSeperated("dqx", "a").withDescriptor("(IIZ)V"))
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
            "dqx#a(Ldqx;)V": "net.minecraft.class_276#method_29329(Lnet/minecraft/class_276;)V",
            "dqx#a()V": "net.minecraft.class_276#method_1238()V",
        }
    }
    await testMappingsProvider(OfficialToIntermediaryMappingsProvider,"1.18.1",assertions);
}, 30_000)


//MD: zs/b ()V net/minecraft/inventory/Container/func_75142_b ()V
// MD: zs/b (I)I net/minecraft/inventory/Container/func_94529_b (I)I
// MD: zs/b (II)V net/minecraft/inventory/Container/func_75137_b (II)V
// MD: zs/b (Laac;)V net/minecraft/inventory/Container/func_82847_b (Lnet/minecraft/inventory/ICrafting;)V
// MD: zs/b (Laay;)Z net/minecraft/inventory/Container/func_94531_b (Lnet/minecraft/inventory/Slot;)Z
// MD: zs/b (Lrb;)I net/minecraft/inventory/Container/func_94526_b (Lnet/minecraft/inventory/IInventory;)I
// MD: zs/b (Lyz;)V net/minecraft/inventory/Container/func_75134_a (Lnet/minecraft/entity/player/EntityPlayer;)V
// MD: zs/b (Lyz;I)Ladd; net/minecraft/inventory/Container/func_82846_b (Lnet/minecraft/entity/player/EntityPlayer;I)Lnet/minecraft/item/ItemStack;
test("Srg mappings work", async () => {
    const assertions: MappingAssertions = {
        classes: {"aky": "net.minecraft.block.BlockFarmland"},
        methods: {
            "zs#b()V": "net.minecraft.inventory.Container#func_75142_b()V",
            "zs#b(I)I": "net.minecraft.inventory.Container#func_94529_b(I)I",
            "zs#b(II)V": "net.minecraft.inventory.Container#func_75137_b(II)V",
            "zs#b(Laac;)V": "net.minecraft.inventory.Container#func_82847_b(Lnet/minecraft/inventory/ICrafting;)V",
            "zs#b(Laay;)Z": "net.minecraft.inventory.Container#func_94531_b(Lnet/minecraft/inventory/Slot;)Z",
            "zs#b(Lrb;)I": "net.minecraft.inventory.Container#func_94526_b(Lnet/minecraft/inventory/IInventory;)I",
            "zs#b(Lyz;)V": "net.minecraft.inventory.Container#func_75134_a(Lnet/minecraft/entity/player/EntityPlayer;)V",
            "zs#b(Lyz;I)Ladd;": "net.minecraft.inventory.Container#func_82846_b(Lnet/minecraft/entity/player/EntityPlayer;I)Lnet/minecraft/item/ItemStack;",
        }
    }
    await testMappingsProvider(OfficialToSrgMappingsProvider,"1.7.10",assertions);
})

// zq net/minecraft/village/VillageCollection
// 	a ()V func_75544_a
// 	a (Lamu;)V func_82566_a
// 	a (Laym;)Ljava/lang/String; func_176062_a
// 	a (Let;)V func_176060_a
// 	a (Let;I)Lzo; func_176056_a
// 	a (Let;Lfa;I)I func_176061_a
// 	a (Lfy;)V func_76184_a
test("TSrg1 mappings work", async () => {
    const assertions: MappingAssertions = {
        classes: {"aky": "net.minecraft.item.crafting.ShieldRecipes"},
        methods: {
            "zs#a(Laed;)Z": "net.minecraft.entity.passive.EntityAmbientCreature#func_184652_a(Lnet/minecraft/entity/player/EntityPlayer;)Z",
            "zq#a()V": "net.minecraft.village.VillageCollection#func_75544_a()V",
            "zq#a(Lamu;)V": "net.minecraft.village.VillageCollection#func_82566_a(Lnet/minecraft/world/World;)V",
            "zq#a(Laym;)Ljava/lang/String;": "net.minecraft.village.VillageCollection#func_176062_a(Lnet/minecraft/world/WorldProvider;)Ljava/lang/String;",
            "zq#a(Let;)V": "net.minecraft.village.VillageCollection#func_176060_a(Lnet/minecraft/util/math/BlockPos;)V",
            "zq#a(Let;I)Lzo;": "net.minecraft.village.VillageCollection#func_176056_a(Lnet/minecraft/util/math/BlockPos;I)Lnet/minecraft/village/Village;",
            "zq#a(Let;Lfa;I)I": "net.minecraft.village.VillageCollection#func_176061_a(Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/util/EnumFacing;I)I",
            "zq#a(Lfy;)V": "net.minecraft.village.VillageCollection#func_76184_a(Lnet/minecraft/nbt/NBTTagCompound;)V",
        }
    }
    await testMappingsProvider(OfficialToSrgMappingsProvider,"1.12.2",assertions);
}, 40000)

// zq net/minecraft/src/C_141897_ 141897
// 	<init> ()V <init> 180106
// 	a (Ldm;)Z m_180112_ 180112
// 		static
// 		0 o p_180113_ 180113
// 	a (Lcom/mojang/brigadier/CommandDispatcher;)V m_180110_ 180110
// 		static
// 		0 o p_180111_ 180111
// 	a (Laxk;Lcom/mojang/brigadier/context/CommandContext;)I m_180107_ 180107
// 		static
// 		0 o p_180108_ 180108
// 		1 o p_180109_ 180109
// 	a (Ldm;Laxk;Lgh;)I m_180114_ 180114
// 		static
// 		0 o p_180115_ 180115
// 		1 o p_180116_ 180116
// 		2 o p_180117_ 180117
test("Tsrg2 mappings work", async () => {
    const assertions: MappingAssertions = {
        classes: {"zq": "net.minecraft.src.C_141897_"},
        methods: {
            "zq#a(Ldm;)Z" :"net.minecraft.src.C_141897_#m_180112_(Lnet/minecraft/src/C_2969_;)Z",
            "zq#a(Lcom/mojang/brigadier/CommandDispatcher;)V" :"net.minecraft.src.C_141897_#m_180110_(Lcom/mojang/brigadier/CommandDispatcher;)V",
            "zq#a(Laxk;Lcom/mojang/brigadier/context/CommandContext;)I" :"net.minecraft.src.C_141897_#m_180107_(Lnet/minecraft/src/C_528_;Lcom/mojang/brigadier/context/CommandContext;)I",
            "zq#a(Ldm;Laxk;Lgh;)I" :"net.minecraft.src.C_141897_#m_180114_(Lnet/minecraft/src/C_2969_;Lnet/minecraft/src/C_528_;Lnet/minecraft/src/C_4675_;)I",
            // "zs#a(Laed;)Z": "net.minecraft.entity.passive.EntityAmbientCreature#func_184652_a(Lnet/minecraft/entity/player/EntityPlayer;)Z",
            // "zq#a()V": "net.minecraft.village.VillageCollection#func_75544_a()V",
            // "zq#a(Lamu;)V": "net.minecraft.village.VillageCollection#func_82566_a(Lnet/minecraft/world/World;)V",
            // "zq#a(Laym;)Ljava/lang/String;": "net.minecraft.village.VillageCollection#func_176062_a(Lnet/minecraft/world/WorldProvider;)Ljava/lang/String;",
            // "zq#a(Let;)V": "net.minecraft.village.VillageCollection#func_176060_a(Lnet/minecraft/util/math/BlockPos;)V",
            // "zq#a(Let;I)Lzo;": "net.minecraft.village.VillageCollection#func_176056_a(Lnet/minecraft/util/math/BlockPos;I)Lnet/minecraft/village/Village;",
            // "zq#a(Let;Lfa;I)I": "net.minecraft.village.VillageCollection#func_176061_a(Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/util/EnumFacing;I)I",
            // "zq#a(Lfy;)V": "net.minecraft.village.VillageCollection#func_76184_a(Lnet/minecraft/nbt/NBTTagCompound;)V",
        }
    }
    await testMappingsProvider(OfficialToSrgMappingsProvider,"1.18.1",assertions);
}, 40000)
test("Tsrg mappings work in 1.17", async () => {
    const assertions: MappingAssertions = {
        classes: {"zq": "net.minecraft.src.C_5369_"},
        methods: {
        }
    }
    await testMappingsProvider(OfficialToSrgMappingsProvider,"1.17",assertions);
}, 40000)

test("Mcp mapping builds can be fetched", async() => {
    const builds = await getMcpBuilds("1.14.2")
    expect(builds).toEqual([53])
})
// net.minecraft.core.BlockPos -> gp:
// net.minecraft.core.Direction$Axis -> gv$a:
// net.minecraft.core.BlockPos$MutableBlockPos -> gp$a:
// net.minecraft.core.Direction -> gv:
// net.minecraft.world.level.BlockGetter -> cjc:
test("Mojang mappings work", async () => {
    const assertions: MappingAssertions = {
        classes: {"k":"net.minecraft.BlockUtil"},
        methods: {
            "k#a(Lgp;Lgv$a;ILgv$a;ILjava/util/function/Predicate;)Lk$a;":
                "net.minecraft.BlockUtil#getLargestRectangleAround(" +
                "Lnet/minecraft/core/BlockPos;Lnet/minecraft/core/Direction$Axis;" +
                "ILnet/minecraft/core/Direction$Axis;ILjava/util/function/Predicate;" +
                ")Lnet/minecraft/BlockUtil$FoundRectangle;",
            "k#a(Ljava/util/function/Predicate;Lgp$a;Lgv;I)I":
                "net.minecraft.BlockUtil#getLimit(" +
                "Ljava/util/function/Predicate;Lnet/minecraft/core/BlockPos$MutableBlockPos;Lnet/minecraft/core/Direction;I" +
                ")I",
            "k#a([I)Lcom/mojang/datafixers/util/Pair;":"net.minecraft.BlockUtil#getMaxRectangleLocation([I)Lcom/mojang/datafixers/util/Pair;",
            "k#a(Lcjc;Lgp;Lcmt;Lgv;Lcmt;)Ljava/util/Optional;":"net.minecraft.BlockUtil#getTopConnectedBlock(" +
                "Lnet/minecraft/world/level/BlockGetter;Lnet/minecraft/core/BlockPos;" +
                "Lnet/minecraft/world/level/block/Block;Lnet/minecraft/core/Direction;" +
                "Lnet/minecraft/world/level/block/Block;" +
                ")Ljava/util/Optional;",
        }
    }
    await testMappingsProvider(OfficialToMojmapMappingsProvider,"1.19.3",assertions);
})


test("Quilt mappings work", async () => {
    const builds = await getQuiltBuilds("1.19.2")
    expect(builds).toContainEqual("1.19.2+build.22")
    expect(builds).not.toContainEqual("1.19.2+build.14")

    const mappings = await getQuiltMappings({build: builds[0], minecraftVersion: "1.19.2"}, AllowAllMappings)
    const x = 2
})