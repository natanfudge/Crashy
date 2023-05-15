import {testFabricCrashReport, testForgeCrashReport} from "../testlogs/TestCrashes";
import {JavaClass, SimpleMethod} from "../../crash/model/Mappable";
import {enrichCrashReport} from "../../crash/parser/CrashReportEnricher";
import {LoaderType, OperatingSystemType, RichCrashReport} from "../../crash/model/RichCrashReport";
import {parseCrashReport} from "../../crash/parser/CrashReportParser";
import "fudge-lib/dist/extensions/ExtensionsImpl"
import {expect, test} from 'vitest'

export function testFabricCrashReportEnrich(enriched: RichCrashReport) {
    if (enriched.mods === undefined) throw new Error("Unexpected");
    expect(enriched.mods.length).toEqual(116)
    expect(enriched.mods[0]).toEqual(
        {id: "architectury", name: "Architectury", version: "2.0.7", isSuspected: false}
    );
    expect(enriched.mods[1]).toEqual(
        {id: "audiooutput", name: "AudioOutput", version: "0.0.4", isSuspected: false}
    );
    //start: 141
    expect(enriched.mods[76]).toEqual(
        {id: "fabrishot", name: "Fabrishot", version: "1.5.0", isSuspected: false}
    );
    expect(enriched.mods[108]).toEqual(
        {id: "seamless_loading_screen", name: "Seamless Loading Screen", version: "1.3.5+1.17", isSuspected: true}
    );
    expect(enriched.mods[109]).toEqual(
        {id: "smoothboot", name: "Smooth Boot", version: "1.16.5-1.6.0", isSuspected: false}
    );
    expect(enriched.mods[115]).toEqual(
        {id: "transliterationlib", name: "TRansliterationLib", version: "1.1.0", isSuspected: true}
    );

    //	at org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:363)
    expect(enriched.stackTrace.elements[0]).toEqual({
        method: SimpleMethod.dotSeperated("org.spongepowered.asm.mixin.transformer.MixinProcessor","applyMixins"),
        line: {file: "MixinProcessor.java", number: 363},
        forgeMetadata: undefined
    })

    //Caused by: org.spongepowered.asm.mixin.throwables.MixinApplyError: Mixin [screenshotclipboard.mixins.json:ScreenshotMixin] from phase [DEFAULT] in config [screenshotclipboard.mixins.json] FAILED during APPLY
    const cause = enriched.stackTrace.causedBy!;
    expect(cause.title).toEqual({
        message: "Mixin [screenshotclipboard.mixins.json:ScreenshotMixin] from phase [DEFAULT] in config [screenshotclipboard.mixins.json] FAILED during APPLY",
        class: JavaClass.dotSeperated("org.spongepowered.asm.mixin.throwables.MixinApplyError")
    })
    // 	at org.spongepowered.asm.mixin.transformer.MixinProcessor.handleMixinError(MixinProcessor.java:642)

    expect(cause.elements[0]).toEqual({
            method: SimpleMethod.dotSeperated("org.spongepowered.asm.mixin.transformer.MixinProcessor", "handleMixinError"),
            line: {file: "MixinProcessor.java", number: 642},
            forgeMetadata: undefined
        }
    )

    expect(cause.elements[3]).toEqual(26)


    const causeCause = cause.causedBy!;
    expect(causeCause.causedBy).toEqual(undefined)
    expect(causeCause.elements[11]).toEqual(26)

    const head = enriched.sections[0]
    expect(head.details!["Thread"]).toEqual("Render thread")

    const level = enriched.sections[1]
    expect(level.details!["All players"]).toEqual("1 total; [class_746['FudgeDestroyer'/456, l='ClientLevel', x=-37.50, y=69.00, z=232.50]]")

    const time = enriched.context.time;
    //20/08/2021, 7:41
    expect(time).toEqual(
        new Date(2021, 7, 20, 7, 41)
    )

    expect(enriched.context.loader).toEqual({
        type: LoaderType.Fabric,
        version: "0.11.6"
    })

    expect(enriched.context.javaVersion).toEqual("16.0.2")
    expect(enriched.context.minecraftVersion).toEqual("1.17")
    expect(enriched.context.operatingSystem).toEqual({
        type: OperatingSystemType.Windows,
        name: "Windows 10 (64 bit)"
    })
}


function testForgeCrashReportEnrich(enriched: RichCrashReport) {
    expect(enriched.mods).toEqual([
        {
            id: "minecraft", name: "Minecraft", version: "1.16.5", isSuspected: false,
            forgeMetadata: {file: "forge-1.16.5-36.1.16-client.jar", completeness: "DONE", signature: "NOSIGNATURE"}
        },
        {
            id: "notenoughcrashes", name: "Not Enough Crashes", version: "3.2.0", isSuspected: false,
            forgeMetadata: {file: "notenoughcrashes-3.2.0-forge.jar", completeness: "DONE", signature: "NOSIGNATURE"}
        },
        {
            id: "cameraoverhaul", name: "Camera Overhaul", version: "1.0.0", isSuspected: false,
            forgeMetadata: {file: "cameraoverhaul-1_0-1_16_4.jar", completeness: "DONE", signature: "NOSIGNATURE"}
        },
        {
            id: "forge", name: "Forge", version: "36.1.16", isSuspected: false,
            forgeMetadata: {
                file: "forge-1.16.5-36.1.16-universal.jar",
                completeness: "DONE",
                signature: "22:af:21:d8:19:82:7f:93:94:fe:2b:ac:b7:e4:41:57:68:39:87:b1:a7:5c:c6:44:f9:25:74:21:14:f5:0d:90"
            }
        },
        {
            id: "toolswap", name: "ToolSwap", version: "1.3.2", isSuspected: true,
            forgeMetadata: {file: "toolswap-1.16.2-1.3.2.jar", completeness: "DONE", signature: "NOSIGNATURE"}
        },
        {
            id: "worldedit", name: "WorldEdit", version: "7.2.5+57d5ac9", isSuspected: false,
            forgeMetadata: {file: "worldedit-mod-7.2.5-dist.jar", completeness: "DONE", signature: "NOSIGNATURE"}
        },
        {
            id: "xray", name: "Advanced XRay", version: "2.7.0", isSuspected: true,
            forgeMetadata: {
                file: "advanced-xray-forge-1.16.5-2.7.0.jar",
                completeness: "DONE",
                signature: "NOSIGNATURE"
            }
        },
        {
            id: "shulkertooltip", name: "Shulker Tooltip", version: "1.9.9", isSuspected: false,
            forgeMetadata: {file: "shulkertooltip-1.9.9-1.jar", completeness: "DONE", signature: "NOSIGNATURE"}
        },
        {
            id: "jei", name: "Just Enough Items", version: "7.7.1.118", isSuspected: false,
            forgeMetadata: {file: "jei-1.16.5-7.7.1.118.jar", completeness: "DONE", signature: "NOSIGNATURE"}
        },

    ])

    expect(enriched.stackTrace.title).toEqual({
        message: "Unexpected error",
        class: JavaClass.dotSeperated("java.lang.NullPointerException")
    })

    //	at net.minecraft.client.renderer.GameRenderer.func_78473_a(GameRenderer.java:344)
    //	~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,xf:OptiFine:default,
    //	pl:mixin:APP:cameraoverhaul.mixins.json:modern.GameRendererMixin,pl:mixin:A}
    expect(enriched.stackTrace.elements[0]).toEqual(
        {
            method: SimpleMethod.dotSeperated("net.minecraft.client.renderer.GameRenderer","func_78473_a"),
            line: {file: "GameRenderer.java", number: 344},
            forgeMetadata: {
                jarFile: undefined, version: undefined,
                classloadingReasons: ["mixin", "classloading"],
                pluginTransformerReasons: ["accesstransformer:B", "accesstransformer:B", "mixin:APP:cameraoverhaul.mixins.json:modern.GameRendererMixin", "mixin:A"],
                additionalTransformerData: ["OptiFine:default"]
            }
        }
    )
    // 	at net.minecraft.client.Minecraft.func_71407_l(Minecraft.java:1422) [?:?]
    // 	{re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,
    // 	pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}

    expect(enriched.stackTrace.elements[1]).toEqual(
        {
            method: SimpleMethod.dotSeperated("net.minecraft.client.Minecraft","func_71407_l"),
            line: {file: "Minecraft.java", number: 1422},
            forgeMetadata: {
                jarFile: undefined, version: undefined,
                classloadingReasons: ["mixin", "classloading"],
                pluginTransformerReasons: ["accesstransformer:B", "runtimedistcleaner:A", "accesstransformer:B",
                    "mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient", "mixin:A", "runtimedistcleaner:A"],
                additionalTransformerData: []
            }
        }
    )
    // net.minecraft.client.main.Main.main(Main.java:184) [?:?]
    // {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:A,pl:runtimedistcleaner:A}
    expect(enriched.stackTrace.elements[6]).toEqual(
        {
            method: SimpleMethod.dotSeperated("net.minecraft.client.main.Main","main"),
            line: {file: "Main.java", number: 184},
            forgeMetadata: {
                jarFile: undefined, version: undefined,
                classloadingReasons: ["classloading", "mixin"],
                pluginTransformerReasons: ["runtimedistcleaner:A", "mixin:A", "runtimedistcleaner:A"],
                additionalTransformerData: []
            }
        }
    )

    // 	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_51] {}
    expect(enriched.stackTrace.elements[7]).toEqual(
        {
            method: SimpleMethod.dotSeperated("sun.reflect.NativeMethodAccessorImpl","invoke0"),
            line: {file: "Native Method", number: undefined},
            forgeMetadata: {
                jarFile: undefined, version: "1.8.0_51",
                classloadingReasons: [], pluginTransformerReasons: [], additionalTransformerData: []
            }
        }
    )

    // 	at net.minecraftforge.fml.loading.FMLClientLaunchProvider.lambda$launchService$0(FMLClientLaunchProvider.java:51)
    // 	[forge-1.16.5-36.1.16.jar:36.1] {}
    expect(enriched.stackTrace.elements[11]).toEqual(
        {
            method: SimpleMethod.dotSeperated("net.minecraftforge.fml.loading.FMLClientLaunchProvider","lambda$launchService$0"),
            line: {file: "FMLClientLaunchProvider.java", number: 51},
            forgeMetadata: {
                jarFile: "forge-1.16.5-36.1.16.jar", version: "36.1",
                classloadingReasons: [], pluginTransformerReasons: [], additionalTransformerData: []
            }
        }
    )

    // 	at cpw.mods.modlauncher.Launcher.main(Launcher.java:66) [modlauncher-8.0.9.jar:?] {re:classloading}
    expect(enriched.stackTrace.elements[17]).toEqual(
        {
            method: SimpleMethod.dotSeperated("cpw.mods.modlauncher.Launcher","main"),
            line: {file: "Launcher.java", number: 66},
            forgeMetadata: {
                jarFile: "modlauncher-8.0.9.jar", version: undefined,
                classloadingReasons: ["classloading"], pluginTransformerReasons: [], additionalTransformerData: []
            }
        }
    )

    const time = enriched.context.time;
    //15.08.21 17:36
    expect(time).toEqual(
        new Date(2021, 7, 15, 17, 36)
    )

    expect(enriched.context.loader).toEqual({
        type: LoaderType.Forge,
        version: "36.1.16"
    })

    expect(enriched.context.javaVersion).toEqual("1.8.0_51")
    expect(enriched.context.minecraftVersion).toEqual("1.16.5")
    expect(enriched.context.operatingSystem).toEqual({
        type: OperatingSystemType.Windows,
        name: "Windows 7 (32 bit)"
    })
}

test("Fabric crash report is enriched properly", () => {
    const parsed = parseCrashReport(testFabricCrashReport)
    const enriched = enrichCrashReport(parseCrashReport(testFabricCrashReport));
    testFabricCrashReportEnrich(enriched);

})
test("Forge crash report is enriched properly", () => {
    const enriched = enrichCrashReport(parseCrashReport(testForgeCrashReport));
    testForgeCrashReportEnrich(enriched);
})
