export const TestBadDate = `---- Minecraft Crash Report ----
// Why did you do that?

Time: 2021-12-24, 8:51 p.m.
Description: Exception in server tick loop

java.lang.RuntimeException: Mixin transformation of net.minecraft.class_3898 failed
\tat Not Enough Crashes deobfuscated stack trace.(1.17.1+build.63)
\tat net.fabricmc.loader.impl.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:252)
\tat net.fabricmc.loader.impl.launch.knot.KnotClassDelegate.tryLoadClass(KnotClassDelegate.java:150)
\tat net.fabricmc.loader.impl.launch.knot.KnotClassLoader.loadClass(KnotClassLoader.java:155)
\tat java.lang.ClassLoader.loadClass(ClassLoader.java:520)
\tat net.minecraft.server.world.ServerChunkManager.<init>(ServerChunkManager:89)
\tat net.minecraft.server.world.ServerWorld.<init>(ServerWorld:220)
\tat net.minecraft.server.MinecraftServer.createWorlds(MinecraftServer:371)
\tat net.minecraft.server.MinecraftServer.loadWorld(MinecraftServer:327)
\tat net.minecraft.server.integrated.IntegratedServer.setupServer(IntegratedServer:72)
\tat net.minecraft.server.MinecraftServer.runServer(MinecraftServer:657)
\tat net.minecraft.server.MinecraftServer.method_29739(MinecraftServer:270)
\tat java.lang.Thread.run(Thread.java:833)
Caused by: org.spongepowered.asm.mixin.transformer.throwables.MixinTransformerError: An unexpected critical error was encountered
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:392)
\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClass(MixinTransformer.java:234)
\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClassBytes(MixinTransformer.java:202)
\tat net.fabricmc.loader.impl.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:247)
\t... 11 more
Caused by: org.spongepowered.asm.mixin.throwables.MixinApplyError: Mixin [krypton.mixins.json:shared.network.flushconsolidation.ThreadedAnvilChunkStorageMixin] from phase [DEFAULT] in config [krypton.mixins.json] from mod [krypton] FAILED during APPLY
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.handleMixinError(MixinProcessor.java:638)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.handleMixinApplyError(MixinProcessor.java:589)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:379)
\t... 14 more
Caused by: org.spongepowered.asm.mixin.transformer.throwables.InvalidMixinException: @Shadow method method_37899 in krypton.mixins.json:shared.network.flushconsolidation.ThreadedAnvilChunkStorageMixin was not located in the target class net.minecraft.class_3898. Using refmap krypton-refmap.json
\tat Not Enough Crashes deobfuscated stack trace.(1.17.1+build.63)
\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.attachSpecialMethod(MixinPreProcessorStandard.java:436)
\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.attachShadowMethod(MixinPreProcessorStandard.java:412)
\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.attachMethods(MixinPreProcessorStandard.java:340)
\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.attach(MixinPreProcessorStandard.java:299)
\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.createContextFor(MixinPreProcessorStandard.java:277)
\tat org.spongepowered.asm.mixin.transformer.MixinInfo.createContextFor(MixinInfo.java:1289)
\tat org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.apply(MixinApplicatorStandard.java:292)
\tat org.spongepowered.asm.mixin.transformer.TargetClassContext.apply(TargetClassContext.java:421)
\tat org.spongepowered.asm.mixin.transformer.TargetClassContext.applyMixins(TargetClassContext.java:403)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:363)
\t... 14 more


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- System Details --
Details:
\tMinecraft Version: 1.18.1
\tMinecraft Version ID: 1.18.1
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 17.0.1, Eclipse Adoptium
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode, sharing), Eclipse Adoptium
\tMemory: 2919235584 bytes (2784 MiB) / 3795845120 bytes (3620 MiB) up to 6442450944 bytes (6144 MiB)
\tCPUs: 8
\tProcessor Vendor: GenuineIntel
\tProcessor Name: Intel(R) Core(TM) i7-4790K CPU @ 4.00GHz
\tIdentifier: Intel64 Family 6 Model 60 Stepping 3
\tMicroarchitecture: Haswell (Client)
\tFrequency (GHz): 4.00
\tNumber of physical packages: 1
\tNumber of physical CPUs: 4
\tNumber of logical CPUs: 8
\tGraphics card #0 name: NVIDIA GeForce GTX 970
\tGraphics card #0 vendor: NVIDIA (0x10de)
\tGraphics card #0 VRAM (MB): 4095.00
\tGraphics card #0 deviceId: 0x13c2
\tGraphics card #0 versionInfo: DriverVersion=27.21.14.5671
\tMemory slot #0 capacity (MB): 4096.00
\tMemory slot #0 clockSpeed (GHz): 1.87
\tMemory slot #0 type: DDR3
\tMemory slot #1 capacity (MB): 4096.00
\tMemory slot #1 clockSpeed (GHz): 1.87
\tMemory slot #1 type: DDR3
\tMemory slot #2 capacity (MB): 4096.00
\tMemory slot #2 clockSpeed (GHz): 1.87
\tMemory slot #2 type: DDR3
\tMemory slot #3 capacity (MB): 4096.00
\tMemory slot #3 clockSpeed (GHz): 1.87
\tMemory slot #3 type: DDR3
\tVirtual memory max (MB): 21702.51
\tVirtual memory used (MB): 10927.04
\tSwap memory total (MB): 5376.00
\tSwap memory used (MB): 0.00
\tJVM Flags: 4 total; -XX:+UseZGC -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xms512m -Xmx6144m
\tFabric Mods: 
\t\tadvanced_runtime_resource_pack: Runtime Resource Pack 0.5.4
\t\tae2: Applied Energistics 2 10.0.0-beta.1
\t\talternatecurrent: Alternate Current 1.1.0
\t\tantighost: AntiGhost 1.18-fabric0.43.1-1.1.4
\t\tappleskin: AppleSkin mc1.18-2.2.0
\t\tarchitectury: Architectury 3.2.47
\t\tbetterbeds: Better Beds 1.2.0
\t\tbetterdarkmode: Betterdarkmode 1.0.3-v20211219
\t\tbetterfpsdist: Better FPS distance Mod 1.18-1.3
\t\tblue_endless_jankson: jankson 1.2.1
\t\tc2me: Concurrent Chunk Management Engine 0.2.0+alpha.5.106
\t\tcan-i-mine-this-block: cAn i MiNe thIS bLOCk? 1.1.0
\t\tclearview: Lava Clear View 3.0.0
\t\tcloth-basic-math: cloth-basic-math 0.6.0
\t\tcloth-config: Cloth Config v6 6.0.45
\t\tclumps: Clumps 8.0.1
\t\tcollective-fabric: Collective (Fabric) 3.13
\t\tcom_github_wearblackallday_javautils: JavaUtils bd58640372
\t\tcom_velocitypowered_velocity-native: velocity-native 1.1.0-SNAPSHOT
\t\tcontinuity: Continuity 1.0.3+1.18
\t\tcontrolling: Controlling For Fabric 9.0.4
\t\tcrowdin-translate: CrowdinTranslate 1.4+1.18
\t\tcullleaves: Cull Leaves 2.3.2
\t\tdark-loading-screen: Dark Loading Screen 1.6.11
\t\tdependencyoverridegenerator: Dependency Override Generator 1.0.0+for-bugatti-specifically
\t\tdimthread: DimensionalThreading 1.2.6
\t\tdurabilityviewer: Giselbaers Durability Viewer 1.18-fabric0.43.1-1.10.2
\t\teasiercrafting: EasierCrafting 1.18-fabric0.43.1-1.7
\t\teasiervillagertrading: EasierVillagerTrading 1.18-fabric0.43.1-1.5.4
\t\telativitymc_c2me-fabric_ver_1_18_libs_: libs 0.2.0+alpha.5.106
\t\tenhancedblockentities: Enhanced Block Entities 0.5+1.18
\t\tentityculling: EntityCulling-Fabric 1.3.3
\t\tfabric: Fabric API 0.44.0+1.18
\t\tfabric-api-base: Fabric API Base 0.4.1+b4f4f6cdc8
\t\tfabric-api-lookup-api-v1: Fabric API Lookup API (v1) 1.4.0+16d92c47c8
\t\tfabric-biome-api-v1: Fabric Biome API (v1) 6.0.1+ded849a9c8
\t\tfabric-blockrenderlayer-v1: Fabric BlockRenderLayer Registration (v1) 1.1.9+3ac43d95c8
\t\tfabric-command-api-v1: Fabric Command API (v1) 1.1.6+3ac43d95c8
\t\tfabric-commands-v0: Fabric Commands (v0) 0.2.5+b4f4f6cdc8
\t\tfabric-containers-v0: Fabric Containers (v0) 0.1.18+d154e2c6c8
\t\tfabric-content-registries-v0: Fabric Content Registries (v0) 0.4.5+6f53a73dc8
\t\tfabric-crash-report-info-v1: Fabric Crash Report Info (v1) 0.1.8+3ac43d95c8
\t\tfabric-dimensions-v1: Fabric Dimensions API (v1) 2.1.7+43d29571c8
\t\tfabric-entity-events-v1: Fabric Entity Events (v1) 1.4.5+6b21378ac8
\t\tfabric-events-interaction-v0: Fabric Events Interaction (v0) 0.4.16+bfa23f17c8
\t\tfabric-events-lifecycle-v0: Fabric Events Lifecycle (v0) 0.2.6+b4f4f6cdc8
\t\tfabric-game-rule-api-v1: Fabric Game Rule API (v1) 1.0.10+3ac43d95c8
\t\tfabric-item-api-v1: Fabric Item API (v1) 1.3.0+691a79b5c8
\t\tfabric-item-groups-v0: Fabric Item Groups (v0) 0.3.3+3ac43d95c8
\t\tfabric-key-binding-api-v1: Fabric Key Binding API (v1) 1.0.8+c8aba2f3c8
\t\tfabric-keybindings-v0: Fabric Key Bindings (v0) 0.2.6+b4f4f6cdc8
\t\tfabric-lifecycle-events-v1: Fabric Lifecycle Events (v1) 1.4.10+c15ca335c8
\t\tfabric-loot-tables-v1: Fabric Loot Tables (v1) 1.0.8+3ac43d95c8
\t\tfabric-mining-level-api-v1: Fabric Mining Level API (v1) 1.0.3+3ac43d95c8
\t\tfabric-mining-levels-v0: Fabric Mining Levels (v0) 0.1.7+b4f4f6cdc8
\t\tfabric-models-v0: Fabric Models (v0) 0.3.3+3ac43d95c8
\t\tfabric-networking-api-v1: Fabric Networking API (v1) 1.0.18+3ac43d95c8
\t\tfabric-networking-v0: Fabric Networking (v0) 0.3.5+b4f4f6cdc8
\t\tfabric-object-builder-api-v1: Fabric Object Builder API (v1) 1.11.0+3b82842ec8
\t\tfabric-object-builders-v0: Fabric Object Builders (v0) 0.7.8+3ac43d95c8
\t\tfabric-particles-v1: Fabric Particles (v1) 0.2.9+526dc1acc8
\t\tfabric-registry-sync-v0: Fabric Registry Sync (v0) 0.8.5+3ac43d95c8
\t\tfabric-renderer-api-v1: Fabric Renderer API (v1) 0.4.9+3ac43d95c8
\t\tfabric-renderer-indigo: Fabric Renderer - Indigo 0.4.12+3ac43d95c8
\t\tfabric-renderer-registries-v1: Fabric Renderer Registries (v1) 3.2.7+b4f4f6cdc8
\t\tfabric-rendering-data-attachment-v1: Fabric Rendering Data Attachment (v1) 0.3.4+7242e9d7c8
\t\tfabric-rendering-fluids-v1: Fabric Rendering Fluids (v1) 0.1.18+3ac43d95c8
\t\tfabric-rendering-v0: Fabric Rendering (v0) 1.1.9+b4f4f6cdc8
\t\tfabric-rendering-v1: Fabric Rendering (v1) 1.10.3+6b21378ac8
\t\tfabric-resource-loader-v0: Fabric Resource Loader (v0) 0.4.11+3ac43d95c8
\t\tfabric-screen-api-v1: Fabric Screen API (v1) 1.0.7+3ac43d95c8
\t\tfabric-screen-handler-api-v1: Fabric Screen Handler API (v1) 1.1.11+3ac43d95c8
\t\tfabric-structure-api-v1: Fabric Structure API (v1) 2.0.8+295197a7c8
\t\tfabric-tag-extensions-v0: Fabric Tag Extensions (v0) 1.2.5+3ac43d95c8
\t\tfabric-textures-v0: Fabric Textures (v0) 1.0.9+3ac43d95c8
\t\tfabric-tool-attribute-api-v1: Fabric Tool Attribute API (v1) 1.3.4+7de09f55c8
\t\tfabric-transfer-api-v1: Fabric Transfer API (v1) 1.5.5+b4f4f6cdc8
\t\tfabricloader: Fabric Loader 0.12.12
\t\tferritecore: FerriteCore 4.0.0
\t\tfiber: fiber 0.23.0-2
\t\tgbfabrictools: GBfabrictools 1.3.4+1.18
\t\thorseinfo: Horse Info 0.4.0-1.18
\t\thorsestatsvanilla: Horse Stats Vanilla 4.1.10
\t\tindium: Indium 1.0.2-alpha1+mc1.18
\t\tinspecio: Inspecio 1.1.0+1.17
\t\tinventorysorter: Inventory Sorter 1.8.1-1.18
\t\tjankson: Jankson 4.0.0+j1.2.0
\t\tjava: OpenJDK 64-Bit Server VM 17
\t\tkrypton: Krypton 0.1.5
\t\tkyrptconfig: Kyrpt Config 1.2.5-1.18
\t\tlambdabettergrass: LambdaBetterGrass 1.2.1+1.17
\t\tlazy-language-loader: lazy-language-loader 0.2.6
\t\tlazydfu: LazyDFU 0.1.2
\t\tlibgui: LibGui 5.0.0-beta.2+1.18-rc1
\t\tlibninepatch: LibNinePatch 1.1.0
\t\tlithium: Lithium 0.7.6
\t\tmegane: megane 6.1.1
\t\tmegane-applied-energistics-2: megane-applied-energistics-2 6.1.1+10.0.0-alpha.1
\t\tmegane-base: megane-base 6.1.1
\t\tmegane-fabric-transfer: megane-fabric-transfer 6.1.1+1.5.4-b4f4f6cda9
\t\tmegane-runtime: megane-runtime 6.1.1
\t\tmegane-team-reborn-energy: megane-team-reborn-energy 6.1.1+2.0.0-beta1
\t\tmegane-vanilla: megane-vanilla 6.1.1+1.18
\t\tmidnightlib: MidnightLib 0.2.9
\t\tminecraft: Minecraft 1.18.1
\t\tmodmenu: Mod Menu 3.0.0
\t\tnotenoughcrashes: Not Enough Crashes 4.1.3+1.18
\t\tomegamute-fabric: Omega Mute (Fabric) 1.9
\t\torg_aperlambda_lambdajcommon: lambdajcommon 1.8.1
\t\torg_joml_joml: joml 1.10.2
\t\trecipecache: recipecache 0.2.1-1.17.1
\t\treeses-sodium-options: Reese's Sodium Options 1.2.3
\t\tsodium: Sodium 0.4.0-alpha5+build.9
\t\tsodium-extra: Sodium Extra 0.3.7
\t\tspruceui: SpruceUI 3.3.0+1.17
\t\tstarlight: Starlight 1.0.0+fabric.d0a3220
\t\tteam_reborn_energy: Energy 2.0.0-beta1
\t\twthit: wthit 4.3.1
\t\txaerominimap: Xaero's Minimap 21.22.6
\t\txaeroworldmap: Xaero's World Map 1.18.9
\tServer Running: true
\tPlayer Count: 0 / 8; []
\tData Packs: vanilla, Fabric Mods
\tType: Integrated Server (map_client.txt)
\tIs Modded: Definitely; Client brand changed to 'fabric'; Server brand changed to 'fabric'
\tClient Crashes Since Restart: 0
\tIntegrated Server Crashes Since Restart: 3
\tSuspected Mods: None`