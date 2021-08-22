import React from 'react';
import '../App.css';
import {AppBar, createTheme, CssBaseline, MuiThemeProvider, Typography} from "@material-ui/core";
import {red} from "@material-ui/core/colors";
import {CrashReport, StackTrace, StackTraceElement} from "../model/CrashReport";
import {CanvasElement} from "./Canvas";
import {CrashReportUi} from "./CrashReportUi";
import {Text} from "./ImprovedApi";
import {parseCrashReport} from "../model/CrashReportParser";
import {crashWithOptifine} from "../model/TestCrashes";


const testStackTrace: StackTrace = {
    message: "java.lang.StackOverflowError: charTyped event handler",
    trace: [
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
            details: [
                {
                    name: "All players",
                    detail: "1 total; [ClientPlayerEntity['Kyartyi1337'/804445, l='ClientLevel', x=-712.19, y=64.00, z=-228.79]]"
                },
                {
                    name: "Chunk stats",
                    detail: "Client Chunk Cache: 361, 225"
                },
                {
                    name: "Level dimension",
                    detail: "minecraft:overworld"
                }
            ],
            stacktrace: testElementStackTrace,
        }
    ],
    systemDetails: {
        sections: {
            "Minecraft Version": "1.16.5",
            "Minecraft Version ID": "1.16.5",
            "Operating System": "Windows 7 (x86) version 6.1"
        }
    }
}

const parsed = parseCrashReport(crashWithOptifine);

//TODO: note that developers generally prefer their crashlog to be in simple texts, so try to get rid of the elevation stuff.
function App() {
    const outerTheme = createTheme({
        palette: {
            type: 'dark',
            secondary: {
                main: red[500],
            },
        },
    });

    return (
        // @ts-ignore
        <MuiThemeProvider theme={outerTheme}>

            <CssBaseline/>

            <AppBar color="inherit">
                <Text align={"center"} variant="h3" text = {"Minecraft Crash Report"}/>
            </AppBar>

            <div style={{marginTop: 70}}>
                {CrashReportUi(testCrashReport)}
                {/*<Grid container direction="row" style = {{marginTop: 70}}>*/}
                {/*    /!*<Text text = "  asdf"/>*!/*/}
                {/*    /!*<Text text = "   addddloha"/>*!/*/}
                {/*    <Grid item>*/}

            </div>
        </MuiThemeProvider>
    )
}


export default App;
