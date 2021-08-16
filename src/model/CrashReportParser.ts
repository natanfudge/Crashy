import {CrashReport, CrashReportSection, CrashReportSectionElement, StackTrace, StackTraceElement} from "./CrashReport";

class StringBuilder {
    str: string

    constructor(str: string) {
        this.str = str;
    }

    append(str: string) {
        this.str += str
    }
}

export function parseCrashReport(rawReport: string): CrashReport {
    let cursor = 0;

    function current(): string {
        return rawReport[cursor];
    }

    function readCurrent(): string {
        const value = current();
        skip();
        return value;
    }

    function skip() {
        cursor++;
    }

    function skipNumber(number: number) {
        cursor += number;
    }

    //TODO: see if this can be optimized by calculating length AOT
    function skipString(string: string) {
        skipNumber(string.length);
    }

    function nextIsString(string: string): boolean {
        for (let i = 0; i < string.length; i++) {
            if (rawReport[cursor + i] !== string[i]) return false;
        }
        return true;
    }

    function isEof() : boolean {
        return cursor === rawReport.length - 1;
    }

    function next(): string {
        return rawReport[cursor + 1];
    }

    function skipChars(chars: string[]) {
        while (chars.includes(current())) {
            skip();
        }
    }

    function buildString(builder: (str: StringBuilder) => void): string {
        let str = new StringBuilder('');
        builder(str);
        return str.str;
    }

    // function parseTitle(): string {
    //     return buildString(str => {
    //         while (next() !== '-') {
    //             str.append(parseCurrent());
    //         }
    //     })
    // }

    function readUntilChar(char: string): string {
        return buildString(str => {
            while (current() !== char) {
                str.append(readCurrent());
            }
        })
    }

    function readUntilNextChar(char: string): string {
        return buildString(str => {
            while (next() !== char) {
                str.append(readCurrent());
            }
        })
    }

    function readLine(): string {
        const value = readUntilChar('\n');
        skip();
        return value;
    }

    function parseWittyComment(): string {
        skipChars(['/', ' ']);
        return readLine();
    }

    function parseTime(): string {
        skipString("Time: ")
        return readLine();
    }

    function parseDescription(): string {
        skipString("Description: ")
        return readLine();
    }

    function parseStackTrace(): StackTrace {
        const message = readLine();
        const trace = [];
        while (current() !== '\n') {
            trace.push(parseStackTraceElement());
        }
        return {
            children: [
                //TODO: need better examples of this
            ],
            message: message,
            trace: trace
        }
    }

    function parseStackTraceElement(): StackTraceElement {
        // Skip leading tab
        skipString("\tat ");
        return readLine();
    }

    function parseSections(): CrashReportSection[] {
        const sections = [];
        while (!isEof()
        //TODO: implement stack trace parsing so we can get rid of this check. note that we treat the system details like a normal section here.
        && sections.length === 0
            ) {
            sections.push(parseSection())
        }
        return sections;
    }

    function parseSection(): CrashReportSection {
        skipChars(['-', ' ']);
        const title = readUntilNextChar('-');
        skipString(" --\nDetails:\n")

        const elements = [];
        while (!isEof() &&  !nextIsString("Stacktrace:\n")) {
            elements.push(parseSectionElement());
        }

        return {
            title,
            elements,
            stacktrace: []
        }
    }

    function parseSectionElement(): CrashReportSectionElement {
        // Skip leading tab
        skip();
        const name = readUntilChar(':');
        skipString(": ")
        const detail = readLine();
        return {detail, name}
    }

    skipString("---- Minecraft Crash Report ----\n")

    const wittyComment = parseWittyComment();

    // Skip empty line
    skip();

    const time = parseTime();
    const description = parseDescription();

    // Skip empty line
    skip();

    const stackTrace = parseStackTrace();

    skipString("\n\nA detailed walkthrough of the error, its code path and all known details is as follows:\n---------------------------------------------------------------------------------------\n\n")

    const sections = parseSections();


    return {
        systemDetails: {
            sections: {}
        },
        sections,
        description,
        time,
        wittyComment,
        stacktrace: stackTrace
    }
}

 const asdf = `
A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Affected level --
Details:
\tAll players: 1 total; [ClientPlayerEntity['Kyartyi1337'/804445, l='ClientLevel', x=-712.19, y=64.00, z=-228.79]]
\tChunk stats: Client Chunk Cache: 361, 225
\tLevel dimension: minecraft:overworld
\tLevel spawn location: World: (-245,64,-292), Chunk: (at 11,4,12 in -16,-19; contains blocks -256,0,-304 to -241,255,-289), Region: (-1,-1; contains chunks -32,-32 to -1,-1, blocks -512,0,-512 to -1,255,-1)
\tLevel time: 29891 game time, 126559960 day time
\tServer brand: Waterfall <- Airplane
\tServer type: Non-integrated multiplayer server
Stacktrace:
\tat net.minecraft.client.world.ClientWorld.func_72914_a(ClientWorld.java:617) ~[?:?] {re:classloading,xf:OptiFine:default}
\tat net.minecraft.client.Minecraft.func_71396_d(Minecraft.java:2029) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat fudge.notenoughcrashes.mixinhandlers.InGameCatcher.handleClientCrash(InGameCatcher.java:28) ~[?:?] {re:mixin,re:classloading}
\tat net.minecraft.client.Minecraft.modify$zzh000$onCrash(Minecraft.java:2548) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.Minecraft.func_99999_d(Minecraft.java:628) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.Minecraft.handler$zzh000$afterCrashHandled(Minecraft.java:2540) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.Minecraft.func_99999_d(Minecraft.java:623) [?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.main.Main.main(Main.java:184) [?:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:A,pl:runtimedistcleaner:A}
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_51] {}
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_51] {}
\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_51] {}
\tat java.lang.reflect.Method.invoke(Method.java:497) ~[?:1.8.0_51] {}
\tat net.minecraftforge.fml.loading.FMLClientLaunchProvider.lambda$launchService$0(FMLClientLaunchProvider.java:51) [forge-1.16.5-36.1.16.jar:36.1] {}
\tat net.minecraftforge.fml.loading.FMLClientLaunchProvider$$Lambda$451/3671592.call(Unknown Source) [forge-1.16.5-36.1.16.jar:36.1] {}
\tat cpw.mods.modlauncher.LaunchServiceHandlerDecorator.launch(LaunchServiceHandlerDecorator.java:37) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:54) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:72) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.Launcher.run(Launcher.java:82) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.Launcher.main(Launcher.java:66) [modlauncher-8.0.9.jar:?] {re:classloading}

-- System Details --
Details:
\tMinecraft Version: 1.16.5
\tMinecraft Version ID: 1.16.5
\tOperating System: Windows 7 (x86) version 6.1
\tJava Version: 1.8.0_51, Oracle Corporation
\tJava VM Version: Java HotSpot(TM) Client VM (mixed mode), Oracle Corporation
\tMemory: 550771464 bytes (525 MB) / 1073741824 bytes (1024 MB) up to 1073741824 bytes (1024 MB)
\tCPUs: 2
\tJVM Flags: 9 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xss1M -Xmx1G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=16M
\tModLauncher: 8.0.9+86+master.3cf110c
\tModLauncher launch target: fmlclient
\tModLauncher naming: srg
\tModLauncher services: 
\t\t/mixin-0.8.2.jar mixin PLUGINSERVICE 
\t\t/eventbus-4.0.0.jar eventbus PLUGINSERVICE 
\t\t/forge-1.16.5-36.1.16.jar object_holder_definalize PLUGINSERVICE 
\t\t/forge-1.16.5-36.1.16.jar runtime_enum_extender PLUGINSERVICE 
\t\t/accesstransformers-3.0.1.jar accesstransformer PLUGINSERVICE 
\t\t/forge-1.16.5-36.1.16.jar capability_inject_definalize PLUGINSERVICE 
\t\t/forge-1.16.5-36.1.16.jar runtimedistcleaner PLUGINSERVICE 
\t\t/mixin-0.8.2.jar mixin TRANSFORMATIONSERVICE 
\t\t/optifine_1.16.5_hd_u_g8.jar OptiFine TRANSFORMATIONSERVICE 
\t\t/forge-1.16.5-36.1.16.jar fml TRANSFORMATIONSERVICE 
\tFML: 36.1
\tForge: net.minecraftforge:36.1.16
\tFML Language Providers: 
\t\tjavafml@36.1
\t\tminecraft@1
\tMod List: 
\t\tforge-1.16.5-36.1.16-client.jar                   |Minecraft                     |minecraft                     |1.16.5              |DONE      |NOSIGNATURE
\t\tnotenoughcrashes-3.2.0-forge.jar                  |Not Enough Crashes            |notenoughcrashes              |3.2.0               |DONE      |NOSIGNATURE
\t\tcameraoverhaul-1_0-1_16_4.jar                     |Camera Overhaul               |cameraoverhaul                |1.0.0               |DONE      |NOSIGNATURE
\t\tforge-1.16.5-36.1.16-universal.jar                |Forge                         |forge                         |36.1.16             |DONE      |22:af:21:d8:19:82:7f:93:94:fe:2b:ac:b7:e4:41:57:68:39:87:b1:a7:5c:c6:44:f9:25:74:21:14:f5:0d:90
\t\ttoolswap-1.16.2-1.3.2.jar                         |ToolSwap                      |toolswap                      |1.3.2               |DONE      |NOSIGNATURE
\t\tworldedit-mod-7.2.5-dist.jar                      |WorldEdit                     |worldedit                     |7.2.5+57d5ac9       |DONE      |NOSIGNATURE
\t\tadvanced-xray-forge-1.16.5-2.7.0.jar              |Advanced XRay                 |xray                          |2.7.0               |DONE      |NOSIGNATURE
\t\tshulkertooltip-1.9.9-1.jar                        |Shulker Tooltip               |shulkertooltip                |1.9.9               |DONE      |NOSIGNATURE
\t\tjei-1.16.5-7.7.1.118.jar                          |Just Enough Items             |jei                           |7.7.1.118           |DONE      |NOSIGNATURE
\tCrash Report UUID: 1d842d1d-3c83-4466-94e4-e704392c8255
\tSuspected Mods: Unknown
\tLaunched Version: 1.16.5-forge-36.1.16
\tBackend library: LWJGL version 3.2.2 build 10
\tBackend API: GeForce GT 240M/PCIe/SSE2 GL version 3.3.0, NVIDIA Corporation
\tGL Caps: Using framebuffer using OpenGL 3.0
\tUsing VBOs: Yes
\tIs Modded: Definitely; Client brand changed to 'forge'
\tType: Client (map_client.txt)
\tGraphics mode: fancy
\tResource Packs: vanilla, mod_resources, file/VanillaTweaks_r586244.zip
\tCurrent Language: ??????? (??????)
\tCPU: 2x Intel(R) Core(TM)2 Duo CPU T6600 @ 2.20GHz
\tClient Crashes Since Restart: 2
\tIntegrated Server Crashes Since Restart: 0
\tOptiFine Version: OptiFine_1.16.5_HD_U_G8
\tOptiFine Build: 20210515-161946
\tRender Distance Chunks: 9
\tMipmaps: 2
\tAnisotropic Filtering: 1
\tAntialiasing: 0
\tMultitexture: false
\tShaders: null
\tOpenGlVersion: 3.3.0
\tOpenGlRenderer: GeForce GT 240M/PCIe/SSE2
\tOpenGlVendor: NVIDIA Corporation
\tCpuCount: 2
\tLaunched Version: 1.16.5-forge-36.1.16
\tBackend library: LWJGL version 3.2.2 build 10
\tBackend API: GeForce GT 240M/PCIe/SSE2 GL version 3.3.0, NVIDIA Corporation
\tGL Caps: Using framebuffer using OpenGL 3.0
\tUsing VBOs: Yes
\tIs Modded: Definitely; Client brand changed to 'forge'
\tType: Client (map_client.txt)
\tGraphics mode: fancy
\tResource Packs: vanilla, mod_resources, file/VanillaTweaks_r586244.zip
\tCurrent Language: ??????? (??????)
\tCPU: 2x Intel(R) Core(TM)2 Duo CPU T6600 @ 2.20GHz`