export const BarebonesFabricCrash = `---- Minecraft Crash Report ----
// You're mean.

Time: 08/10/2021, 22:16
Description: Unexpected error

io.github.natanfudge.NecTestCrash: Test Game Loop Crash
\tat io.github.natanfudge.NecTestMod.lambda$onInitialize$0(NecTestMod.java:37)
\tat net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents.lambda$static$2(ClientTickEvents.java:65)
\tat net.minecraft.client.MinecraftClient.handler$zzk000$onEndTick(MinecraftClient.java:3073)
\tat net.minecraft.client.MinecraftClient.tick(MinecraftClient.java:1806)
\tat net.minecraft.client.MinecraftClient.render(MinecraftClient.java:1081)
\tat net.minecraft.client.MinecraftClient.run(MinecraftClient.java:728)
\tat fudge.notenoughcrashes.mixinhandlers.InGameCatcher.handleClientCrash(InGameCatcher.java:37)
\tat net.minecraft.client.MinecraftClient.modify$zbc000$atTheEndOfSecondCatchBeforePrintingCrashReport(MinecraftClient.java:3604)
\tat net.minecraft.client.MinecraftClient.run(MinecraftClient.java:755)
\tat net.minecraft.client.main.Main.main(Main.java:217)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:567)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)
\tat net.fabricmc.devlaunchinjector.Main.main(Main.java:86)
\tat dev.architectury.transformer.TransformerRuntime.main(TransformerRuntime.java:206)


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Render thread
Stacktrace:
\tat io.github.natanfudge.NecTestMod.lambda$onInitialize$0(NecTestMod.java:37)
\tat net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents.lambda$static$2(ClientTickEvents.java:65)
\tat net.minecraft.client.MinecraftClient.handler$zzk000$onEndTick(MinecraftClient.java:3073)

-- Affected level --
Details:
\tAll players: 1 total; [ClientPlayerEntity['Player717'/415, l='ClientLevel', x=-246.50, y=65.00, z=-248.50]]
\tChunk stats: 841, 529
\tLevel dimension: minecraft:overworld
\tLevel spawn location: World: (-249,64,-240), Section: (at 7,0,0 in -16,4,-15; chunk contains blocks -256,0,-240 to -241,255,-225), Region: (-1,-1; contains chunks -32,-32 to -1,-1, blocks -512,0,-512 to -1,255,-1)
\tLevel time: 1690 game time, 1690 day time
\tServer brand: fabric
\tServer type: Integrated singleplayer server
Stacktrace:
\tat net.minecraft.client.world.ClientWorld.addDetailsToCrashReport(ClientWorld.java:370)
\tat net.minecraft.client.MinecraftClient.addDetailsToCrashReport(MinecraftClient.java:2399)
\tat net.minecraft.client.MinecraftClient.run(MinecraftClient.java:752)
\tat fudge.notenoughcrashes.mixinhandlers.InGameCatcher.handleClientCrash(InGameCatcher.java:37)
\tat net.minecraft.client.MinecraftClient.modify$zbc000$atTheEndOfSecondCatchBeforePrintingCrashReport(MinecraftClient.java:3604)
\tat net.minecraft.client.MinecraftClient.run(MinecraftClient.java:755)
\tat net.minecraft.client.main.Main.main(Main.java:217)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:567)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)
\tat net.fabricmc.devlaunchinjector.Main.main(Main.java:86)
\tat dev.architectury.transformer.TransformerRuntime.main(TransformerRuntime.java:206)

-- Last reload --
Details:
\tReload number: 1
\tReload reason: initial
\tFinished: Yes
\tPacks: Default

-- System Details --
Details:
\tMinecraft Version: 1.17.1
\tMinecraft Version ID: 1.17.1
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 16.0.2, Oracle Corporation
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode, sharing), Oracle Corporation
\tMemory: 1412112952 bytes (1346 MiB) / 2300575744 bytes (2194 MiB) up to 4282384384 bytes (4084 MiB)
\tCPUs: 16
\tProcessor Vendor: AuthenticAMD
\tProcessor Name: AMD Ryzen 7 3700X 8-Core Processor             
\tIdentifier: AuthenticAMD Family 23 Model 113 Stepping 0
\tMicroarchitecture: unknown
\tFrequency (GHz): 3.59
\tNumber of physical packages: 1
\tNumber of physical CPUs: 8
\tNumber of logical CPUs: 16
\tGraphics card #0 name: Radeon RX 580 Series
\tGraphics card #0 vendor: Advanced Micro Devices, Inc. (0x1002)
\tGraphics card #0 VRAM (MB): 4095.00
\tGraphics card #0 deviceId: 0x67df
\tGraphics card #0 versionInfo: DriverVersion=30.0.13019.1006
\tMemory slot #0 capacity (MB): 16384.00
\tMemory slot #0 clockSpeed (GHz): 2.67
\tMemory slot #0 type: DDR4
\tVirtual memory max (MB): 25316.61
\tVirtual memory used (MB): 22077.04
\tSwap memory total (MB): 8981.89
\tSwap memory used (MB): 951.53
\tJVM Flags: 0 total; 
\tLaunched Version: Fabric
\tBackend library: LWJGL version 3.2.2 build 10
\tBackend API: Radeon RX 580 Series GL version 3.2.14761 Core Profile Forward-Compatible Context 21.30.19.01 30.0.13019.1006, ATI Technologies Inc.
\tWindow size: 854x480
\tGL Caps: Using framebuffer using OpenGL 3.2
\tGL debug messages: 
\tUsing VBOs: Yes
\tIs Modded: Definitely; Client brand changed to 'fabric'
\tType: Integrated Server (map_client.txt)
\tGraphics mode: fancy
\tResource Packs: 
\tCurrent Language: English (US)
\tCPU: 16x AMD Ryzen 7 3700X 8-Core Processor 
\tPlayer Count: 1 / 8; [ServerPlayerEntity['Player717'/415, l='ServerLevel[New World]', x=-246.50, y=65.00, z=-248.50]]
\tData Packs: vanilla
\tClient Crashes Since Restart: 2
\tIntegrated Server Crashes Since Restart: 0
\tSuspected Mods: Not Enough Crashes Test Mod (nec_testmod), Not Enough Crashes (notenoughcrashes), Fabric Lifecycle Events (v1) (fabric-lifecycle-events-v1)`