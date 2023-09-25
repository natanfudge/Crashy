import {testFabricCrashReport, testForgeCrashReport} from "../testlogs/TestCrashes";
import {TestBuggyParseCrash} from "../testlogs/TestBuggyParseCrash";
import {BarebonesFabricCrash} from "../testlogs/BarebonesFabricCrash";
import {TestVerifyErrorCrash} from "../testlogs/TestVerifyErrorCrash";
import {BrokenTimeCrash} from "../testlogs/BrokenTimeCrash";
import {TestEmptySectionCrash} from "../testlogs/TestEmptySectionCrash";
import {BrokenSectionCrash} from "../testlogs/BrokenSectionCrash";
import {CrashReport} from "../../crash/model/CrashReport";
import {enrichCrashReport, parseCrashReportRich} from "../../crash/parser/CrashReportEnricher";
import {ExceptionLocation, ExceptionStackmapTable, LoaderType} from "../../crash/model/RichCrashReport";
import {parseCrashReport} from "../../crash/parser/CrashReportParser";
import {NecFabricCrash} from "../testlogs/NecFabricCrash";
import {expect, test} from 'vitest'
import {loliCrash} from "../testlogs/LoliCrash";
import {MissingTitleLog} from "../testlogs/MIssingTitleLog";
import {NoIndentCrash} from "../testlogs/NoIndentCrash";
import {SeeminglySimpleLog} from "../testlogs/SeeminglySimpleLog";
import "../../fudge-lib/extensions/ExtensionsImpl"

export function testForgeCrashReportParse(report: CrashReport) {
    expect(report.wittyComment).toEqual("Don't be sad, have a hug! <3")
    expect(report.dateTime).toEqual("15.08.21 17:36")
    expect(report.description).toEqual("Unexpected error")
    const stacktrace = report.stacktrace
    expect(stacktrace.message).toEqual("java.lang.NullPointerException: Unexpected error")
    expect(stacktrace.trace).toEqual([
        "net.minecraft.client.renderer.GameRenderer.func_78473_a(GameRenderer.java:344) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,xf:OptiFine:default,pl:mixin:APP:cameraoverhaul.mixins.json:modern.GameRendererMixin,pl:mixin:A}",
        "net.minecraft.client.Minecraft.func_71407_l(Minecraft.java:1422) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
        "net.minecraft.client.Minecraft.func_195542_b(Minecraft.java:953) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
        "net.minecraft.client.Minecraft.func_99999_d(Minecraft.java:607) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
        "net.minecraft.client.Minecraft.handler$zzh000$afterCrashHandled(Minecraft.java:2540) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
        "net.minecraft.client.Minecraft.func_99999_d(Minecraft.java:623) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
        "net.minecraft.client.main.Main.main(Main.java:184) [?:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:A,pl:runtimedistcleaner:A}",
        "sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_51] {}",
        "sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_51] {}",
        "sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_51] {}",
        "java.lang.reflect.Method.invoke(Method.java:497) ~[?:1.8.0_51] {}",
        "net.minecraftforge.fml.loading.FMLClientLaunchProvider.lambda$launchService$0(FMLClientLaunchProvider.java:51) [forge-1.16.5-36.1.16.jar:36.1] {}",
        "net.minecraftforge.fml.loading.FMLClientLaunchProvider$$Lambda$451/3671592.call(Unknown Source) [forge-1.16.5-36.1.16.jar:36.1] {}",
        "cpw.mods.modlauncher.LaunchServiceHandlerDecorator.launch(LaunchServiceHandlerDecorator.java:37) [modlauncher-8.0.9.jar:?] {re:classloading}",
        "cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:54) [modlauncher-8.0.9.jar:?] {re:classloading}",
        "cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:72) [modlauncher-8.0.9.jar:?] {re:classloading}",
        "cpw.mods.modlauncher.Launcher.run(Launcher.java:82) [modlauncher-8.0.9.jar:?] {re:classloading}",
        "cpw.mods.modlauncher.Launcher.main(Launcher.java:66) [modlauncher-8.0.9.jar:?] {re:classloading}",
    ])
    expect(report.sections.length).toEqual(2)
    const section = report.sections[0]
    expect(section.title).toEqual("Affected level")
    const sectionDetails = section.details!
    expect(sectionDetails["All players"]).toEqual("1 total; [ClientPlayerEntity['Kyartyi1337'/804445, l='ClientLevel', x=-712.19, y=64.00, z=-228.79]]")
    expect(sectionDetails["Chunk stats"]).toEqual("Client Chunk Cache: 361, 225")
    expect(sectionDetails["Level dimension"]).toEqual("minecraft:overworld")
    expect(sectionDetails["Level spawn location"]).toEqual("World: (-245,64,-292), Chunk: (at 11,4,12 in -16,-19; contains blocks -256,0,-304 to -241,255,-289), Region: (-1,-1; contains chunks -32,-32 to -1,-1, blocks -512,0,-512 to -1,255,-1)")
    expect(sectionDetails["Level time"]).toEqual("29891 game time, 126559960 day time")
    expect(sectionDetails["Server brand"]).toEqual("Waterfall <- Airplane")
    expect(sectionDetails["Server type"]).toEqual("Non-integrated multiplayer server")

    expect(section.stacktrace).toEqual([
            "net.minecraft.client.world.ClientWorld.func_72914_a(ClientWorld.java:617) ~[?:?] {re:classloading,xf:OptiFine:default}",
            "net.minecraft.client.Minecraft.func_71396_d(Minecraft.java:2029) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
            "fudge.notenoughcrashes.mixinhandlers.InGameCatcher.handleClientCrash(InGameCatcher.java:28) ~[?:?] {re:mixin,re:classloading}",
            "net.minecraft.client.Minecraft.modify$zzh000$onCrash(Minecraft.java:2548) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
            "net.minecraft.client.Minecraft.func_99999_d(Minecraft.java:628) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
            "net.minecraft.client.Minecraft.handler$zzh000$afterCrashHandled(Minecraft.java:2540) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
            "net.minecraft.client.Minecraft.func_99999_d(Minecraft.java:623) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
            "net.minecraft.client.main.Main.main(Main.java:184) [?:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:A,pl:runtimedistcleaner:A}",
            "sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_51] {}",
            "sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_51] {}",
            "sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_51] {}",
            "java.lang.reflect.Method.invoke(Method.java:497) ~[?:1.8.0_51] {}",
            "net.minecraftforge.fml.loading.FMLClientLaunchProvider.lambda$launchService$0(FMLClientLaunchProvider.java:51) [forge-1.16.5-36.1.16.jar:36.1] {}",
            "net.minecraftforge.fml.loading.FMLClientLaunchProvider$$Lambda$451/3671592.call(Unknown Source) [forge-1.16.5-36.1.16.jar:36.1] {}",
            "cpw.mods.modlauncher.LaunchServiceHandlerDecorator.launch(LaunchServiceHandlerDecorator.java:37) [modlauncher-8.0.9.jar:?] {re:classloading}",
            "cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:54) [modlauncher-8.0.9.jar:?] {re:classloading}",
            "cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:72) [modlauncher-8.0.9.jar:?] {re:classloading}",
            "cpw.mods.modlauncher.Launcher.run(Launcher.java:82) [modlauncher-8.0.9.jar:?] {re:classloading}",
            "cpw.mods.modlauncher.Launcher.main(Launcher.java:66) [modlauncher-8.0.9.jar:?] {re:classloading}"
        ]
    )

    const systemDetails = report.sections[1].details!

    expect(systemDetails["Minecraft Version"]).toEqual("1.16.5");
    expect(systemDetails["Minecraft Version ID"]).toEqual("1.16.5");
    expect(systemDetails["Operating System"]).toEqual(
        "Windows 7 (x86) version 6.1"
    );
    expect(systemDetails["Memory"]).toEqual(
        "550771464 bytes (525 MB) / 1073741824 bytes (1024 MB) up to 1073741824 bytes (1024 MB)"
    );
    expect(systemDetails["JVM Flags"]).toEqual(
        "9 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xss1M -Xmx1G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=16M"
    );
    expect(systemDetails["ModLauncher services"]).toEqual(
        "/mixin-0.8.2.jar mixin PLUGINSERVICE " +
        "\n/eventbus-4.0.0.jar eventbus PLUGINSERVICE " +
        "\n/forge-1.16.5-36.1.16.jar object_holder_definalize PLUGINSERVICE " +
        "\n/forge-1.16.5-36.1.16.jar runtime_enum_extender PLUGINSERVICE " +
        "\n/accesstransformers-3.0.1.jar accesstransformer PLUGINSERVICE " +
        "\n/forge-1.16.5-36.1.16.jar capability_inject_definalize PLUGINSERVICE " +
        "\n/forge-1.16.5-36.1.16.jar runtimedistcleaner PLUGINSERVICE " +
        "\n/mixin-0.8.2.jar mixin TRANSFORMATIONSERVICE " +
        "\n/optifine_1.16.5_hd_u_g8.jar OptiFine TRANSFORMATIONSERVICE " +
        "\n/forge-1.16.5-36.1.16.jar fml TRANSFORMATIONSERVICE"
    );
    expect(systemDetails["FML"]).toEqual("36.1");
    expect(systemDetails["FML Language Providers"]).toEqual("javafml@36.1\nminecraft@1");
    expect(systemDetails["Mod List"]).toEqual("forge-1.16.5-36.1.16-client.jar                   |Minecraft                     |minecraft                     |1.16.5              |DONE      |NOSIGNATURE" +
        "\nnotenoughcrashes-3.2.0-forge.jar                  |Not Enough Crashes            |notenoughcrashes              |3.2.0               |DONE      |NOSIGNATURE" +
        "\ncameraoverhaul-1_0-1_16_4.jar                     |Camera Overhaul               |cameraoverhaul                |1.0.0               |DONE      |NOSIGNATURE" +
        "\nforge-1.16.5-36.1.16-universal.jar                |Forge                         |forge                         |36.1.16             |DONE      |22:af:21:d8:19:82:7f:93:94:fe:2b:ac:b7:e4:41:57:68:39:87:b1:a7:5c:c6:44:f9:25:74:21:14:f5:0d:90" +
        "\ntoolswap-1.16.2-1.3.2.jar                         |ToolSwap                      |toolswap                      |1.3.2               |DONE      |NOSIGNATURE" +
        "\nworldedit-mod-7.2.5-dist.jar                      |WorldEdit                     |worldedit                     |7.2.5+57d5ac9       |DONE      |NOSIGNATURE" +
        "\nadvanced-xray-forge-1.16.5-2.7.0.jar              |Advanced XRay                 |xray                          |2.7.0               |DONE      |NOSIGNATURE" +
        "\nshulkertooltip-1.9.9-1.jar                        |Shulker Tooltip               |shulkertooltip                |1.9.9               |DONE      |NOSIGNATURE" +
        "\njei-1.16.5-7.7.1.118.jar                          |Just Enough Items             |jei                           |7.7.1.118           |DONE      |NOSIGNATURE"
    );
    expect(systemDetails["GL Caps"]).toEqual("Using framebuffer using OpenGL 3.0")
    expect(systemDetails["Integrated Server Crashes Since Restart"]).toEqual("0")
    expect(systemDetails["OpenGlRenderer"]).toEqual("GeForce GT 240M/PCIe/SSE2")
    expect(systemDetails["CPU"]).toEqual("2x Intel(R) Core(TM)2 Duo CPU T6600 @ 2.20GHz")

    expect(Object.keys(systemDetails).length).toEqual(43)
}


export function testFabricCrashReportParse(report: CrashReport) {
    expect(report.wittyComment).toBe("Hi. I'm Minecraft, and I'm a crashaholic.")
    expect(report.stacktrace.trace).toEqual([
            "Not Enough Crashes deobfuscated stack trace.(1.17+build.13)",
            "org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:363)",
            "org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClass(MixinTransformer.java:208)",
            "org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClassBytes(MixinTransformer.java:178)",
            "org.spongepowered.asm.mixin.transformer.FabricMixinTransformerProxy.transformClassBytes(FabricMixinTransformerProxy.java:23)",
            "net.fabricmc.loader.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:162)",
            "net.fabricmc.loader.launch.knot.KnotClassLoader.loadClass(KnotClassLoader.java:154)",
            "java.lang.ClassLoader.loadClass(ClassLoader.java:519)",
            "net.minecraft.client.render.GameRenderer.updateWorldIcon(GameRenderer:1339)",
            "net.minecraft.client.render.GameRenderer.render(GameRenderer:1158)",
            "net.minecraft.client.MinecraftClient.render(MinecraftClient:1114)",
            "net.minecraft.client.MinecraftClient.run(MinecraftClient:730)",
            "net.minecraft.client.main.Main.main(Main:217)",
            "jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)",
            "jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)",
            "jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)",
            "java.lang.reflect.Method.invoke(Method.java:567)",
            "net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)",
            "net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)",
            "net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)",
            "jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)",
            "jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)",
            "jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)",
            "java.lang.reflect.Method.invoke(Method.java:567)",
            "org.multimc.onesix.OneSixLauncher.launchWithMainClass(OneSixLauncher.java:196)",
            "org.multimc.onesix.OneSixLauncher.launch(OneSixLauncher.java:231)",
            "org.multimc.EntryPoint.listen(EntryPoint.java:143)",
            "org.multimc.EntryPoint.main(EntryPoint.java:34)",
        ]
    )
    const childStackTrace = report.stacktrace.causedBy!;
    expect(childStackTrace.message).toEqual(
        "org.spongepowered.asm.mixin.throwables.MixinApplyError: Mixin [screenshotclipboard.mixins.json:ScreenshotMixin] from phase [DEFAULT] in config [screenshotclipboard.mixins.json] FAILED during APPLY"
    )
    expect(childStackTrace.trace).toEqual([
        "org.spongepowered.asm.mixin.transformer.MixinProcessor.handleMixinError(MixinProcessor.java:642)",
        "org.spongepowered.asm.mixin.transformer.MixinProcessor.handleMixinApplyError(MixinProcessor.java:594)",
        "org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:356)",
        "26 more",
    ])
    const childChildStackTrace = childStackTrace.causedBy!;
    expect(childChildStackTrace.message).toEqual(
        "org.spongepowered.asm.mixin.injection.throwables.InvalidInjectionException: Invalid descriptor on screenshotclipboard.mixins.json:ScreenshotMixin->@Inject::screenshotCaptured(Lnet/minecraft/class_1011;Ljava/io/File;Ljava/util/function/Consumer;Lorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V! Expected (Lnet/minecraft/class_1011;Ljava/io/File;Ljava/lang/Object;Ljava/util/function/Consumer;Lorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V but found (Lnet/minecraft/class_1011;Ljava/io/File;Ljava/util/function/Consumer;Lorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V [INJECT Applicator Phase -> screenshotclipboard.mixins.json:ScreenshotMixin -> Apply Injections ->  -> Inject -> screenshotclipboard.mixins.json:ScreenshotMixin->@Inject::screenshotCaptured(Lnet/minecraft/class_1011;Ljava/io/File;Ljava/util/function/Consumer;Lorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V]"
    )
    expect(childChildStackTrace.trace).toEqual([
        "Not Enough Crashes deobfuscated stack trace.(1.17+build.13)",
        "org.spongepowered.asm.mixin.injection.callback.CallbackInjector.inject(CallbackInjector.java:517)",
        "org.spongepowered.asm.mixin.injection.callback.CallbackInjector.inject(CallbackInjector.java:447)",
        "org.spongepowered.asm.mixin.injection.code.Injector.inject(Injector.java:264)",
        "org.spongepowered.asm.mixin.injection.struct.InjectionInfo.inject(InjectionInfo.java:385)",
        "org.spongepowered.asm.mixin.transformer.MixinTargetContext.applyInjections(MixinTargetContext.java:1284)",
        "org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.applyInjections(MixinApplicatorStandard.java:1042)",
        "org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.applyMixin(MixinApplicatorStandard.java:395)",
        "org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.apply(MixinApplicatorStandard.java:320)",
        "org.spongepowered.asm.mixin.transformer.TargetClassContext.applyMixins(TargetClassContext.java:345)",
        "org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:569)",
        "org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:351)",
        "26 more",
    ])

    expect(report.sections.length).toEqual(5)
    const head = report.sections[0]
    expect(head.title).toEqual("Head")
    expect(head.thread).toEqual("Render thread")
    expect(head.details).toEqual(undefined)
    expect(head.stacktrace).toEqual([
        "org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:363)",
        "org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClass(MixinTransformer.java:208)",
        "org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClassBytes(MixinTransformer.java:178)",
        "org.spongepowered.asm.mixin.transformer.FabricMixinTransformerProxy.transformClassBytes(FabricMixinTransformerProxy.java:23)",
        "net.fabricmc.loader.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:162)",
        "net.fabricmc.loader.launch.knot.KnotClassLoader.loadClass(KnotClassLoader.java:154)",
    ])

    const lastReload = report.sections[2]
    expect(lastReload.title).toEqual("Last reload")
    expect(lastReload.thread).toEqual(undefined)
    expect(lastReload.stacktrace).toEqual(undefined)
    const reloadDetails = lastReload.details!;
    expect(reloadDetails["Reload number"]).toEqual("1")
    expect(reloadDetails["Reload reason"]).toEqual("initial")
    expect(reloadDetails["Finished"]).toEqual("Yes")
    expect(reloadDetails["Packs"]).toEqual("Default, Fabric Mods")

    const systemDetails = report.sections[3].details!

    expect(systemDetails["Memory"]).toEqual("875362304 bytes (834 MiB) / 2059403264 bytes (1964 MiB) up to 6291456000 bytes (6000 MiB)")
    expect(systemDetails["CpuCount"]).toEqual("16")

    const optifabric = report.sections[4]
    expect(optifabric.title).toEqual("OptiFabric")

    const optifabricDetails = optifabric.details!
    expect(optifabricDetails["OptiFine jar designed for"]).toEqual("1.17")
    expect(optifabricDetails["OptiFine jar version"]).toEqual("OptiFine_1.17_HD_U_G9_pre21")
    expect(optifabricDetails["OptiFine jar status"]).toEqual("Valid OptiFine installer")
    expect(optifabricDetails["OptiFine remapped jar"]).toEqual("C:/Users/natan/Desktop/MultiMC/instances/1.17 NEC error identifying test/.minecraft/.optifine/OptiFine_1.17_HD_U_G9_pre21/Optifine-mapped.jar")
    expect(optifabricDetails["OptiFabric error"]).toEqual("<None>")
}

test('Forge Crash Report is parsed correctly', () => {
    const report = parseCrashReport(testForgeCrashReport);
    testForgeCrashReportParse(report);
});
test("Fabric crash report is parsed correctly", () => {
    const report = parseCrashReport(testFabricCrashReport)
    testFabricCrashReportParse(report);
})
test("Crash with weird section formatting is parsed correctly", () => {
    const report = parseCrashReport(TestBuggyParseCrash)
    expect(report.sections.length).toEqual(5)
    const enriched = enrichCrashReport(report);
    expect(enriched.context.time).toEqual(new Date(2021, 9, 3, 12, 22))
})

test("Barebones Fabric crash is parsed correctly", () => {
    const report = parseCrashReport(BarebonesFabricCrash)
    const enriched = enrichCrashReport(report);
    expect(enriched.context.loader.type).toEqual(LoaderType.Fabric);
    expect(enriched.context.loader.version).toEqual(undefined);
    expect(enriched.mods).toEqual(undefined);
})

test("VerifyError crash is parsed correctly", () => {
    const report = parseCrashReport(TestVerifyErrorCrash);
    expect(report.sections.length).toEqual(4)
    expect(report.stacktrace.trace.length).toEqual(11)
    expect(Object.values(report.stacktrace.details!.details).length).toEqual(5)
    expect(report.stacktrace.details?.details!["Current Frame"].length).toEqual(4)
    expect(report.stacktrace.details?.details!["Location"]).toEqual(["net/minecraft/class_5944.<init>(Lnet/minecraft/class_5912;Ljava/lang/String;Lnet/minecraft/class_293;)V @7: invokespecial"])

    const enriched = enrichCrashReport(report);
    //2021-10-25, 10:07 a.m.
    expect(enriched.context.time).toEqual(new Date(2021, 9, 25, 10, 7))
    const details = enriched.stackTrace.details!;
    expect(details.location).toEqual({
        methodSignature: "net/minecraft/class_5944.<init>(Lnet/minecraft/class_5912;Ljava/lang/String;Lnet/minecraft/class_293;)V",
        line: 7,
        instruction: "invokespecial"
    } as ExceptionLocation)

    expect(details.reason).toEqual("Type uninitializedThis (current frame, stack[2]) is not assignable to 'net/minecraft/class_5944'")
    const frame = details.currentFrame;
    expect(frame.byteCodeIndex).toEqual(7)
    expect(frame.flags).toEqual(["flagThisUninit"])
    expect(frame.locals).toEqual(["uninitializedThis", "'net/minecraft/class_5912'", "'java/lang/String'", "'net/minecraft/class_293'"])
    expect(frame.stack).toEqual(["uninitializedThis", "'net/minecraft/class_5912'", "uninitializedThis", "'java/lang/String'", "'net/minecraft/class_5912'", "'java/lang/String'", "'net/minecraft/class_293'"])
    expect(details.bytecode).toEqual({
        "0000000": "2a2b2a2c2b2c2db7005b59c7000dbb00",
        "0000010": "5d59125fb70062bf2db70065b1"
    })
    //full_frame(@24,{UninitializedThis,Object[#108],Object[#110],Object[#112]},{UninitializedThis,Object[#108],Object[#114]})
    expect(details.stackmapTable).toEqual({
        "full_frame": {
            line: 24,
            objects: [
                ["UninitializedThis", "Object[#108]", "Object[#110]", "Object[#112]"],
                ["UninitializedThis", "Object[#108]", "Object[#114]"]
            ]
        }
    } as ExceptionStackmapTable)
});

test("Time is parsed correctly in edge case", () => {
    const report = parseCrashReport(BrokenTimeCrash);
    const enriched = enrichCrashReport(report);
    expect(enriched.context.time.getFullYear()).toEqual(2021);
    expect(enriched.context.time.getMonth()).toEqual(9);
    expect(enriched.context.time.getDate()).toEqual(21);
})

test("Empty space crash is parsed correctly", () => {
    const report = parseCrashReport(TestEmptySectionCrash);
    expect(report.sections.length).toEqual(3)
})

test("Broken section crash is parsed well enough", () => {
    const parsed = parseCrashReport(BrokenSectionCrash);
    expect(parsed.sections[2].details!["Graphics mode"]).toEqual("fancy")
})


test("Nec Fabric crash log is parsed correctly", () => {
    const report = parseCrashReport(NecFabricCrash);
    const enriched = enrichCrashReport(report);

    expect(enriched.deobfuscated).toEqual(true)
})

test("Loli crash log is parsed correctly", () => {
    const report = parseCrashReport(loliCrash);
    const enriched = enrichCrashReport(report);
    expect(enriched.wittyComment).toEqual("On the bright side, I bought you a teddy bear!")
    expect(enriched.sections[0].details!["Current Language"]).toEqual("English (US)")
})

test("Mixin crash log is not missing information", () => {
    const enriched = parseCrashReportRich(MissingTitleLog);
    const targetException = enriched.stackTrace.causedBy!.causedBy!.causedBy!.causedBy!
    expect(targetException.title.message).toEqual("Critical injection failure: Redirector yeetUpdateSuppressionCrash_implOnTickWorlds(Lnet/minecraft/class_3218;Ljava/util/function/BooleanSupplier;)V in #carpet-tis-addition:carpet-tis-addition.mixins.json:rule.yeetUpdateSuppressionCrash.MinecraftServerMixin from mod carpet-tis-addition failed injection check, (0/1) succeeded. Scanned 1 target(s). Using refmap carpet-tis-addition-mc1.19.2-refmap.json")
})


test("Crash logs with no indents can be parsed", () => {
    // const parsed = parseCrashReport(NoIndentCrash)
    // expect(parsed.sections)
    const enriched = parseCrashReportRich(NoIndentCrash)
    expect(enriched.stackTrace.title.message).toEqual("ConnectedTexturesMod (ctm) encountered an error during the done event phase\n§7java.lang.NullPointerException: Cannot invoke \"net.minecraft.client.resources.model.BakedModel.m_7521_()\" because \"this.originalModel\" is null")
    expect(enriched.context.javaVersion).toEqual("17.0.3")
    expect(enriched.mods![0].name).toEqual("Minecraft")
    expect(enriched.mods![2].name).toEqual("Create Big Cannons")
    expect(enriched.sections[2].details!["Reload number"]).toEqual("1")
    expect(enriched.sections[3].details!["ModLauncher services"]).toEqual(`mixin-0.8.5.jar mixin PLUGINSERVICE
eventbus-6.0.3.jar eventbus PLUGINSERVICE
fmlloader-1.19.2-43.2.11.jar slf4jfixer PLUGINSERVICE
fmlloader-1.19.2-43.2.11.jar object_holder_definalize PLUGINSERVICE
fmlloader-1.19.2-43.2.11.jar runtime_enum_extender PLUGINSERVICE
fmlloader-1.19.2-43.2.11.jar capability_token_subclass PLUGINSERVICE
accesstransformers-8.0.4.jar accesstransformer PLUGINSERVICE
fmlloader-1.19.2-43.2.11.jar runtimedistcleaner PLUGINSERVICE
modlauncher-10.0.8.jar mixin TRANSFORMATIONSERVICE
modlauncher-10.0.8.jar fml TRANSFORMATIONSERVICE`)
})

test("Crash with very little info can be parsed", () => {
    const enriched = parseCrashReportRich(SeeminglySimpleLog)
    expect(enriched.context.time).toEqual(new Date(2023,7,5,11,17,48))
    expect(enriched.title).toEqual("Rendering overlay")
})