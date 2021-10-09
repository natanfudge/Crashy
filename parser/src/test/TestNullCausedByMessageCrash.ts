export const TestNullCausedByMessageCrash = `---- Minecraft Crash Report ----
// Don't be sad, have a hug! <3

Time: 09/10/2021, 11:34
Description: Initializing game

java.lang.RuntimeException: Could not execute entrypoint stage 'main' due to errors, provided by 'notenoughcrashes'!
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointUtils.invoke0(EntrypointUtils.java:50)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointUtils.invoke(EntrypointUtils.java:33)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointClient.start(EntrypointClient.java:33)
\tat fudge.notenoughcrashes.fabric.mixinhandlers.ModLoaders.fabricEntrypoints(ModLoaders.java:9)
\tat net.minecraft.client.MinecraftClient.redirect$zbg000$catchFabricInit(MinecraftClient.java:4054)
\tat net.minecraft.client.MinecraftClient.<init>(MinecraftClient.java:457)
\tat net.minecraft.client.main.Main.main(Main.java:179)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:567)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)
\tat net.fabricmc.devlaunchinjector.Main.main(Main.java:86)
\tat dev.architectury.transformer.TransformerRuntime.main(TransformerRuntime.java:206)
Caused by: java.lang.NullPointerException
\tat fudge.notenoughcrashes.NotEnoughCrashes.initialize(NotEnoughCrashes.java:54)
\tat fudge.notenoughcrashes.fabric.NotEnoughCrashesFabric.onInitialize(NotEnoughCrashesFabric.java:10)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointUtils.invoke0(EntrypointUtils.java:47)
\t... 15 more


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Render thread
Stacktrace:
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointUtils.invoke0(EntrypointUtils.java:50)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointUtils.invoke(EntrypointUtils.java:33)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointClient.start(EntrypointClient.java:33)

-- Initialization --
Details:
Stacktrace:
\tat fudge.notenoughcrashes.mixinhandlers.EntryPointCatcher.handleEntryPointError(EntryPointCatcher.java:38)
\tat net.minecraft.client.MinecraftClient.redirect$zbg000$catchFabricInit(MinecraftClient.java:4056)
\tat net.minecraft.client.MinecraftClient.<init>(MinecraftClient.java:457)
\tat net.minecraft.client.main.Main.main(Main.java:179)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:567)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)
\tat net.fabricmc.devlaunchinjector.Main.main(Main.java:86)
\tat dev.architectury.transformer.TransformerRuntime.main(TransformerRuntime.java:206)

-- System Details --
Details:
\tMinecraft Version: 1.17.1
\tMinecraft Version ID: 1.17.1
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 16.0.2, Oracle Corporation
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode, sharing), Oracle Corporation
\tMemory: 331507752 bytes (316 MiB) / 2143289344 bytes (2044 MiB) up to 4282384384 bytes (4084 MiB)
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
\tVirtual memory max (MB): 22990.71
\tVirtual memory used (MB): 16470.10
\tSwap memory total (MB): 6656.00
\tSwap memory used (MB): 65.28
\tJVM Flags: 0 total; 
\tLaunched Version: 1.17.1
\tBackend library: LWJGL version 3.2.2 build 10
\tBackend API: NO CONTEXT
\tWindow size: <not initialized>
\tGL Caps: Using framebuffer using OpenGL 3.2
\tGL debug messages: <disabled>
\tUsing VBOs: Yes
\tIs Modded: Definitely; Client brand changed to 'fabric'
\tType: Client (map_client.txt)
\tCPU: <unknown>
\tSuspected Mods: Not Enough Crashes (notenoughcrashes), Minecraft (minecraft), Fabric Loader (fabricloader)`