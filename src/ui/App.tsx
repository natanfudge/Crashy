import React, {useEffect, useState} from 'react';
import '../App.css';
import {AppBar, createTheme, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {grey, red} from "@material-ui/core/colors";
import {CrashReport, StackTrace, StackTraceElement} from "../model/CrashReport";
import {CrashReportUi} from "./CrashReportUi";
import {parseCrashReport} from "../model/CrashReportParser";
import {testFabricCrashReport} from "../model/TestCrashes";
import {LoaderType, OperatingSystemType, RichCrashReport} from "../model/RichCrashReport";
import {Text} from "./improvedapi/Text";
import {parseCrashReportRich} from "../model/CrashReportEnricher";


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
    stacktrace: testStackTrace,
    time: "7/19/21 8:03 PM",
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
        },
        {
            title: "System Details",
            details: {
                "Minecraft Version": "1.16.5",
                "Minecraft Version ID": "1.16.5",
                "Operating System": "Windows 7 (x86) version 6.1"
            }
        }
    ],
}


const testRichStackTrace: RichCrashReport = {
    title: "charTyped event handler",
    wittyComment: "Why did you do that?",
    stackTrace: {
        message: {
            message: "charTyped event handler",
            class: {
                packageName: "java.lang",
                simpleName: "StackOverflowError"
            }
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
                method: {
                    name: "wrapSink",
                    class: {
                        packageName: "java.util.streamffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        simpleName: "AbstractPipeline"
                    }
                }
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
                method: {
                    name: "doStuff",
                    class: {
                        packageName: "io.natanfudge.github.greatshit",
                        simpleName: "MiencraftFixer"
                    }
                }
            }
        ],
        causedBy: {
            message: {
                message: "causer of hell",
                class: {packageName: "java.lang", simpleName: "UberCrasher"}
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
                    method: {
                        name: "kill",
                        class: {
                            packageName: "java.util.stream",
                            simpleName: "ForgeStuff"
                        }
                    }
                }
            ],
            causedBy: {
                message: {
                    message: "actual causer of hell",
                    class: {packageName: "java.lang", simpleName: "UberSuperCrasher"}
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
                        method: {
                            name: "kill",
                            class: {
                                packageName: "java.util.stream",
                                simpleName: "ForgeStuff"
                            }
                        }
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
                method: {
                    name: "wrapSink",
                    class: {
                        packageName: "java.util.stream",
                        simpleName: "AbstractPipeline"
                    }
                }
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
                method: {
                    name: "wrapSink",
                    class: {
                        packageName: "java.util.stream",
                        simpleName: "AbstractPipeline"
                    }
                }
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
                method: {
                    name: "wrapSink",
                    class: {
                        packageName: "java.util.stream",
                        simpleName: "AbstractPipeline"
                    }
                }
            }],
            details: {
                "Thread": "amar thread",
                "All players": "1 total; [ClientPlayerEntity['Kyartyi1337'/804445, l='ClientLevel', x=-712.19, y=64.00, z=-228.79]]",
                "Chunk stats": "Client Chunk Cache: 361, 225"
            },
        }
    ]
}
//		notenoughcrashes-3.2.0-forge.jar                  |Not Enough Crashes            |notenoughcrashes              |3.2.0               |DONE      |NOSIGNATURE
// 		cameraoverhaul-1_0-1_16_4.jar                     |Camera Overhaul               |cameraoverhaul                |1.0.0               |DONE      |NOSIGNATURE
// 		forge-1.16.5-36.1.16-universal.jar                |Forge                         |forge                         |36.1.16             |DONE      |22:af:21:d8:19:82:7f:93:94:fe:2b:ac:b7:e4:41:57:68:39:87:b1:a7:5c:c6:44:f9:25:74:21:14:f5:0d:90
const parsed = parseCrashReport(testFabricCrashReport);

//TODO: track when the app crashes for users
export const clickableColor = "rgb(0, 173, 239)"
export const errorColor = "rgb(234,8,8)"
export const fadedOutColor = grey[600]
export const slightlyPronouncedColor = "#323232"

// export const
let x = 0

interface GetResponse {
    body: string
    code: number
}

function httpGetCallback(url: string, onDone: (response: GetResponse) => void) {
    const xmlHttp = new XMLHttpRequest();
    console.log("Called: " + x);
    xmlHttp.onreadystatechange = function (event) {
        if (xmlHttp.readyState === 4) {
            onDone({body: xmlHttp.responseText, code: xmlHttp.status});
            console.log("Done: " + x);
            x++;
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

async function httpGet(url: string): Promise<GetResponse> {
    return new Promise(resolve => httpGetCallback(url, (response) => resolve(response)));
}

type CrashLogResponse = string | GetCrashError

enum GetCrashError {
    NoSuchCrashId
}

const localTesting = false;
async function getCrash(id: string): Promise<CrashLogResponse> {
    const domain = localTesting? "localhost:5001/crashy-9dd87/europe-west1" : "europe-west1-crashy-9dd87.cloudfunctions.net";
    const response = await httpGet(`https://${domain}/getCrash/${id}`);
    if (response.code === 200) {
        return response.body;
    } else if (response.code === 404) {
        return GetCrashError.NoSuchCrashId
    } else {
        throw new Error("Unexpected status code: " + response.code)
    }
}

function CrashyUi() {
    if (window.location.pathname === "/") {
        return <Text text={"No Crash ID specified"}/>
    } else {
        return CrashyCrashUi();
    }
}

function CrashyCrashUi() {
    const [crash, setCrash] = useState<CrashLogResponse | undefined>(undefined)
    useEffect(() => {
        getCrash(window.location.pathname.slice(1)).then(res => setCrash(res));
    })
    if (crash === undefined) {
        return <Text text={"Loading..."}/>
    } else if (crash) {
        return <CrashReportUi report={parseCrashReportRich(crash)}/>
    } else {
        return <Text text={"No such crash ID"}/>
    }

}

//todo: add nice error messages when there is a failure parsing
function App() {


    const outerTheme = createTheme({
        palette: {
            type: 'dark',
            secondary: {
                main: red[500],
            },
            text: {
                secondary: grey[600]
            }
        },
    });

    return (
        // @ts-ignore
        <MuiThemeProvider theme={outerTheme}>

            <CssBaseline/>
            {/*<h1 className="glow">GLOWING TEXT</h1>*/}

            <AppBar style={{backgroundColor: slightlyPronouncedColor}}>
                <Text align={"center"} variant="h3" text={"Minecraft Crash Report"}/>
            </AppBar>

            <div style={{marginTop: 70}}>
                {CrashyUi()}
                {/*<Grid container direction="row" style = {{marginTop: 70}}>*/}
                {/*    /!*<Text text = "  asdf"/>*!/*/}
                {/*    /!*<Text text = "   addddloha"/>*!/*/}
                {/*    <Grid item>*/}

            </div>
        </MuiThemeProvider>
    )
}


export default App;
