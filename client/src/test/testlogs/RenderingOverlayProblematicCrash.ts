export const RenderingOverlayProblematicCrash = `---- Minecraft Crash Report ----
// Who set us up the TNT?

Time: 13.11.2022, 14:40
Description: Rendering overlay

net.minecraftforge.fml.config.ConfigFileTypeHandler$ConfigLoadingException: Failed loading config file preciseblockplacing-client.toml of type CLIENT for modid preciseblockplacing
\tat net.minecraftforge.fml.config.ConfigFileTypeHandler.lambda$reader$1(ConfigFileTypeHandler.java:47) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat net.minecraftforge.fml.config.ConfigTracker.openConfig(ConfigTracker.java:60) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat net.minecraftforge.fml.config.ConfigTracker.lambda$loadConfigs$1(ConfigTracker.java:50) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat java.lang.Iterable.forEach(Iterable.java:75) ~[?:?] {re:mixin}
\tat java.util.Collections$SynchronizedCollection.forEach(Collections.java:2131) ~[?:?] {}
\tat net.minecraftforge.fml.config.ConfigTracker.loadConfigs(ConfigTracker.java:50) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat net.minecraftforge.fml.core.ModStateProvider.lambda$new$1(ModStateProvider.java:33) ~[forge-1.18.2-40.1.76-universal.jar%23118!/:?] {re:classloading}
\tat net.minecraftforge.fml.DistExecutor.unsafeRunWhenOn(DistExecutor.java:111) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat net.minecraftforge.fml.core.ModStateProvider.lambda$new$3(ModStateProvider.java:33) ~[forge-1.18.2-40.1.76-universal.jar%23118!/:?] {re:classloading}
\tat net.minecraftforge.fml.ModLoader.lambda$dispatchAndHandleError$20(ModLoader.java:186) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat java.util.Optional.ifPresent(Optional.java:178) ~[?:?] {re:mixin}
\tat net.minecraftforge.fml.ModLoader.dispatchAndHandleError(ModLoader.java:186) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat net.minecraftforge.fml.ModLoader.lambda$loadMods$14(ModLoader.java:170) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat java.lang.Iterable.forEach(Iterable.java:75) ~[?:?] {re:mixin}
\tat net.minecraftforge.fml.ModLoader.loadMods(ModLoader.java:170) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat net.minecraftforge.client.loading.ClientModLoader.lambda$startModLoading$5(ClientModLoader.java:121) ~[forge-1.18.2-40.1.76-universal.jar%23118!/:?] {re:classloading,pl:runtimedistcleaner:A}
\tat net.minecraftforge.client.loading.ClientModLoader.lambda$createRunnableWithCatch$4(ClientModLoader.java:112) ~[forge-1.18.2-40.1.76-universal.jar%23118!/:?] {re:classloading,pl:runtimedistcleaner:A}
\tat net.minecraftforge.client.loading.ClientModLoader.startModLoading(ClientModLoader.java:121) ~[forge-1.18.2-40.1.76-universal.jar%23118!/:?] {re:classloading,pl:runtimedistcleaner:A}
\tat net.minecraftforge.client.loading.ClientModLoader.lambda$onResourceReload$2(ClientModLoader.java:103) ~[forge-1.18.2-40.1.76-universal.jar%23118!/:?] {re:classloading,pl:runtimedistcleaner:A}
\tat net.minecraftforge.client.loading.ClientModLoader.lambda$createRunnableWithCatch$4(ClientModLoader.java:112) ~[forge-1.18.2-40.1.76-universal.jar%23118!/:?] {re:classloading,pl:runtimedistcleaner:A}
\tat java.util.concurrent.CompletableFuture$AsyncRun.run(CompletableFuture.java:1804) ~[?:?] {}
\tat java.util.concurrent.CompletableFuture$AsyncRun.exec(CompletableFuture.java:1796) ~[?:?] {}
\tat java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:373) ~[?:?] {}
\tat java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1182) ~[?:?] {}
\tat java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1655) ~[?:?] {re:computing_frames}
\tat java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1622) ~[?:?] {re:computing_frames}
\tat java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:165) ~[?:?] {}
Caused by: com.electronwill.nightconfig.core.io.ParsingException: Not enough data available
\tat com.electronwill.nightconfig.core.io.ParsingException.notEnoughData(ParsingException.java:22) ~[core-3.6.4.jar%237!/:?] {}
\tat com.electronwill.nightconfig.core.io.ReaderInput.directReadChar(ReaderInput.java:36) ~[core-3.6.4.jar%237!/:?] {}
\tat com.electronwill.nightconfig.core.io.AbstractInput.readChar(AbstractInput.java:49) ~[core-3.6.4.jar%237!/:?] {}
\tat com.electronwill.nightconfig.core.io.AbstractInput.readCharsUntil(AbstractInput.java:123) ~[core-3.6.4.jar%237!/:?] {}
\tat com.electronwill.nightconfig.toml.TableParser.parseKey(TableParser.java:166) ~[toml-3.6.4.jar%238!/:?] {}
\tat com.electronwill.nightconfig.toml.TableParser.parseDottedKey(TableParser.java:145) ~[toml-3.6.4.jar%238!/:?] {}
\tat com.electronwill.nightconfig.toml.TableParser.parseNormal(TableParser.java:55) ~[toml-3.6.4.jar%238!/:?] {}
\tat com.electronwill.nightconfig.toml.TomlParser.parse(TomlParser.java:44) ~[toml-3.6.4.jar%238!/:?] {}
\tat com.electronwill.nightconfig.toml.TomlParser.parse(TomlParser.java:37) ~[toml-3.6.4.jar%238!/:?] {}
\tat com.electronwill.nightconfig.core.io.ConfigParser.parse(ConfigParser.java:113) ~[core-3.6.4.jar%237!/:?] {}
\tat com.electronwill.nightconfig.core.io.ConfigParser.parse(ConfigParser.java:219) ~[core-3.6.4.jar%237!/:?] {}
\tat com.electronwill.nightconfig.core.io.ConfigParser.parse(ConfigParser.java:202) ~[core-3.6.4.jar%237!/:?] {}
\tat com.electronwill.nightconfig.core.file.WriteSyncFileConfig.load(WriteSyncFileConfig.java:73) ~[core-3.6.4.jar%237!/:?] {}
\tat com.electronwill.nightconfig.core.file.AutosaveCommentedFileConfig.load(AutosaveCommentedFileConfig.java:85) ~[core-3.6.4.jar%237!/:?] {}
\tat net.minecraftforge.fml.config.ConfigFileTypeHandler.lambda$reader$1(ConfigFileTypeHandler.java:43) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\t... 26 more


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Render thread
Stacktrace:
\tat net.minecraftforge.fml.config.ConfigFileTypeHandler.lambda$reader$1(ConfigFileTypeHandler.java:47) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat net.minecraftforge.fml.config.ConfigTracker.openConfig(ConfigTracker.java:60) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat net.minecraftforge.fml.config.ConfigTracker.lambda$loadConfigs$1(ConfigTracker.java:50) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat java.lang.Iterable.forEach(Iterable.java:75) ~[?:?] {re:mixin}
\tat java.util.Collections$SynchronizedCollection.forEach(Collections.java:2131) ~[?:?] {}
\tat net.minecraftforge.fml.config.ConfigTracker.loadConfigs(ConfigTracker.java:50) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat net.minecraftforge.fml.core.ModStateProvider.lambda$new$1(ModStateProvider.java:33) ~[forge-1.18.2-40.1.76-universal.jar%23118!/:?] {re:classloading}
\tat net.minecraftforge.fml.DistExecutor.unsafeRunWhenOn(DistExecutor.java:111) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
\tat net.minecraftforge.fml.core.ModStateProvider.lambda$new$3(ModStateProvider.java:33) ~[forge-1.18.2-40.1.76-universal.jar%23118!/:?] {re:classloading}
\tat net.minecraftforge.fml.ModLoader.lambda$dispatchAndHandleError$20(ModLoader.java:186) ~[fmlcore-1.18.2-40.1.76.jar%23114!/:?] {}
-- Overlay render details --
Details:
\tOverlay name: net.minecraft.client.gui.screens.LoadingOverlay
Stacktrace:
\tat net.minecraft.client.renderer.GameRenderer.m_109093_(GameRenderer.java:1288) ~[client-1.18.2-20220404.173914-srg.jar%23113!/:?] {re:mixin,pl:accesstransformer:B,xf:OptiFine:default,re:classloading,pl:accesstransformer:B,xf:OptiFine:default}
\tat net.minecraft.client.Minecraft.m_91383_(Minecraft.java:1046) ~[client-1.18.2-20220404.173914-srg.jar%23113!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:APP:fallingleaves.mixins.json:MinecraftClientMixin,pl:mixin:APP:enhancedvisuals.mixins.json:MinecraftMixin,pl:mixin:APP:bookshelf.mixins.json:client.AccessorMinecraft,pl:mixin:APP:inventorio.mixins.json:client.accessor.MinecraftClientAccessor,pl:mixin:APP:architectury.mixins.json:MixinMinecraft,pl:mixin:APP:inventorio.mixins.json:client.MinecraftClientMixin,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.Minecraft.m_91374_(Minecraft.java:665) ~[client-1.18.2-20220404.173914-srg.jar%23113!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:APP:fallingleaves.mixins.json:MinecraftClientMixin,pl:mixin:APP:enhancedvisuals.mixins.json:MinecraftMixin,pl:mixin:APP:bookshelf.mixins.json:client.AccessorMinecraft,pl:mixin:APP:inventorio.mixins.json:client.accessor.MinecraftClientAccessor,pl:mixin:APP:architectury.mixins.json:MixinMinecraft,pl:mixin:APP:inventorio.mixins.json:client.MinecraftClientMixin,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.main.Main.main(Main.java:205) ~[client-1.18.2-20220404.173914-srg.jar%23113!/:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:A,pl:runtimedistcleaner:A}
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:?] {}
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77) ~[?:?] {}
\tat jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:?] {}
\tat java.lang.reflect.Method.invoke(Method.java:568) ~[?:?] {}
\tat net.minecraftforge.fml.loading.targets.CommonClientLaunchHandler.lambda$launchService$0(CommonClientLaunchHandler.java:31) ~[fmlloader-1.18.2-40.1.76.jar%2317!/:?] {}
\tat cpw.mods.modlauncher.LaunchServiceHandlerDecorator.launch(LaunchServiceHandlerDecorator.java:37) [modlauncher-9.1.3.jar%235!/:?] {}
\tat cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:53) [modlauncher-9.1.3.jar%235!/:?] {}
\tat cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:71) [modlauncher-9.1.3.jar%235!/:?] {}
\tat cpw.mods.modlauncher.Launcher.run(Launcher.java:106) [modlauncher-9.1.3.jar%235!/:?] {}
\tat cpw.mods.modlauncher.Launcher.main(Launcher.java:77) [modlauncher-9.1.3.jar%235!/:?] {}
\tat cpw.mods.modlauncher.BootstrapLaunchConsumer.accept(BootstrapLaunchConsumer.java:26) [modlauncher-9.1.3.jar%235!/:?] {}
\tat cpw.mods.modlauncher.BootstrapLaunchConsumer.accept(BootstrapLaunchConsumer.java:23) [modlauncher-9.1.3.jar%235!/:?] {}
\tat cpw.mods.bootstraplauncher.BootstrapLauncher.main(BootstrapLauncher.java:149) [bootstraplauncher-1.0.0.jar:?] {}


-- Last reload --
Details:
\tReload number: 1
\tReload reason: initial
\tFinished: No
\tPacks: Default, Mod Resources, Enhanced+Audio+r3.zip
\tRecovery: Yes
\tRecovery reason: java.util.concurrent.CompletionException: net.minecraftforge.fml.config.ConfigFileTypeHandler$ConfigLoadingException: Failed loading config file preciseblockplacing-client.toml of type CLIENT for modid preciseblockplacing
\tat java.base/java.util.concurrent.CompletableFuture.encodeThrowable(CompletableFuture.java:315)
\tat java.base/java.util.concurrent.CompletableFuture.completeThrowable(CompletableFuture.java:320)
\tat java.base/java.util.concurrent.CompletableFuture$AsyncRun.run(CompletableFuture.java:1807)
\tat java.base/java.util.concurrent.CompletableFuture$AsyncRun.exec(CompletableFuture.java:1796)
\tat java.base/java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:373)
\tat java.base/java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1182)
\tat java.base/java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1655)
\tat java.base/java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1622)
\tat java.base/java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:165)
Caused by: net.minecraftforge.fml.config.ConfigFileTypeHandler$ConfigLoadingException: Failed loading config file preciseblockplacing-client.toml of type CLIENT for modid preciseblockplacing
\tat LAYER PLUGIN/fmlcore@1.18.2-40.1.76/net.minecraftforge.fml.config.ConfigFileTypeHandler.lambda$reader$1(ConfigFileTypeHandler.java:47)
\tat LAYER PLUGIN/fmlcore@1.18.2-40.1.76/net.minecraftforge.fml.config.ConfigTracker.openConfig(ConfigTracker.java:60)
\tat LAYER PLUGIN/fmlcore@1.18.2-40.1.76/net.minecraftforge.fml.config.ConfigTracker.lambda$loadConfigs$1(ConfigTracker.java:50)
\tat java.base/java.lang.Iterable.forEach(Iterable.java:75)
\tat java.base/java.util.Collections$SynchronizedCollection.forEach(Collections.java:2131)
\tat LAYER PLUGIN/fmlcore@1.18.2-40.1.76/net.minecraftforge.fml.config.ConfigTracker.loadConfigs(ConfigTracker.java:50)
\tat TRANSFORMER/forge@40.1.76/net.minecraftforge.fml.core.ModStateProvider.lambda$new$1(ModStateProvider.java:33)
\tat LAYER PLUGIN/fmlcore@1.18.2-40.1.76/net.minecraftforge.fml.DistExecutor.unsafeRunWhenOn(DistExecutor.java:111)
\tat TRANSFORMER/forge@40.1.76/net.minecraftforge.fml.core.ModStateProvider.lambda$new$3(ModStateProvider.java:33)
\tat LAYER PLUGIN/fmlcore@1.18.2-40.1.76/net.minecraftforge.fml.ModLoader.lambda$dispatchAndHandleError$20(ModLoader.java:186)
\tat java.base/java.util.Optional.ifPresent(Optional.java:178)
\tat LAYER PLUGIN/fmlcore@1.18.2-40.1.76/net.minecraftforge.fml.ModLoader.dispatchAndHandleError(ModLoader.java:186)
\tat LAYER PLUGIN/fmlcore@1.18.2-40.1.76/net.minecraftforge.fml.ModLoader.lambda$loadMods$14(ModLoader.java:170)
\tat java.base/java.lang.Iterable.forEach(Iterable.java:75)
\tat LAYER PLUGIN/fmlcore@1.18.2-40.1.76/net.minecraftforge.fml.ModLoader.loadMods(ModLoader.java:170)
\tat TRANSFORMER/forge@40.1.76/net.minecraftforge.client.loading.ClientModLoader.lambda$startModLoading$5(ClientModLoader.java:121)
\tat TRANSFORMER/forge@40.1.76/net.minecraftforge.client.loading.ClientModLoader.lambda$createRunnableWithCatch$4(ClientModLoader.java:112)
\tat TRANSFORMER/forge@40.1.76/net.minecraftforge.client.loading.ClientModLoader.startModLoading(ClientModLoader.java:121)
\tat TRANSFORMER/forge@40.1.76/net.minecraftforge.client.loading.ClientModLoader.lambda$onResourceReload$2(ClientModLoader.java:103)
\tat TRANSFORMER/forge@40.1.76/net.minecraftforge.client.loading.ClientModLoader.lambda$createRunnableWithCatch$4(ClientModLoader.java:112)
\tat java.base/java.util.concurrent.CompletableFuture$AsyncRun.run(CompletableFuture.java:1804)
\t... 6 more
Caused by: com.electronwill.nightconfig.core.io.ParsingException: Not enough data available
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.core@3.6.4/com.electronwill.nightconfig.core.io.ParsingException.notEnoughData(ParsingException.java:22)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.core@3.6.4/com.electronwill.nightconfig.core.io.ReaderInput.directReadChar(ReaderInput.java:36)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.core@3.6.4/com.electronwill.nightconfig.core.io.AbstractInput.readChar(AbstractInput.java:49)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.core@3.6.4/com.electronwill.nightconfig.core.io.AbstractInput.readCharsUntil(AbstractInput.java:123)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.toml@3.6.4/com.electronwill.nightconfig.toml.TableParser.parseKey(TableParser.java:166)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.toml@3.6.4/com.electronwill.nightconfig.toml.TableParser.parseDottedKey(TableParser.java:145)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.toml@3.6.4/com.electronwill.nightconfig.toml.TableParser.parseNormal(TableParser.java:55)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.toml@3.6.4/com.electronwill.nightconfig.toml.TomlParser.parse(TomlParser.java:44)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.toml@3.6.4/com.electronwill.nightconfig.toml.TomlParser.parse(TomlParser.java:37)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.core@3.6.4/com.electronwill.nightconfig.core.io.ConfigParser.parse(ConfigParser.java:113)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.core@3.6.4/com.electronwill.nightconfig.core.io.ConfigParser.parse(ConfigParser.java:219)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.core@3.6.4/com.electronwill.nightconfig.core.io.ConfigParser.parse(ConfigParser.java:202)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.core@3.6.4/com.electronwill.nightconfig.core.file.WriteSyncFileConfig.load(WriteSyncFileConfig.java:73)
\tat MC-BOOTSTRAP/com.electronwill.nightconfig.core@3.6.4/com.electronwill.nightconfig.core.file.AutosaveCommentedFileConfig.load(AutosaveCommentedFileConfig.java:85)
\tat LAYER PLUGIN/fmlcore@1.18.2-40.1.76/net.minecraftforge.fml.config.ConfigFileTypeHandler.lambda$reader$1(ConfigFileTypeHandler.java:43)
\t... 26 more


-- System Details --
Details:
\tMinecraft Version: 1.18.2
\tMinecraft Version ID: 1.18.2
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 17.0.1, Microsoft
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode), Microsoft
\tMemory: 5211173376 bytes (4969 MiB) / 6677331968 bytes (6368 MiB) up to 17112760320 bytes (16320 MiB)
\tCPUs: 12
\tProcessor Vendor: GenuineIntel
\tProcessor Name: Intel(R) Core(TM) i5-10400F CPU @ 2.90GHz
\tIdentifier: Intel64 Family 6 Model 165 Stepping 3
\tMicroarchitecture: unknown
\tFrequency (GHz): 2,90
\tNumber of physical packages: 1
\tNumber of physical CPUs: 6
\tNumber of logical CPUs: 12
\tGraphics card #0 name: AMD Radeon RX 5600 XT
\tGraphics card #0 vendor: Advanced Micro Devices, Inc. (0x1002)
\tGraphics card #0 VRAM (MB): 4095,00
\tGraphics card #0 deviceId: 0x731f
\tGraphics card #0 versionInfo: DriverVersion=30.0.21020.2
\tMemory slot #0 capacity (MB): 8192,00
\tMemory slot #0 clockSpeed (GHz): 2,40
\tMemory slot #0 type: DDR4
\tMemory slot #1 capacity (MB): 8192,00
\tMemory slot #1 clockSpeed (GHz): 2,40
\tMemory slot #1 type: DDR4
\tVirtual memory max (MB): 28584,80
\tVirtual memory used (MB): 17249,26
\tSwap memory total (MB): 12288,00
\tSwap memory used (MB): 50,32
\tJVM Flags: 9 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xss1M -Xmx16292M -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M
\tLaunched Version: ForgeOptiFine 1.18.2
\tBackend library: LWJGL version 3.2.2 SNAPSHOT
\tBackend API: AMD Radeon RX 5600 XT GL version 3.2.14800 Core Profile Forward-Compatible Context 22.Q2 30.0.21020.2, ATI Technologies Inc.
\tWindow size: 1920x1080
\tGL Caps: Using framebuffer using OpenGL 3.2
\tGL debug messages: 
\tUsing VBOs: Yes
\tIs Modded: Definitely; Client brand changed to 'forge'
\tType: Client (map_client.txt)
\tGraphics mode: fancy
\tResource Packs: 
\tCurrent Language: English (US)
\tCPU: 12x Intel(R) Core(TM) i5-10400F CPU @ 2.90GHz
\tClient Crashes Since Restart: 1
\tIntegrated Server Crashes Since Restart: 0
\tOptiFine Version: OptiFine_1.18.2_HD_U_H9_pre1
\tOptiFine Build: 20220823-161442
\tRender Distance Chunks: 6
\tMipmaps: 4
\tAnisotropic Filtering: 1
\tAntialiasing: 0
\tMultitexture: false
\tShaders: ComplementaryShaders_v4.5.zip
\tOpenGlVersion: 3.2.14800 Core Profile Forward-Compatible Context 22.Q2 30.0.21020.2
\tOpenGlRenderer: AMD Radeon RX 5600 XT
\tOpenGlVendor: ATI Technologies Inc.
\tCpuCount: 12
\tModLauncher: 9.1.3+9.1.3+main.9b69c82a
\tModLauncher launch target: forgeclient
\tModLauncher naming: srg
\tModLauncher services: 
\t\t mixin PLUGINSERVICE 
\t\t eventbus PLUGINSERVICE 
\t\t slf4jfixer PLUGINSERVICE 
\t\t object_holder_definalize PLUGINSERVICE 
\t\t runtime_enum_extender PLUGINSERVICE 
\t\t capability_token_subclass PLUGINSERVICE 
\t\t accesstransformer PLUGINSERVICE 
\t\t runtimedistcleaner PLUGINSERVICE 
\t\t mixin TRANSFORMATIONSERVICE 
\t\t OptiFine TRANSFORMATIONSERVICE 
\t\t fml TRANSFORMATIONSERVICE 
\tFML Language Providers: 
\t\tminecraft@1.0
\t\tlowcodefml@null
\t\tjavafml@null
\t\tkotlinforforge@3.3.2
\tMod List: 
\t\tTreeChop-1.18.2-forge-0.16.3.jar                  |HT's TreeChop                 |treechop                      |0.16.3              |COMMON_SET|Manifest: NOSIGNATURE
\t\tinventorysorter-1.18.2-19.0.4.jar                 |Simple Inventory Sorter       |inventorysorter               |19.0.4              |COMMON_SET|Manifest: NOSIGNATURE
\t\tnotenoughcrashes-4.1.4+1.18.2-forge.jar           |Not Enough Crashes            |notenoughcrashes              |4.1.4+1.18.2        |COMMON_SET|Manifest: NOSIGNATURE
\t\tpreciseblockplacing-1.1.0+1.18.2-forge.jar        |PreciseBlockPlacing           |preciseblockplacing           |1.1.0               |COMMON_SET|Manifest: NOSIGNATURE
\t\tjei-1.18.2-forge-10.2.1.283.jar                   |Just Enough Items             |jei                           |10.2.1.283          |COMMON_SET|Manifest: NOSIGNATURE
\t\tVisualWorkbench-v3.3.0-1.18.2-Forge.jar           |Visual Workbench              |visualworkbench               |3.3.0               |COMMON_SET|Manifest: 9a:09:85:98:65:c4:8c:11:c5:49:f6:d6:33:23:39:df:8d:b4:ff:92:84:b8:bd:a5:83:9f:ac:7f:2a:d1:4b:6a
\t\tlibraryferret-forge-1.18.2-3.0.0.jar              |Library ferret                |libraryferret                 |3.0.0               |COMMON_SET|Manifest: NOSIGNATURE
\t\tIncendium_v5.0.4.jar                              |Incendium                     |incendium                     |0.0NONE             |COMMON_SET|Manifest: NOSIGNATURE
\t\tsophisticatedcore-1.18.2-0.5.15.141.jar           |Sophisticated Core            |sophisticatedcore             |1.18.2-0.5.15.141   |COMMON_SET|Manifest: NOSIGNATURE
\t\tInvMove-1.18-0.8.1-Forge.jar                      |InvMove                       |invmove                       |0.8.1               |COMMON_SET|Manifest: NOSIGNATURE
\t\tFallingleaves-1.18.2-1.3.2.jar                    |Falling Leaves                |fallingleaves                 |1.3.2               |COMMON_SET|Manifest: NOSIGNATURE
\t\tEpicFight-18.3.7.jar                              |Epic Fight                    |epicfight                     |18.3.7              |COMMON_SET|Manifest: NOSIGNATURE
\t\tEnhancedVisuals_FORGE_v1.5.5_mc1.18.2.jar         |EnhancedVisuals               |enhancedvisuals               |1.5.5               |COMMON_SET|Manifest: NOSIGNATURE
\t\tcitadel-1.11.1-1.18.2.jar                         |Citadel                       |citadel                       |1.11.1              |COMMON_SET|Manifest: NOSIGNATURE
\t\talexsmobs-1.18.6.jar                              |Alex's Mobs                   |alexsmobs                     |1.18.6              |COMMON_SET|Manifest: NOSIGNATURE
\t\tSereneSeasons-1.18.2-7.0.0.15.jar                 |Serene Seasons                |sereneseasons                 |0.0NONE             |COMMON_SET|Manifest: NOSIGNATURE
\t\tYungsApi-1.18.2-Forge-2.0.7.jar                   |YUNG's API                    |yungsapi                      |1.18.2-Forge-2.0.7  |COMMON_SET|Manifest: NOSIGNATURE
\t\tBookshelf-Forge-1.18.2-13.0.6.jar                 |Bookshelf                     |bookshelf                     |13.0.6              |COMMON_SET|Manifest: eb:c4:b1:67:8b:f9:0c:db:dc:4f:01:b1:8e:61:64:39:4c:10:85:0b:a6:c4:c7:48:f0:fa:95:f2:cb:08:3a:e5
\t\tsophisticatedbackpacks-1.18.2-3.18.29.718.jar     |Sophisticated Backpacks       |sophisticatedbackpacks        |1.18.2-3.18.29.718  |COMMON_SET|Manifest: NOSIGNATURE
\t\tstarlight-1.0.2+forge.546ae87.jar                 |Starlight                     |starlight                     |1.0.2+forge.83663de |COMMON_SET|Manifest: NOSIGNATURE
\t\tnetherdepthsupgrade-1.2.1-1.18.2.jar              |Nether Depths Upgrade         |netherdepthsupgrade           |1.2.1-1.18.2        |COMMON_SET|Manifest: NOSIGNATURE
\t\tTerralith_v2.2.1a.jar                             |Terralith                     |terralith                     |0.0NONE             |COMMON_SET|Manifest: NOSIGNATURE
\t\tcloth-config-6.4.90-forge.jar                     |Cloth Config v4 API           |cloth_config                  |6.4.90              |COMMON_SET|Manifest: NOSIGNATURE
\t\tsoundphysics-forge-1.18.2-1.0.6.jar               |Sound Physics Remastered      |sound_physics_remastered      |1.18.2-1.0.6        |COMMON_SET|Manifest: NOSIGNATURE
\t\tforge-1.18.2-40.1.76-universal.jar                |Forge                         |forge                         |40.1.76             |COMMON_SET|Manifest: 84:ce:76:e8:45:35:e4:0e:63:86:df:47:59:80:0f:67:6c:c1:5f:6e:5f:4d:b3:54:47:1a:9f:7f:ed:5e:f2:90
\t\ttl_skin_cape_forge_1.18_1.18.2-1.25.jar           |TLSkinCape                    |tlskincape                    |1.25                |COMMON_SET|Manifest: 19:f5:ce:44:81:0c:e4:22:05:5e:73:c5:a8:cd:de:f3:c8:cf:a9:b3:01:70:40:a0:ee:2d:50:7a:1c:3d:1c:8a
\t\tclient-1.18.2-20220404.173914-srg.jar             |Minecraft                     |minecraft                     |1.18.2              |COMMON_SET|Manifest: a1:d4:5e:04:4f:d3:d6:e0:7b:37:97:cf:77:b0:de:ad:4a:47:ce:8c:96:49:5f:0a:cf:8c:ae:b2:6d:4b:8a:3f
\t\tmcw-bridges-2.0.5-mc1.18.2forge.jar               |Macaw's Bridges               |mcwbridges                    |2.0.5               |COMMON_SET|Manifest: NOSIGNATURE
\t\tFarmersDelight-1.18.2-1.1.2.jar                   |Farmer's Delight              |farmersdelight                |1.18.2-1.1.2        |COMMON_SET|Manifest: NOSIGNATURE
\t\tEnchantmentDescriptions-Forge-1.18.2-10.0.9.jar   |EnchantmentDescriptions       |enchdesc                      |10.0.9              |COMMON_SET|Manifest: eb:c4:b1:67:8b:f9:0c:db:dc:4f:01:b1:8e:61:64:39:4c:10:85:0b:a6:c4:c7:48:f0:fa:95:f2:cb:08:3a:e5
\t\tAmbientSounds_FORGE_v5.0.16_mc1.18.2.jar          |Ambient Sounds                |ambientsounds                 |5.0.16              |COMMON_SET|Manifest: NOSIGNATURE
\t\tfirstperson-forge-2.1.2-mc1.18.2.jar              |FirstPersonModel Mod          |firstpersonmod                |2.1.2-mc1.18.2      |COMMON_SET|Manifest: NOSIGNATURE
\t\tanother_furniture-forge-1.2.2-1.18.2.jar          |Another Furniture             |another_furniture             |1.2.2-1.18.2        |COMMON_SET|Manifest: NOSIGNATURE
\t\tCreativeCore_FORGE_v2.6.15_mc1.18.2.jar           |CreativeCore                  |creativecore                  |0.0NONE             |COMMON_SET|Manifest: NOSIGNATURE
\t\tinventorio-1.18-forge-1.7.4.jar                   |Inventorio                    |inventorio                    |1.7.4               |COMMON_SET|Manifest: NOSIGNATURE
\t\tweaponmaster-clientonly-forge-1.18.1-3.0.3.jar    |YDM's Weapon Master           |weaponmaster                  |3.0.3               |COMMON_SET|Manifest: NOSIGNATURE
\t\tdomum_ornamentum-1.18.2-1.0.50-ALPHA-universal.jar|Domum Ornamentum              |domum_ornamentum              |1.18.2-1.0.50-ALPHA |COMMON_SET|Manifest: NOSIGNATURE
\t\tNatural+Decoration+v.1.0.9.jar                    |Natural Decoration            |natural_decoration            |1.0.0               |COMMON_SET|Manifest: NOSIGNATURE
\t\tbetterfpsdist-1.18.2-1.5.jar                      |betterfpsdist mod             |betterfpsdist                 |1.18.2-1.5          |COMMON_SET|Manifest: NOSIGNATURE
\t\tgravestone-1.18.2-1.0.2.jar                       |Gravestone Mod                |gravestone                    |1.18.2-1.0.2        |COMMON_SET|Manifest: NOSIGNATURE
\t\tDiagonalFences-v3.1.0-1.18.2.jar                  |Diagonal Fences               |diagonalfences                |3.1.0               |COMMON_SET|Manifest: 9a:09:85:98:65:c4:8c:11:c5:49:f6:d6:33:23:39:df:8d:b4:ff:92:84:b8:bd:a5:83:9f:ac:7f:2a:d1:4b:6a
\t\tToughAsNails-1.18.2-7.0.0.73.jar                  |Tough As Nails                |toughasnails                  |0.0NONE             |COMMON_SET|Manifest: NOSIGNATURE
\t\tentityculling-forge-mc1.18-1.5.1.jar              |EntityCulling                 |entityculling                 |1.5.1               |COMMON_SET|Manifest: NOSIGNATURE
\t\tDoubleSlabs-1.18-5.0.0.jar                        |Double Slabs                  |doubleslabs                   |5.0.0               |COMMON_SET|Manifest: NOSIGNATURE
\t\tbettervillage-forge-1.18.2-2.0.0.jar              |Better village                |bettervillage                 |2.0.0               |COMMON_SET|Manifest: NOSIGNATURE
\t\tspells_and_shields-1.18.2-1.9.jar                 |Spells & Shields              |spells_and_shields            |1.18.2-1.9          |COMMON_SET|Manifest: NOSIGNATURE
\t\tarchitectury-4.10.86-forge.jar                    |Architectury                  |architectury                  |4.10.86             |COMMON_SET|Manifest: NOSIGNATURE
\t\tsimplyswords-1.30-1.18.2.jar                      |Simply Swords                 |simplyswords                  |1.30-1.18.2         |COMMON_SET|Manifest: NOSIGNATURE
\t\tappleskin-forge-mc1.18.2-2.4.1.jar                |AppleSkin                     |appleskin                     |2.4.1+mc1.18.2      |COMMON_SET|Manifest: NOSIGNATURE
\t\tferritecore-4.2.1-forge.jar                       |Ferrite Core                  |ferritecore                   |0.0NONE             |COMMON_SET|Manifest: 41:ce:50:66:d1:a0:05:ce:a1:0e:02:85:9b:46:64:e0:bf:2e:cf:60:30:9a:fe:0c:27:e0:63:66:9a:84:ce:8a
\t\tAI-Improvements-1.18.2-0.5.2.jar                  |AI-Improvements               |aiimprovements                |0.5.2               |COMMON_SET|Manifest: NOSIGNATURE
\t\tItemPhysic_v1.4.23_mc1.18.2.jar                   |ItemPhysic                    |itemphysic                    |1.6.0               |COMMON_SET|Manifest: NOSIGNATURE
\t\tPuzzlesLib-v3.3.2-1.18.2-Forge.jar                |Puzzles Lib                   |puzzleslib                    |3.3.2               |COMMON_SET|Manifest: 9a:09:85:98:65:c4:8c:11:c5:49:f6:d6:33:23:39:df:8d:b4:ff:92:84:b8:bd:a5:83:9f:ac:7f:2a:d1:4b:6a
\t\tBetterPvP_22.16.0_Forge_1.18.2.jar                |Better PVP Mod                |xaerobetterpvp                |22.16.0             |COMMON_SET|Manifest: NOSIGNATURE
\t\tYungsBetterMineshafts-1.18.2-Forge-2.2.jar        |YUNG's Better Mineshafts      |bettermineshafts              |1.18.2-Forge-2.2    |COMMON_SET|Manifest: NOSIGNATURE
\t\tgeckolib-forge-1.18-3.0.49.jar                    |GeckoLib                      |geckolib3                     |3.0.49              |COMMON_SET|Manifest: NOSIGNATURE
\t\tnaturalist-forge-1.1.1-1.18.2.jar                 |Naturalist                    |naturalist                    |1.1.1               |COMMON_SET|Manifest: NOSIGNATURE
\t\tbetter_respawn-1.18.2-1.0.0.jar                   |Better Respawn                |better_respawn                |1.18.2-1.0.0        |COMMON_SET|Manifest: NOSIGNATURE
\tCrash Report UUID: a8e077e7-678a-4404-bdb6-56e4c5d2b5d6
\tFML: 40.1
\tForge: net.minecraftforge:40.1.76
\tSuspected Mods: None`