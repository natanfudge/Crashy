import {JavaClass, SimpleMethod} from "../../crash/model/Mappable";
import {CrashReport, StackTrace, StackTraceElement} from "../../crash/model/CrashReport";
import {LoaderType, OperatingSystemType, RichCrashReport} from "../../crash/model/RichCrashReport";


const testStackTrace: StackTrace = {
    message: "java.lang.StackOverflowError: charTyped event handler",
    trace: [
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
        "java.util.stream.AbstractPipeline.wrapSink(AbstractPipeline.java:522)",
        "java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:474)",
        "java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)"
        , "java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)"
    ]
}

const testElementStackTrace: StackTraceElement[] = [
    "net.minecraft.client.world.ClientWorld.func_72914_a(ClientWorld.java:617) ~[?:?] {re:classloading,xf:OptiFine:default}",
    "net.minecraft.client.Minecraft.func_71396_d(Minecraft.java:2029) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}",
    "fudge.notenoughcrashes.mixinhandlers.InGameCatcher.handleClientCrash(InGameCatcher.java:28) ~[?:?] {re:mixin,re:classloading}"
    , "net.minecraft.client.Minecraft.modify$zzh000$onCrash(Minecraft.java:2548) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}"
]


const testCrashReport: CrashReport = {
    rawText: "Test raw text",
    stacktrace: testStackTrace,
    dateTime: "7/19/21 8:03 PM",
    description: "charTyped event handler",
    wittyComment: "Why did you do that?",
    sections: [
        {
            title: "Affected level",
            details: {
                "All players": "1 total; [ClientPlayerEntity['Kyartyi1337'/804445, l='ClientLevel', x=-712.19, y=64.00, z=-228.79]]",
                "Chunk stats": "Client Chunk Cache: 361, 225",
                "Level dimension": "minecraft:overworld"
            },
            stacktrace: testElementStackTrace,
            additionalInfo: {}
        },
        {
            title: "System Details",
            details: {
                "Minecraft Version": "1.16.5",
                "Minecraft Version ID": "1.16.5",
                "Operating System": "Windows 7 (x86) version 6.1"
            },
            additionalInfo: {}
        },
    ],
}


const testRichStackTrace: RichCrashReport = {
    rawText: "Test raw text",
    deobfuscated: false,
    title: "charTyped event handler",
    wittyComment: "Why did you do that?",
    stackTrace: {
        title: {
            message: "charTyped event handler",
            class: JavaClass.dotSeperatedObject({
                packageName: "java.lang",
                simpleName: "StackOverflowError"
            })
        },
        elements: [
            {
                forgeMetadata: {
                    additionalTransformerData: ["Optifine:default", "fml:twilightforest:render"],
                    classloadingReasons: ["mixin", "classloading"],
                    jarFile: "1.16.5-Forge%2036.1.0-OptiFine_G8.jar",
                    pluginTransformerReasons: ["accesstransformer:B", "runtimedistcleaner:A"],
                    version: "1.8.0_51"
                },
                line: {
                    file: "GameRenderer.java",
                    number: 344
                },
                method: SimpleMethod.dotSeperatedObject({
                    name: "wrapSink",
                    classIn: {
                        packageName: "java.util.streamffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        simpleName: "AbstractPipeline"
                    }
                })
            },
            {
                forgeMetadata: {
                    additionalTransformerData: [],
                    classloadingReasons: ["mixin", "classloading"],
                    pluginTransformerReasons: [],
                    version: "1.8.0_51"
                },
                line: {
                    file: "GameRenderer.java",
                    number: 69420
                },
                method: SimpleMethod.dotSeperatedObject({
                    name: "doStuff",
                    classIn: {
                        packageName: "io.natanfudge.github.greatshit",
                        simpleName: "MiencraftFixer"
                    }
                })
            }
        ],
        causedBy: {
            title: {
                message: "causer of hell",
                class: JavaClass.dotSeperatedObject({packageName: "java.lang", simpleName: "UberCrasher"})
            },
            elements: [
                {
                    forgeMetadata: {
                        additionalTransformerData: ["Optifine:default", "fml:twilightforest:render"],
                        classloadingReasons: ["mixin", "classloading"],
                        jarFile: "1.16.5-Forge%2036.1.0-OptiFine_G8.jar",
                        pluginTransformerReasons: ["accesstransformer:B", "runtimedistcleaner:A"],
                        version: "1.8.0_5169420"
                    },
                    line: {
                        file: "CrashFile.java",
                        number: 34422222222
                    },
                    method: SimpleMethod.dotSeperatedObject({
                        name: "kill",
                        classIn: {
                            packageName: "java.util.stream",
                            simpleName: "ForgeStuff"
                        }
                    })
                }
            ],
            causedBy: {
                title: {
                    message: "actual causer of hell",
                    class: JavaClass.dotSeperatedObject({packageName: "java.lang", simpleName: "UberSuperCrasher"})
                },
                elements: [
                    {
                        forgeMetadata: {
                            additionalTransformerData: ["Optifine:default", "fml:twilightforest:render"],
                            classloadingReasons: ["mixin", "classloading"],
                            jarFile: "1.16.5-Forge%2036.1.0-OptiFine_G8.jar",
                            pluginTransformerReasons: ["accesstransformer:B", "runtimedistcleaner:A"],
                            version: "1.8.0_5169420"
                        },
                        line: {
                            file: "CrashFile.java",
                            number: 34422222222
                        },
                        method: SimpleMethod.dotSeperatedObject({
                            name: "kill",
                            classIn: {
                                packageName: "java.util.stream",
                                simpleName: "ForgeStuff"
                            }
                        })
                    }
                ],
            }
        }
    },
    context: {
        javaVersion: "16",
        loader: {
            version: "0.7.4",
            type: LoaderType.Fabric
        },
        operatingSystem: {
            type: OperatingSystemType.Windows,
            name: "Windows 11"
        },
        minecraftVersion: "1.17.1",
        time: new Date(2021, 7, 19, 20, 3, 0, 0)
    },
    //
    mods: [
        {
            name: "Not Enough Crashes",
            id: "notenoughcrashes",
            version: "3.2.0",
            forgeMetadata: {
                file: "notenoughcrashes-3.2.0-forge.jar",
                completeness: "DONE",
                signature: "NOSIGNATURE"
            },
            isSuspected: false
        },
        {
            name: "Camera Overhaul",
            id: "cameraoverhaul",
            version: "1.0.0",
            forgeMetadata: {
                file: "cameraoverhaul-1_0-1_16_4.jar",
                completeness: "DONE",
                signature: "22:af:21:d8:19:82:7f:93:94:fe:2b:ac:b7:e4:41:57:68:39:87:b1:a7:5c:c6:44:f9:25:74:21:14:f5:0d:90"
            },
            isSuspected: true
        }
    ],
    sections: [
        {
            name: "Head 1",
            stackTrace: [{
                forgeMetadata: {
                    additionalTransformerData: ["Optifine:default", "fml:twilightforest:render"],
                    classloadingReasons: ["mixin", "classloading"],
                    jarFile: "1.16.5-Forge%2036.1.0-OptiFine_G8.jar",
                    pluginTransformerReasons: ["accesstransformer:B", "runtimedistcleaner:A"],
                    version: "1.8.0_51"
                },
                line: {
                    file: "GameRenderer.java",
                    number: 344
                },
                method: SimpleMethod.dotSeperatedObject({
                    name: "wrapSink",
                    classIn: {
                        packageName: "java.util.stream",
                        simpleName: "AbstractPipeline"
                    }
                })
            }],
            details: {
                "Thread": "amar thread",
                "All players": "1 total; [ClientPlayerEntity['Kyartyi1337'/804445, l='ClientLevel', x=-712.19, y=64.00, z=-228.79]]",
                "Chunk stats": "Client Chunk Cache: 361, 225"
            },
        },
        {
            name: "Head 2",
            stackTrace: [{
                forgeMetadata: {
                    additionalTransformerData: ["Optifine:default", "fml:twilightforest:render"],
                    classloadingReasons: ["mixin", "classloading"],
                    jarFile: "1.16.5-Forge%2036.1.0-OptiFine_G8.jar",
                    pluginTransformerReasons: ["accesstransformer:B", "runtimedistcleaner:A"],
                    version: "1.8.0_51"
                },
                line: {
                    file: "GameRenderer.java",
                    number: 344
                },
                method: SimpleMethod.dotSeperatedObject({
                    name: "wrapSink",
                    classIn: {
                        packageName: "java.util.stream",
                        simpleName: "AbstractPipeline"
                    }
                })
            }],
            details: {
                "Thread": "amar thread",
                "All players": "1 total; [ClientPlayerEntity['Kyartyi1337'/804445, l='ClientLevel', x=-712.19, y=64.00, z=-228.79]]",
                "Chunk stats": "Client Chunk Cache: 361, 225"
            },
        },
        {
            name: "Head 3",
            stackTrace: [{
                forgeMetadata: {
                    additionalTransformerData: ["Optifine:default", "fml:twilightforest:render"],
                    classloadingReasons: ["mixin", "classloading"],
                    jarFile: "1.16.5-Forge%2036.1.0-OptiFine_G8.jar",
                    pluginTransformerReasons: ["accesstransformer:B", "runtimedistcleaner:A"],
                    version: "1.8.0_51"
                },
                line: {
                    file: "GameRenderer.java",
                    number: 344
                },
                method: SimpleMethod.dotSeperatedObject({
                    name: "wrapSink",
                    classIn: {
                        packageName: "java.util.stream",
                        simpleName: "AbstractPipeline"
                    }
                })
            }],
            details: {
                "Thread": "amar thread",
                "All players": "1 total; [ClientPlayerEntity['Kyartyi1337'/804445, l='ClientLevel', x=-712.19, y=64.00, z=-228.79]]",
                "Chunk stats": "Client Chunk Cache: 361, 225"
            },
        }
    ]
}