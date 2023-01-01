export const NecFabricCrash = `---- Minecraft Crash Report ----
// Hi. I'm Minecraft, and I'm a crashaholic.

Time: 20/08/2021, 7:41
Description: Unexpected error

org.spongepowered.asm.mixin.transformer.throwables.MixinTransformerError: An unexpected critical error was encountered
\tat Not Enough Crashes deobfuscated stack trace.(1.17+build.13)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:363)
\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClass(MixinTransformer.java:208)
\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClassBytes(MixinTransformer.java:178)
\tat org.spongepowered.asm.mixin.transformer.FabricMixinTransformerProxy.transformClassBytes(FabricMixinTransformerProxy.java:23)
\tat net.fabricmc.loader.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:162)
\tat net.fabricmc.loader.launch.knot.KnotClassLoader.loadClass(KnotClassLoader.java:154)
\tat java.lang.ClassLoader.loadClass(ClassLoader.java:519)
\tat net.minecraft.client.render.GameRenderer.updateWorldIcon(GameRenderer:1339)
\tat net.minecraft.client.render.GameRenderer.render(GameRenderer:1158)
\tat net.minecraft.client.MinecraftClient.render(MinecraftClient:1114)
\tat net.minecraft.client.MinecraftClient.run(MinecraftClient:730)
\tat net.minecraft.client.main.Main.main(Main:217)
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.lang.reflect.Method.invoke(Method.java:567)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.lang.reflect.Method.invoke(Method.java:567)
\tat org.multimc.onesix.OneSixLauncher.launchWithMainClass(OneSixLauncher.java:196)
\tat org.multimc.onesix.OneSixLauncher.launch(OneSixLauncher.java:231)
\tat org.multimc.EntryPoint.listen(EntryPoint.java:143)
\tat org.multimc.EntryPoint.main(EntryPoint.java:34)
Caused by: org.spongepowered.asm.mixin.throwables.MixinApplyError: Mixin [screenshotclipboard.mixins.json:ScreenshotMixin] from phase [DEFAULT] in config [screenshotclipboard.mixins.json] FAILED during APPLY
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.handleMixinError(MixinProcessor.java:642)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.handleMixinApplyError(MixinProcessor.java:594)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:356)
\t... 26 more
Caused by: org.spongepowered.asm.mixin.injection.throwables.InvalidInjectionException: Invalid descriptor on screenshotclipboard.mixins.json:ScreenshotMixin->@Inject::screenshotCaptured(Lnet/minecraft/class_1011;Ljava/io/File;Ljava/util/function/Consumer;Lorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V! Expected (Lnet/minecraft/class_1011;Ljava/io/File;Ljava/lang/Object;Ljava/util/function/Consumer;Lorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V but found (Lnet/minecraft/class_1011;Ljava/io/File;Ljava/util/function/Consumer;Lorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V [INJECT Applicator Phase -> screenshotclipboard.mixins.json:ScreenshotMixin -> Apply Injections ->  -> Inject -> screenshotclipboard.mixins.json:ScreenshotMixin->@Inject::screenshotCaptured(Lnet/minecraft/class_1011;Ljava/io/File;Ljava/util/function/Consumer;Lorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V]
\tat Not Enough Crashes deobfuscated stack trace.(1.17+build.13)
\tat org.spongepowered.asm.mixin.injection.callback.CallbackInjector.inject(CallbackInjector.java:517)
\tat org.spongepowered.asm.mixin.injection.callback.CallbackInjector.inject(CallbackInjector.java:447)
\tat org.spongepowered.asm.mixin.injection.code.Injector.inject(Injector.java:264)
\tat org.spongepowered.asm.mixin.injection.struct.InjectionInfo.inject(InjectionInfo.java:385)
\tat org.spongepowered.asm.mixin.transformer.MixinTargetContext.applyInjections(MixinTargetContext.java:1284)
\tat org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.applyInjections(MixinApplicatorStandard.java:1042)
\tat org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.applyMixin(MixinApplicatorStandard.java:395)
\tat org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.apply(MixinApplicatorStandard.java:320)
\tat org.spongepowered.asm.mixin.transformer.TargetClassContext.applyMixins(TargetClassContext.java:345)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:569)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:351)
\t... 26 more


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Render thread
Stacktrace:
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:363)
\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClass(MixinTransformer.java:208)
\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClassBytes(MixinTransformer.java:178)
\tat org.spongepowered.asm.mixin.transformer.FabricMixinTransformerProxy.transformClassBytes(FabricMixinTransformerProxy.java:23)
\tat net.fabricmc.loader.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:162)
\tat net.fabricmc.loader.launch.knot.KnotClassLoader.loadClass(KnotClassLoader.java:154)

-- Affected level --
Details:
\tAll players: 1 total; [class_746['FudgeDestroyer'/456, l='ClientLevel', x=-37.50, y=69.00, z=232.50]]
\tChunk stats: 441, 289
\tLevel dimension: minecraft:overworld
\tLevel spawn location: World: (-32,71,224), Section: (at 0,7,0 in -2,4,14; chunk contains blocks -32,0,224 to -17,255,239), Region: (-1,0; contains chunks -32,0 to -1,31, blocks -512,0,0 to -1,255,511)
\tLevel time: 39 game time, 39 day time
\tServer brand: fabric
\tServer type: Integrated singleplayer server
Stacktrace:
\tat net.minecraft.class_638.method_8538(class_638.java:476)
\tat net.minecraft.class_310.method_1587(class_310.java:2399)
\tat fudge.notenoughcrashes.mixinhandlers.InGameCatcher.handleClientCrash(InGameCatcher.java:28)
\tat net.minecraft.class_310.modify$bbc000$onCrash(class_310.java:11599)
\tat net.minecraft.class_310.method_1514(class_310.java:754)
\tat net.minecraft.client.main.Main.main(Main.java:217)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:567)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:567)
\tat org.multimc.onesix.OneSixLauncher.launchWithMainClass(OneSixLauncher.java:196)
\tat org.multimc.onesix.OneSixLauncher.launch(OneSixLauncher.java:231)
\tat org.multimc.EntryPoint.listen(EntryPoint.java:143)
\tat org.multimc.EntryPoint.main(EntryPoint.java:34)

-- Last reload --
Details:
\tReload number: 1
\tReload reason: initial
\tFinished: Yes
\tPacks: Default, Fabric Mods

-- System Details --
Details:
\tMinecraft Version: 1.17
\tMinecraft Version ID: 1.17
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 16.0.2, Oracle Corporation
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode, sharing), Oracle Corporation
\tMemory: 875362304 bytes (834 MiB) / 2059403264 bytes (1964 MiB) up to 6291456000 bytes (6000 MiB)
\tCPUs: 16
\tProcessor Vendor: AuthenticAMD
\tProcessor Name: AMD Ryzen 7 3700X 8-Core Processor
\tIdentifier: AuthenticAMD Family 23 Model 113 Stepping 0
\tMicroarchitecture: Zen 2
\tFrequency (GHz): 3.59
\tNumber of physical packages: 1
\tNumber of physical CPUs: 8
\tNumber of logical CPUs: 16
\tGraphics card #0 name: Radeon RX 580 Series
\tGraphics card #0 vendor: Advanced Micro Devices, Inc. (0x1002)
\tGraphics card #0 VRAM (MB): 4095.00
\tGraphics card #0 deviceId: 0x67df
\tGraphics card #0 versionInfo: DriverVersion=30.0.13001.3012
\tMemory slot #0 capacity (MB): 16384.00
\tMemory slot #0 clockSpeed (GHz): 2.67
\tMemory slot #0 type: DDR4
\tVirtual memory max (MB): 22990.71
\tVirtual memory used (MB): 13788.59
\tSwap memory total (MB): 6656.00
\tSwap memory used (MB): 23.89
\tJVM Flags: 3 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xms512m -Xmx6000m
\tFabric Mods:
\t\tarchitectury: Architectury 2.0.7
\t\taudiooutput: AudioOutput 0.0.4
\t\tautoreconnect: AutoReconnect 1.2.0
\t\tbendy-lib: Bendy api 2.0-SNAPSHOT11
\t\tbetterbeds: Better Beds 1.2.0
\t\tbetterdroppeditems: Better Dropped Items 1.3.0-1.17
\t\tbetterf3: BetterF3 1.1.4
\t\tbetterthirdperson: Better Third Person 1.5.0
\t\tblue_endless_jankson: jankson 1.2.1
\t\tbobby: Bobby 2.0.0
\t\tboostedbrightness: Boosted Brightness 2.1.0
\t\tcloth-api: Cloth API 2.0.54
\t\tcloth-basic-math: Cloth Basic Math 0.5.1
\t\tcloth-client-events-v0: Cloth Client Events v0 2.0.54
\t\tcloth-common-events-v1: Cloth Common Events v1 2.0.54
\t\tcloth-config2: Cloth Config v4 5.0.34
\t\tcloth-datagen-api-v1: Cloth Datagen v1 2.0.54
\t\tcloth-scissors-api-v1: Cloth Scissors API v1 2.0.54
\t\tcloth-utils-v1: Cloth Utils v1 2.0.54
\t\tcmdkeybind: Command Macros 1.5.2-1.17
\t\tcom_moandjiezana_toml_toml4j: toml4j 0.7.2
\t\tcom_neovisionaries_nv-websocket-client: nv-websocket-client 2.14
\t\tcom_typesafe_config: config 1.4.1
\t\tconfabricate: confabricate 2.1.0-SNAPSHOT+4.1.1
\t\tcraftpresence: CraftPresence 1.8.2
\t\tdamagetilt: Damage Tilt 1.17-fabric-0.1.2
\t\tde_javagl_obj: obj 0.3.0
\t\tdynamicfps: Dynamic FPS 2.0.3
\t\temotecraft: Emotecraft 2.0.5
\t\tentityculling: EntityCulling-Fabric 1.2.3
\t\tfabric: Fabric API 0.34.9+1.17
\t\tfabric-api-base: Fabric API Base 0.3.0+a02b4463d5
\t\tfabric-api-lookup-api-v1: Fabric API Lookup API (v1) 1.0.2+a02b4463d5
\t\tfabric-biome-api-v1: Fabric Biome API (v1) 3.1.11+9e521e13d5
\t\tfabric-blockrenderlayer-v1: Fabric BlockRenderLayer Registration (v1) 1.1.5+a02b4463d5
\t\tfabric-command-api-v1: Fabric Command API (v1) 1.1.1+a02b4463d5
\t\tfabric-commands-v0: Fabric Commands (v0) 0.2.2+92519afad5
\t\tfabric-containers-v0: Fabric Containers (v0) 0.1.12+a02b4463d5
\t\tfabric-content-registries-v0: Fabric Content Registries (v0) 0.2.2+a02b4463d5
\t\tfabric-crash-report-info-v1: Fabric Crash Report Info (v1) 0.1.5+be9da310d5
\t\tfabric-dimensions-v1: Fabric Dimensions API (v1) 2.0.10+a02b4463d5
\t\tfabric-entity-events-v1: Fabric Entity Events (v1) 1.1.0+a02b4463d5
\t\tfabric-events-interaction-v0: Fabric Events Interaction (v0) 0.4.8+a02b4463d5
\t\tfabric-events-lifecycle-v0: Fabric Events Lifecycle (v0) 0.2.1+92519afad5
\t\tfabric-game-rule-api-v1: Fabric Game Rule API (v1) 1.0.6+a02b4463d5
\t\tfabric-item-api-v1: Fabric Item API (v1) 1.2.4+a02b4463d5
\t\tfabric-item-groups-v0: Fabric Item Groups (v0) 0.2.10+b7ab6121d5
\t\tfabric-key-binding-api-v1: Fabric Key Binding API (v1) 1.0.4+a02b4463d5
\t\tfabric-keybindings-v0: Fabric Key Bindings (v0) 0.2.2+36b77c3ed5
\t\tfabric-lifecycle-events-v1: Fabric Lifecycle Events (v1) 1.4.4+a02b4463d5
\t\tfabric-loot-tables-v1: Fabric Loot Tables (v1) 1.0.4+a02b4463d5
\t\tfabric-mining-levels-v0: Fabric Mining Levels (v0) 0.1.3+92519afad5
\t\tfabric-models-v0: Fabric Models (v0) 0.3.0+a02b4463d5
\t\tfabric-networking-api-v1: Fabric Networking API (v1) 1.0.11+b7ab6121d5
\t\tfabric-networking-blockentity-v0: Fabric Networking Block Entity (v0) 0.2.11+a02b4463d5
\t\tfabric-networking-v0: Fabric Networking (v0) 0.3.2+92519afad5
\t\tfabric-object-builder-api-v1: Fabric Object Builder API (v1) 1.10.9+b7ab6121d5
\t\tfabric-object-builders-v0: Fabric Object Builders (v0) 0.7.3+a02b4463d5
\t\tfabric-particles-v1: Fabric Particles (v1) 0.2.4+a02b4463d5
\t\tfabric-permissions-api-v0: fabric-permissions-api 0.1-SNAPSHOT
\t\tfabric-registry-sync-v0: Fabric Registry Sync (v0) 0.7.9+a02b4463d5
\t\tfabric-renderer-api-v1: Fabric Renderer API (v1) 0.4.2+a02b4463d5
\t\tfabric-renderer-indigo: Fabric Renderer - Indigo 0.4.8+a02b4463d5
\t\tfabric-renderer-registries-v1: Fabric Renderer Registries (v1) 3.2.0+a02b4463d5
\t\tfabric-rendering-data-attachment-v1: Fabric Rendering Data Attachment (v1) 0.1.5+a02b4463d5
\t\tfabric-rendering-fluids-v1: Fabric Rendering Fluids (v1) 0.1.13+a02b4463d5
\t\tfabric-rendering-v0: Fabric Rendering (v0) 1.1.2+92519afad5
\t\tfabric-rendering-v1: Fabric Rendering (v1) 1.6.0+a02b4463d5
\t\tfabric-resource-loader-v0: Fabric Resource Loader (v0) 0.4.7+b7ab6121a0
\t\tfabric-screen-api-v1: Fabric Screen API (v1) 1.0.3+b7ab6121d5
\t\tfabric-screen-handler-api-v1: Fabric Screen Handler API (v1) 1.1.8+a02b4463d5
\t\tfabric-structure-api-v1: Fabric Structure API (v1) 1.1.10+be9da310d5
\t\tfabric-tag-extensions-v0: Fabric Tag Extensions (v0) 1.1.4+a02b4463d5
\t\tfabric-textures-v0: Fabric Textures (v0) 1.0.6+a02b4463d5
\t\tfabric-tool-attribute-api-v1: Fabric Tool Attribute API (v1) 1.2.12+b7ab6121d5
\t\tfabricloader: Fabric Loader 0.11.6
\t\tfabrishot: Fabrishot 1.5.0
\t\tferritecore: FerriteCore 3.0.0
\t\tfiber: fiber 0.23.0-2
\t\tfigura: Figura 0.0.5e-[1.17]
\t\tio_leangen_geantyref_geantyref: geantyref 1.3.11
\t\tjava: OpenJDK 64-Bit Server VM 16
\t\tkirin: Kirin UI 1.8.7-1.17
\t\tkyrptconfig: Kytpt Config 1.1.10-1.17
\t\tlazydfu: LazyDFU 0.1.2
\t\tlibzoomer: LibZoomer 0.2.1+1.17
\t\tmalilib: MaLiLib 0.10.0+dev.22
\t\tminecraft: Minecraft 1.17
\t\tmm: Manningham Mills 2.2
\t\tmodmenu: Mod Menu 2.0.0-beta.7
\t\tmulticonnect: MultiConnect 1.4.2
\t\tmulticonnect-api: MultiConnect API 1.4.2
\t\tnamepain: Name Pain 1.4.0
\t\tnotenoughanimations: NotEnoughAnimations 1.3.0
\t\tnotenoughcrashes: Not Enough Crashes 3.3.0+1.17
\t\tnumericping: Numeric Ping 1.0.0
\t\tokzoomer: Ok Zoomer 5.0.0-beta.2+1.17
\t\toptifabric: OptiFabric 1.11.9
\t\torg_aperlambda_lambdajcommon: lambdajcommon 1.8.1
\t\torg_luaj_luaj-jse: luaj-jse 3.0.1
\t\torg_spongepowered_configurate-core: configurate-core 4.1.1
\t\torg_spongepowered_configurate-extra-dfu4: configurate-extra-dfu4 4.1.1
\t\torg_spongepowered_configurate-gson: configurate-gson 4.1.1
\t\torg_spongepowered_configurate-hocon: configurate-hocon 4.1.1
\t\tperformacraft: Performacraft Manager 1.0.0
\t\tpresencefootsteps: Presence Footsteps r31-1.17-rc1
\t\trespackopts: Resource Pack Options 2.0.0
\t\tscreenshotclipboard: Screenshot to Clipboard 1.0.6
\t\tseamless_loading_screen: Seamless Loading Screen 1.3.5+1.17
\t\tsmoothboot: Smooth Boot 1.16.5-1.6.0
\t\tspark: spark \${pluginVersion}
\t\tspruceui: SpruceUI 3.2.0+1.17
\t\tstarlight: Starlight fabric-1.0.0-RC2-3a77ed1
\t\tthatorthis: ThatOrThis 0.2.3+1.17
\t\ttooltipfix: ToolTip Fix 1.0.2-1.16
\t\ttransliterationlib: TRansliterationLib 1.1.0
\tLaunched Version: MultiMC5
\tBackend library: LWJGL version 3.2.2 build 10
\tBackend API: Radeon RX 580 Series GL version 3.2.14761 Compatibility Profile Context 21.30.01.03 30.0.13001.3012, ATI Technologies Inc.
\tWindow size: 854x480
\tGL Caps: Using framebuffer using OpenGL 3.2
\tGL debug messages:
\tUsing VBOs: Yes
\tIs Modded: Definitely; Client brand changed to 'fabric'
\tType: Integrated Server (map_client.txt)
\tGraphics mode: fancy
\tResource Packs: Fabric Mods
\tCurrent Language: English (US)
\tCPU: 16x AMD Ryzen 7 3700X 8-Core Processor
\tPlayer Count: 1 / 8; [class_3222['FudgeDestroyer'/456, l='ServerLevel[New World]', x=-37.50, y=69.00, z=232.50]]
\tData Packs: vanilla (incompatible), Fabric Mods
\tClient Crashes Since Restart: 1
\tIntegrated Server Crashes Since Restart: 0
\tOptiFine Version: OptiFine_1.17_HD_U_G9_pre21
\tOptiFine Build: 20210612-020007
\tRender Distance Chunks: 8
\tSuspected Mods: Seamless Loading Screen (seamless_loading_screen), TRansliterationLib (transliterationlib)
\tMipmaps: 4
\tAnisotropic Filtering: 1
\tAntialiasing: 0
\tMultitexture: false
\tShaders: null
\tOpenGlVersion: 3.2.14761 Compatibility Profile Context 21.30.01.03 30.0.13001.3012
\tOpenGlRenderer: Radeon RX 580 Series
\tOpenGlVendor: ATI Technologies Inc.
\tCpuCount: 16

-- OptiFabric --
Details:
\tOptiFine jar designed for: 1.17
\tOptiFine jar version: OptiFine_1.17_HD_U_G9_pre21
\tOptiFine jar status: Valid OptiFine installer
\tOptiFine remapped jar: C:/Users/natan/Desktop/MultiMC/instances/1.17 NEC error identifying test/.minecraft/.optifine/OptiFine_1.17_HD_U_G9_pre21/Optifine-mapped.jar
\tOptiFabric error: <None>
`