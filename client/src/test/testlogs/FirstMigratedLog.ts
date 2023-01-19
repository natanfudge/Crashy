export const firstMigratedLog = `---- Minecraft Crash Report ----
// Daisy, daisy...

Time: 10/17/21, 9:40 PM
Description: Initializing game

java.lang.RuntimeException: Could not execute entrypoint stage 'client' due to errors, provided by 'barrenisles'!
\tat Not Enough Crashes deobfuscated stack trace.(1.17.1+build.61)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointUtils.invoke0(EntrypointUtils.java:50)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointUtils.invoke(EntrypointUtils.java:33)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointClient.start(EntrypointClient.java:34)
\tat fudge.notenoughcrashes.fabric.mixinhandlers.ModLoaders.fabricEntrypoints(ModLoaders.java:9)
\tat net.minecraft.client.MinecraftClient.redirect$bgi000$catchFabricInit(MinecraftClient:8054)
\tat net.minecraft.client.MinecraftClient.<init>(MinecraftClient:457)
\tat net.minecraft.client.main.Main.main(Main:179)
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.lang.reflect.Method.invoke(Method.java:567)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)
Caused by: java.lang.IncompatibleClassChangeError: class io.github.cottonmc.cotton.gui.client.CottonInventoryScreen overrides final method net.minecraft.class_465.method_25393()V
\tat java.lang.ClassLoader.defineClass1(Native Method)
\tat java.lang.ClassLoader.defineClass(ClassLoader.java:1010)
\tat java.security.SecureClassLoader.defineClass(SecureClassLoader.java:150)
\tat net.fabricmc.loader.launch.knot.KnotClassLoader.loadClass(KnotClassLoader.java:170)
\tat java.lang.ClassLoader.loadClass(ClassLoader.java:519)
\tat ca.thecorgi.barrenisles.utils.registry.GUIRegistry.registerClient(GUIRegistry.java:25)
\tat ca.thecorgi.barrenisles.BarrenIslesClient.onInitializeClient(BarrenIslesClient.java:13)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointUtils.invoke0(EntrypointUtils.java:47)
\t... 13 more


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Render thread
Stacktrace:
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointUtils.invoke0(EntrypointUtils.java:50)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointUtils.invoke(EntrypointUtils.java:33)
\tat net.fabricmc.loader.entrypoint.minecraft.hooks.EntrypointClient.start(EntrypointClient.java:34)
Mixins in Stacktrace: None found

-- Initialization --
Details:
Stacktrace:
\tat fudge.notenoughcrashes.mixinhandlers.EntryPointCatcher.handleEntryPointError(EntryPointCatcher.java:38)
\tat net.minecraft.class_310.redirect$bgi000$catchFabricInit(class_310.java:8056)
\tat net.minecraft.class_310.<init>(class_310.java:457)
\tat net.minecraft.client.main.Main.main(Main.java:179)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:567)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)
Mixins in Stacktrace:
\tnet.minecraft.class_310:
\t\tde.siphalor.mousewheelie.client.mixin.MixinMinecraftClient (mousewheelie.mixins.json)
\t\tsvenhjol.charm.mixin.callback.LoadWorldClientStartCallbackMixin (charm.mixins.json)
\t\tnet.diebuddies.mixins.cloth.MixinMinecraft (physicsmod.mixins.json)
\t\tnet.coderbot.iris.mixin.MixinMinecraftClient (mixins.iris.json)
\t\tfudge.notenoughcrashes.fabric.mixins.client.CatchInitMInecraftClientMixin (notenoughcrashes.fabric.mixins.json)
\t\tme.shedaniel.cloth.mixin.client.events.MixinMinecraftClient (cloth-client-events-v0.mixins.json)
\t\tme.flashyreese.mods.sodiumextra.mixin.features.gui.MinecraftClientAccessor (sodium-extra.mixins.json)
\t\tsvenhjol.charm.mixin.callback.ClientPlayerJoinCallbackMixin (charm.mixins.json)
\t\tru.betterend.mixin.client.MinecraftClientMixin (betterend.mixins.client.json)
\t\tnet.fabricmc.fabric.mixin.registry.sync.client.MixinMinecraftClient (fabric-registry-sync-v0.mixins.json)
\t\tru.bclib.mixin.client.MinecraftMixin (bclib.mixins.client.json)
\t\tca.thecorgi.barrenisles.mixins.client.StopExperimentalAdviceMixin (barrenisles.mixins.json)
\t\tpaulevs.betternether.mixin.client.MinecraftClientMixin (betternether.mixins.client.json)
\t\tnet.diebuddies.mixins.fabricapi.MixinMinecraft (physicsmod.mixins.json)
\t\tdev.architectury.mixin.fabric.client.MixinMinecraft (architectury.mixins.json)
\t\tdraylar.omegaconfig.mixin.ClientMixin (omega-config.mixins.json)
\t\tnet.fabricmc.fabric.mixin.networking.accessor.MinecraftClientAccessor (fabric-networking-api-v1.mixins.json)
\t\tdynamicfps.mixin.MinecraftClientMixin (dynamicfps.mixins.json)
\t\tfudge.notenoughcrashes.mixins.client.MixinMinecraftClient (notenoughcrashes.mixins.json)
\t\tnet.fabricmc.fabric.mixin.screen.MinecraftClientMixin (fabric-screen-api-v1.mixins.json)
\t\tdev.lambdaurora.lambdynlights.mixin.MinecraftClientMixin (lambdynlights.mixins.json)
\t\tio.github.kvverti.colormatic.mixin.network.MinecraftClientMixin (colormatic.mixins.json)
\t\tnet.fabricmc.fabric.mixin.command.client.MinecraftClientMixin (fabric-command-api-v1.mixins.json)
\t\tnet.fabricmc.fabric.mixin.event.interaction.MixinMinecraftClient (fabric-events-interaction-v0.mixins.json)
\t\tsvenhjol.charm.mixin.music_improvements.TryCustomMusicMixin (charm.mixins.json)
\t\tsvenhjol.charm.mixin.devenv.FixDevAuthSpamMixin (charm.mixins.json)
\t\txaero.common.mixin.MixinMinecraftClient (xaerominimap.mixins.json)
\t\tdev.lambdaurora.spruceui.mixin.MinecraftClientMixin (spruceui.mixins.json)
\t\tinteractic.mixin.MinecraftClientMixin (interactic.mixins.json)
\t\tnet.fabricmc.fabric.mixin.event.lifecycle.client.MinecraftClientMixin (fabric-lifecycle-events-v1.mixins.json)
\t\tme.ramidzkh.fabrishot.mixins.MinecraftClientMixin (mixins.fabrishot.json)
\t\tme.shedaniel.slightguimodifications.mixin.MixinMinecraft (slight-gui-modifications.mixins.json)
\t\tsvenhjol.charm.mixin.accessor.MinecraftAccessor (charm.mixins.json)
\t\txaero.map.mixin.MixinMinecraftClient (xaeroworldmap.mixins.json)
\t\tme.jellysquid.mods.sodium.mixin.core.MixinMinecraftClient (sodium.mixins.json)
\tnet.minecraft.client.main.Main:
\t\tfudge.notenoughcrashes.fabric.mixins.client.MixinMain (notenoughcrashes.fabric.mixins.json)
\t\tnet.diebuddies.mixins.MixinMain (physicsmod.mixins.json)
\t\tio.github.ultimateboomer.smoothboot.mixin.client.MainMixin (smoothboot.mixins.json)

-- System Details --
Details:
\tMinecraft Version: 1.17.1
\tMinecraft Version ID: 1.17.1
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 16.0.1, Microsoft
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode), Microsoft
\tMemory: 643192520 bytes (613 MiB) / 1308622848 bytes (1248 MiB) up to 2147483648 bytes (2048 MiB)
\tCPUs: 8
\tProcessor Vendor: GenuineIntel
\tProcessor Name: Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz
\tIdentifier: Intel64 Family 6 Model 142 Stepping 10
\tMicroarchitecture: Coffee Lake
\tFrequency (GHz): 1.80
\tNumber of physical packages: 1
\tNumber of physical CPUs: 4
\tNumber of logical CPUs: 8
\tGraphics card #0 name: Intel(R) UHD Graphics 620
\tGraphics card #0 vendor: Intel Corporation (0x8086)
\tGraphics card #0 VRAM (MB): 1024.00
\tGraphics card #0 deviceId: 0x5917
\tGraphics card #0 versionInfo: DriverVersion=23.20.16.4973
\tGraphics card #1 name: NVIDIA GeForce 940MX
\tGraphics card #1 vendor: NVIDIA (0x10de)
\tGraphics card #1 VRAM (MB): 2048.00
\tGraphics card #1 deviceId: 0x134d
\tGraphics card #1 versionInfo: DriverVersion=30.0.14.9613
\tMemory slot #0 capacity (MB): 8192.00
\tMemory slot #0 clockSpeed (GHz): 2.40
\tMemory slot #0 type: DDR4
\tVirtual memory max (MB): 17274.39
\tVirtual memory used (MB): 7883.29
\tSwap memory total (MB): 9216.00
\tSwap memory used (MB): 397.86
\tJVM Flags: 9 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xss1M -Xmx2G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M
\tFabric Mods: 
\t\tadvanced_runtime_resource_pack: Runtime Resource Pack 0.4.3
\t\tadvancementinfo: AdvancementInfo 1.17.1-fabric0.36.1-1.2.1
\t\tamecsapi: Amecs API 1.1.5+mc21w16a
\t\tanimal_feeding_trough: Animal Feeding Trough 1.0.2
\t\tantighost: AntiGhost 1.17.1-fabric0.36.1-1.1.4
\t\taqupdgrizzly: Grizzly Bear mob 1.17-1.2.0
\t\tarchitectury: Architectury 2.5.27
\t\tautoconfig1u: Auto Config v1 Updated 3.2.2
\t\tautopath: Automatic Path 1.4.4
\t\tawesomedungeon: Awesome Dungeon 1.1.0
\t\tawokenworld: Awoken World 1.2.0-beta
\t\tbackslot: BackSlot 1.2.1
\t\tbackslotaddon: BackSlot Addon 1.0.6
\t\tbarrenisles: Barren Isles 1.0.7
\t\tbclib: BCLib 0.3.1
\t\tbetterbeds: Better Beds 1.2.0
\t\tbetterdungeons: YUNG's Better Dungeons 1.17-1.0.2
\t\tbetterend: Better End 0.11.0-pre
\t\tbettermineshafts: YUNG's Better Mineshafts 1.17-1.0.1
\t\tbettermounthud: Better Mount HUD 1.1.2
\t\tbetternether: Better Nether 5.1.3
\t\tbetterstrongholds: YUNG's Better Strongholds 1.17-1.1.1
\t\tboatcontainer: BoatContainer 1.0.2
\t\tcaelus: Caelus API 0.0.16-1.17
\t\tcapes: Capes 1.2.1
\t\tcardinal-components-base: Cardinal Components API (base) 3.1.1
\t\tcardinal-components-entity: Cardinal Components API (entities) 3.1.1
\t\tcaves-and-cliffs-add-on-for-william-wythers-overhauled-overworld: Caves and Cliffs add-on for William Wythers Overhauled Overworld 1.4
\t\tcem: Custom Entity Models 0.6.2
\t\tcharm: Charm 3.3.2
\t\tcloth-api: Cloth API 2.0.54
\t\tcloth-basic-math: Cloth Basic Math 0.5.1
\t\tcloth-client-events-v0: Cloth Client Events v0 2.0.54
\t\tcloth-common-events-v1: Cloth Common Events v1 2.0.54
\t\tcloth-config2: Cloth Config v5 5.0.38
\t\tcloth-datagen-api-v1: Cloth Datagen v1 2.0.54
\t\tcloth-scissors-api-v1: Cloth Scissors API v1 2.0.54
\t\tcloth-utils-v1: Cloth Utils v1 2.0.54
\t\tcolormatic: Colormatic 2.2.10+mc.1.17.1
\t\tcolytra: Colytra 2.0.0-1.17
\t\tcom_electronwill_night-config_core: core 3.6.2
\t\tcom_electronwill_night-config_toml: toml 3.6.2
\t\tcom_moandjiezana_toml_toml4j: toml4j 0.7.2
\t\tcomforts: Comforts 0.0.7-1.17.1
\t\tcompleteconfig: CompleteConfig 1.1.0
\t\tcroptopia: Croptopia 1.6.3
\t\tcrowdin-translate: CrowdinTranslate 1.3+1.17
\t\tcullleaves: Cull Leaves 2.2.0
\t\tdungeons_arise: When Dungeons Arise 2.1.48-fabric
\t\tdynamic-surroundings: Dynamic-Surroundings 1.1
\t\tdynamicfps: Dynamic FPS 2.0.5
\t\teatinganimationid: Eating Animation 1.2
\t\tenchantmentdescriptions: Enchantment Descriptions 4.0.1
\t\tentityculling: EntityCulling-Fabric 1.3.3
\t\textshape: Extended Shapes 1.2.6-mc1.17+
\t\tfabric: Fabric API 0.40.1+1.17
\t\tfabric-api-base: Fabric API Base 0.3.0+a02b446313
\t\tfabric-api-lookup-api-v1: Fabric API Lookup API (v1) 1.3.0+cbda931818
\t\tfabric-biome-api-v1: Fabric Biome API (v1) 3.2.0+cbda931818
\t\tfabric-blockrenderlayer-v1: Fabric BlockRenderLayer Registration (v1) 1.1.5+a02b446318
\t\tfabric-command-api-v1: Fabric Command API (v1) 1.1.3+5ab9934c18
\t\tfabric-commands-v0: Fabric Commands (v0) 0.2.2+92519afa18
\t\tfabric-containers-v0: Fabric Containers (v0) 0.1.12+cbda931818
\t\tfabric-content-registries-v0: Fabric Content Registries (v0) 0.3.0+cbda931818
\t\tfabric-crash-report-info-v1: Fabric Crash Report Info (v1) 0.1.5+be9da31018
\t\tfabric-dimensions-v1: Fabric Dimensions API (v1) 2.0.11+6cefd57718
\t\tfabric-entity-events-v1: Fabric Entity Events (v1) 1.2.3+87cc6e4c18
\t\tfabric-events-interaction-v0: Fabric Events Interaction (v0) 0.4.10+fc40aa9d18
\t\tfabric-events-lifecycle-v0: Fabric Events Lifecycle (v0) 0.2.1+92519afa18
\t\tfabric-game-rule-api-v1: Fabric Game Rule API (v1) 1.0.7+cbda931818
\t\tfabric-item-api-v1: Fabric Item API (v1) 1.2.4+a02b4463d5
\t\tfabric-item-groups-v0: Fabric Item Groups (v0) 0.2.10+b7ab612118
\t\tfabric-key-binding-api-v1: Fabric Key Binding API (v1) 1.0.4+cbda931818
\t\tfabric-keybindings-v0: Fabric Key Bindings (v0) 0.2.2+36b77c3e18
\t\tfabric-language-kotlin: Fabric Language Kotlin 1.6.4+kotlin.1.5.30
\t\tfabric-lifecycle-events-v1: Fabric Lifecycle Events (v1) 1.4.4+a02b44633d
\t\tfabric-loot-tables-v1: Fabric Loot Tables (v1) 1.0.4+a02b446318
\t\tfabric-mining-levels-v0: Fabric Mining Levels (v0) 0.1.3+92519afa18
\t\tfabric-models-v0: Fabric Models (v0) 0.3.0+a02b446318
\t\tfabric-networking-api-v1: Fabric Networking API (v1) 1.0.13+cbda931818
\t\tfabric-networking-blockentity-v0: Fabric Networking Block Entity (v0) 0.2.11+a02b446318
\t\tfabric-networking-v0: Fabric Networking (v0) 0.3.2+92519afad5
\t\tfabric-object-builder-api-v1: Fabric Object Builder API (v1) 1.10.9+b7ab6121d5
\t\tfabric-object-builders-v0: Fabric Object Builders (v0) 0.7.3+a02b446318
\t\tfabric-particles-v1: Fabric Particles (v1) 0.2.4+a02b446318
\t\tfabric-permissions-api-v0: fabric-permissions-api 0.1-SNAPSHOT
\t\tfabric-registry-sync-v0: Fabric Registry Sync (v0) 0.7.10+e2961fee18
\t\tfabric-renderer-api-v1: Fabric Renderer API (v1) 0.4.4+cbda931818
\t\tfabric-renderer-indigo: Fabric Renderer - Indigo 0.4.8+cbda931818
\t\tfabric-renderer-registries-v1: Fabric Renderer Registries (v1) 3.2.3+4658223018
\t\tfabric-rendering-data-attachment-v1: Fabric Rendering Data Attachment (v1) 0.1.5+a02b446313
\t\tfabric-rendering-fluids-v1: Fabric Rendering Fluids (v1) 0.1.14+4658223018
\t\tfabric-rendering-v0: Fabric Rendering (v0) 1.1.4+4658223018
\t\tfabric-rendering-v1: Fabric Rendering (v1) 1.8.2+ffb6d41e18
\t\tfabric-resource-loader-v0: Fabric Resource Loader (v0) 0.4.8+a00e834b18
\t\tfabric-screen-api-v1: Fabric Screen API (v1) 1.0.4+198a96213d
\t\tfabric-screen-handler-api-v1: Fabric Screen Handler API (v1) 1.1.8+cbda931818
\t\tfabric-structure-api-v1: Fabric Structure API (v1) 1.1.13+5ab9934c18
\t\tfabric-tag-extensions-v0: Fabric Tag Extensions (v0) 1.2.1+b06cb95b18
\t\tfabric-textures-v0: Fabric Textures (v0) 1.0.6+a02b446318
\t\tfabric-tool-attribute-api-v1: Fabric Tool Attribute API (v1) 1.2.12+b7ab6121d5
\t\tfabric-transfer-api-v1: Fabric Transfer API (v1) 1.3.1+4658223018
\t\tfabricloader: Fabric Loader 0.11.7
\t\tfabrishot: Fabrishot 1.5.1
\t\tfantasy: Fantasy 0.4.2+1.17
\t\tfastchest: FastChest 1.2+1.17
\t\tgeckolib3: Geckolib 3.0.14
\t\tgraveyard: The Graveyard 1.0
\t\tguild: Guild 0.3.3
\t\therdspanic: Herds Panic 1.0.3
\t\thologram-api: Hologram API 0.2.1+1.17.1
\t\thookshot: Hookshot 20.0
\t\thydrogen: Hydrogen 0.3
\t\tincantationem: Incantationem 1.1.2+1.17.1
\t\tindium: Indium 1.0.0+mc1.17.1
\t\tinmis: Inmis 2.3.2-1.17.1
\t\tinteractic: Interactic 0.1.5-1.17
\t\tiris: Iris 1.1.2+build.9
\t\titemmodelfix: Item Model Fix 1.0.2+1.17
\t\tjankson: Jankson 3.0.1+j1.2.0
\t\tjava: OpenJDK 64-Bit Server VM 16
\t\tlakeside: Lakeside 1.1.0+1.17
\t\tlambdabettergrass: LambdaBetterGrass 1.2.1+1.17
\t\tlambdynlights: LambDynamicLights 2.0.2+1.17
\t\tlazydfu: LazyDFU 0.1.2
\t\tletsleepingdogslie: Let Sleeping Dogs Lie - Fabric (Unofficial) 1.0.0
\t\tlibgui: LibGui 4.1.0+1.17
\t\tlibninepatch: LibNinePatch 1.1.0
\t\tlithium: Lithium 0.7.4
\t\tmidnightlib: MidnightLib 0.2.5
\t\tminecraft: Minecraft 1.17.1
\t\tmixintrace: MixinTrace 1.1.0+1.17
\t\tmm: Manningham Mills 2.1
\t\tmodmenu: Mod Menu 2.0.13
\t\tmorevillagers-fabric: MoreVillagersFabric 2.1.0-SNAPSHOT
\t\tmostructures: Mo' Structures 1.3.0-pre1-1.17.1
\t\tmousewheelie: Mouse Wheelie 1.7.3+mc1.17.1-pre1
\t\tmultiworld: Multiworld-Fabric 1.1
\t\tmythic-mounts: Mythic Mounts 1.17.1-1.3
\t\tnofade: No Fade 1.17-2.0.0
\t\tnotenoughcrashes: Not Enough Crashes 3.7.0+1.17.1
\t\tomega-config: OmegaConfig 1.0.8
\t\topenloader: OpenLoader 3.0.1
\t\torg_aperlambda_lambdajcommon: lambdajcommon 1.8.1
\t\torg_codehaus_groovy_groovy: groovy 3.0.8
\t\torg_codehaus_groovy_groovy-jsr223: groovy-jsr223 3.0.8
\t\torg_jetbrains_kotlin_kotlin-reflect: kotlin-reflect 1.5.30
\t\torg_jetbrains_kotlin_kotlin-stdlib: kotlin-stdlib 1.5.30
\t\torg_jetbrains_kotlin_kotlin-stdlib-jdk7: kotlin-stdlib-jdk7 1.5.30
\t\torg_jetbrains_kotlin_kotlin-stdlib-jdk8: kotlin-stdlib-jdk8 1.5.30
\t\torg_jetbrains_kotlinx_kotlinx-coroutines-core-jvm: kotlinx-coroutines-core-jvm 1.5.1
\t\torg_jetbrains_kotlinx_kotlinx-coroutines-jdk8: kotlinx-coroutines-jdk8 1.5.1
\t\torg_jetbrains_kotlinx_kotlinx-serialization-core-jvm: kotlinx-serialization-core-jvm 1.2.2
\t\torg_jetbrains_kotlinx_kotlinx-serialization-json-jvm: kotlinx-serialization-json-jvm 1.2.2
\t\toystersreborn: Oysters Reborn 1.0.0
\t\tpacket_tweaker: Packet Tweaker 0.2.0+1.17.1
\t\tphysicsmod: Physics Mod 2.5.15
\t\tplaceholder-api: Placeholder API 1.1.1+1.17.1
\t\tpolymer: Polymer 0.1.2+1.17.1
\t\treeses-sodium-options: Reese's Sodium Options 1.2.0
\t\trepurposed_structures: Repurposed Structures 2.3.4+1.17.1
\t\trespawnablepets: Respawnable Pets 1.17-3
\t\trocks: This Rocks! 1.5.0
\t\tserver_translations_api: Server Translations API 1.4.5+1.17
\t\tsgui: SGui 1.0.0-rc4+1.17.1
\t\tskinlayers: 3d Skin Layers 1.1.1
\t\tslight-gui-modifications: 'Slight' GUI Modifications 2.0.1
\t\tsmoothboot: Smooth Boot 1.16.5-1.6.0
\t\tsodium: Sodium 0.3.2+IRIS2-build.9
\t\tsodium-extra: Sodium Extra 0.3.4
\t\tsomnus: Somnus API 0.0.13-1.17.1
\t\tspruceui: SpruceUI 3.3.0+1.17
\t\tstoneholm: Stoneholm 1.3
\t\tstonevaults: Stonevaults 1.1.0
\t\ttweed: Tweed 3.0.0-beta.26
\t\tuniversal-graves: Universal Graves 1.1.0+1.17.1
\t\tvalley: ValleyCraft 1.3.2
\t\tvillagernames: Villager Names 2.0.0
\t\twi_zoom: WI Zoom 1.3-MC1.17.1
\t\twilliam-wythers-overhauled-overworld: William Wythers Overhauled Overworld 1.7
\t\txaerominimap: Xaero's Minimap 21.19.0
\t\txaeroworldmap: Xaero's World Map 1.17.3
\t\tyosbr: YOSBR 0.1.1
\t\tyungsapi: YUNG's API 1.17-Fabric-16
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
\tSuspected Mods: Barren Isles (barrenisles), Not Enough Crashes (notenoughcrashes)`