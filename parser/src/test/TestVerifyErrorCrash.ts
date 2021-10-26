export const TestVerifyErrorCrash = `---- Minecraft Crash Report ----
// Daisy, daisy...

Time: 2021-10-25, 10:07 a.m.
Description: Initializing game

java.lang.VerifyError: Bad type on operand stack
Exception Details:
  Location:
    net/minecraft/class_5944.<init>(Lnet/minecraft/class_5912;Ljava/lang/String;Lnet/minecraft/class_293;)V @7: invokespecial
  Reason:
    Type uninitializedThis (current frame, stack[2]) is not assignable to 'net/minecraft/class_5944'
  Current Frame:
    bci: @7
    flags: { flagThisUninit }
    locals: { uninitializedThis, 'net/minecraft/class_5912', 'java/lang/String', 'net/minecraft/class_293' }
    stack: { uninitializedThis, 'net/minecraft/class_5912', uninitializedThis, 'java/lang/String', 'net/minecraft/class_5912', 'java/lang/String', 'net/minecraft/class_293' }
  Bytecode:
    0000000: 2a2b 2a2c 2b2c 2db7 005b 59c7 000d bb00
    0000010: 5d59 125f b700 62bf 2db7 0065 b1       
  Stackmap Table:
    full_frame(@24,{UninitializedThis,Object[#108],Object[#110],Object[#112]},{UninitializedThis,Object[#108],Object[#114]})

\tat Not Enough Crashes deobfuscated stack trace.(1.17.1+build.63)
\tat net.minecraft.client.render.GameRenderer.preloadShaders(GameRenderer:438)
\tat net.minecraft.client.MinecraftClient.<init>(MinecraftClient:617)
\tat net.minecraft.client.main.Main.main(Main:179)
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)
\tat jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)
\tat java.lang.reflect.Method.invoke(Unknown Source)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Render thread
Stacktrace:
\tat net.minecraft.class_757.method_34521(class_757.java:438)
\tat net.minecraft.class_310.<init>(class_310.java:617)

-- Initialization --
Details:
Stacktrace:
\tat net.minecraft.client.main.Main.main(Main.java:179)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)
\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)

-- System Details --
Details:
\tMinecraft Version: 1.17.1
\tMinecraft Version ID: 1.17.1
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 16.0.1, AdoptOpenJDK
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode, sharing), AdoptOpenJDK
\tMemory: 11743790336 bytes (11199 MiB) / 12884901888 bytes (12288 MiB) up to 12884901888 bytes (12288 MiB)
\tCPUs: 8
\tProcessor Vendor: AuthenticAMD
\tProcessor Name: AMD Ryzen 3 3100 4-Core Processor              
\tIdentifier: AuthenticAMD Family 23 Model 113 Stepping 0
\tMicroarchitecture: Zen 2
\tFrequency (GHz): 3.59
\tNumber of physical packages: 1
\tNumber of physical CPUs: 4
\tNumber of logical CPUs: 8
\tGraphics card #0 name: NVIDIA GeForce RTX 3060
\tGraphics card #0 vendor: NVIDIA (0x10de)
\tGraphics card #0 VRAM (MB): 4095.00
\tGraphics card #0 deviceId: 0x2504
\tGraphics card #0 versionInfo: DriverVersion=30.0.14.7212
\tMemory slot #0 capacity (MB): 8192.00
\tMemory slot #0 clockSpeed (GHz): 3.20
\tMemory slot #0 type: DDR4
\tMemory slot #1 capacity (MB): 8192.00
\tMemory slot #1 clockSpeed (GHz): 3.20
\tMemory slot #1 type: DDR4
\tVirtual memory max (MB): 26862.75
\tVirtual memory used (MB): 23740.06
\tSwap memory total (MB): 10534.23
\tSwap memory used (MB): 322.77
\tJVM Flags: 9 total; -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xms12288m -Xmx12288m
\tFabric Mods: 
\t\tblur: Blur (Fabric) 2.1.0
\t\tfabric: Fabric API 0.41.0+1.17
\t\tfabric-api-base: Fabric API Base 0.3.0+a02b44633d
\t\tfabric-api-lookup-api-v1: Fabric API Lookup API (v1) 1.3.0+cbda931818
\t\tfabric-biome-api-v1: Fabric Biome API (v1) 3.2.0+cbda931818
\t\tfabric-blockrenderlayer-v1: Fabric BlockRenderLayer Registration (v1) 1.1.5+a02b446318
\t\tfabric-command-api-v1: Fabric Command API (v1) 1.1.3+5ab9934c18
\t\tfabric-commands-v0: Fabric Commands (v0) 0.2.2+92519afa18
\t\tfabric-containers-v0: Fabric Containers (v0) 0.1.12+cbda931818
\t\tfabric-content-registries-v0: Fabric Content Registries (v0) 0.3.0+cbda931818
\t\tfabric-crash-report-info-v1: Fabric Crash Report Info (v1) 0.1.5+be9da31018
\t\tfabric-dimensions-v1: Fabric Dimensions API (v1) 2.0.11+6cefd57718
\t\tfabric-entity-events-v1: Fabric Entity Events (v1) 1.3.0+57bef5a318
\t\tfabric-events-interaction-v0: Fabric Events Interaction (v0) 0.4.10+fc40aa9d18
\t\tfabric-events-lifecycle-v0: Fabric Events Lifecycle (v0) 0.2.1+92519afa18
\t\tfabric-game-rule-api-v1: Fabric Game Rule API (v1) 1.0.7+cbda931818
\t\tfabric-item-api-v1: Fabric Item API (v1) 1.2.4+cbda931818
\t\tfabric-item-groups-v0: Fabric Item Groups (v0) 0.2.10+b7ab612118
\t\tfabric-key-binding-api-v1: Fabric Key Binding API (v1) 1.0.4+cbda931818
\t\tfabric-keybindings-v0: Fabric Key Bindings (v0) 0.2.2+36b77c3e18
\t\tfabric-lifecycle-events-v1: Fabric Lifecycle Events (v1) 1.4.4+a02b446318
\t\tfabric-loot-tables-v1: Fabric Loot Tables (v1) 1.0.4+a02b446318
\t\tfabric-mining-levels-v0: Fabric Mining Levels (v0) 0.1.3+92519afa18
\t\tfabric-models-v0: Fabric Models (v0) 0.3.0+a02b446318
\t\tfabric-networking-api-v1: Fabric Networking API (v1) 1.0.13+cbda931818
\t\tfabric-networking-blockentity-v0: Fabric Networking Block Entity (v0) 0.2.11+a02b446318
\t\tfabric-networking-v0: Fabric Networking (v0) 0.3.2+92519afa18
\t\tfabric-object-builder-api-v1: Fabric Object Builder API (v1) 1.10.9+cbda931818
\t\tfabric-object-builders-v0: Fabric Object Builders (v0) 0.7.3+a02b446318
\t\tfabric-particles-v1: Fabric Particles (v1) 0.2.4+a02b446318
\t\tfabric-registry-sync-v0: Fabric Registry Sync (v0) 0.7.11+7931163218
\t\tfabric-renderer-api-v1: Fabric Renderer API (v1) 0.4.4+cbda931818
\t\tfabric-renderer-indigo: Fabric Renderer - Indigo 0.4.8+cbda931818
\t\tfabric-renderer-registries-v1: Fabric Renderer Registries (v1) 3.2.4+7931163218
\t\tfabric-rendering-data-attachment-v1: Fabric Rendering Data Attachment (v1) 0.1.5+a02b446318
\t\tfabric-rendering-fluids-v1: Fabric Rendering Fluids (v1) 0.1.14+4658223018
\t\tfabric-rendering-v0: Fabric Rendering (v0) 1.1.5+7931163218
\t\tfabric-rendering-v1: Fabric Rendering (v1) 1.9.0+7931163218
\t\tfabric-resource-loader-v0: Fabric Resource Loader (v0) 0.4.8+a00e834b18
\t\tfabric-screen-api-v1: Fabric Screen API (v1) 1.0.4+198a96213d
\t\tfabric-screen-handler-api-v1: Fabric Screen Handler API (v1) 1.1.8+cbda931818
\t\tfabric-structure-api-v1: Fabric Structure API (v1) 1.1.13+5ab9934c18
\t\tfabric-tag-extensions-v0: Fabric Tag Extensions (v0) 1.2.1+b06cb95b18
\t\tfabric-textures-v0: Fabric Textures (v0) 1.0.6+a02b446318
\t\tfabric-tool-attribute-api-v1: Fabric Tool Attribute API (v1) 1.2.12+b7ab612118
\t\tfabric-transfer-api-v1: Fabric Transfer API (v1) 1.4.0+7931163218
\t\tfabricloader: Fabric Loader 0.11.7
\t\tjava: OpenJDK 64-Bit Server VM 16
\t\tmidnightlib: MidnightLib 0.2.5
\t\tminecraft: Minecraft 1.17.1
\t\tmm: Manningham Mills 2.3
\t\tmodmenu: Mod Menu 2.0.14
\t\tnotenoughcrashes: Not Enough Crashes 3.7.0+1.17.1
\t\toptifabric: OptiFabric 1.11.20
\t\tsatin: Satin 1.6.4
\tLaunched Version: 1.17.1
\tBackend library: LWJGL version 3.2.2 build 10
\tBackend API: NVIDIA GeForce RTX 3060/PCIe/SSE2 GL version 3.2.0 NVIDIA 472.12, NVIDIA Corporation
\tWindow size: <not initialized>
\tGL Caps: Using framebuffer using OpenGL 3.2
\tGL debug messages: 
\tUsing VBOs: Yes
\tIs Modded: Definitely; Client brand changed to 'fabric'
\tType: Client (map_client.txt)
\tCPU: 8x AMD Ryzen 3 3100 4-Core Processor 
\tOptiFine Version: OptiFine_1.17.1_HD_U_G9
\tOptiFine Build: 20210831-004129
\tRender Distance Chunks: 16
\tMipmaps: 4
\tAnisotropic Filtering: 1
\tAntialiasing: 0
\tMultitexture: false
\tShaders: null
\tOpenGlVersion: 3.2.0 NVIDIA 472.12
\tOpenGlRenderer: NVIDIA GeForce RTX 3060/PCIe/SSE2
\tOpenGlVendor: NVIDIA Corporation
\tCpuCount: 8
\tSuspected Mods: Fabric Loader (fabricloader)

-- OptiFabric --
Details:
\tOptiFine jar designed for: 1.17.1
\tOptiFine jar version: OptiFine_1.17.1_HD_U_G9
\tOptiFine jar status: Valid OptiFine mod
\tOptiFine remapped jar: C:/Users/cmyki/AppData/Roaming/.technic/modpacks/vanilla-tweaks-two/.optifine/OptiFine_1.17.1_HD_U_G9/Optifine-mapped.jar
\tOptiFabric error: <None>`
