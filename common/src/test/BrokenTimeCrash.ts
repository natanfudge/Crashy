export const BrokenTimeCrash = `---- Minecraft Crash Report ----
// There are four lights!

Time: 10/21/21, 7:57 PM
Description: Unexpected error

java.lang.NullPointerException: Cannot invoke "me.drex.antixray.util.ChunkPacketBlockController.onBlockChange(net.minecraft.class_1937, net.minecraft.class_2338, net.minecraft.class_2680, net.minecraft.class_2680)" because the return value of "net.minecraft.class_1937.getChunkPacketBlockController()" is null
\tat Not Enough Crashes deobfuscated stack trace.(1.17.1+build.62)
\tat net.minecraft.world.World.redirect$blp000$onBlockChanged(World:2101)
\tat net.minecraft.world.World.setBlockState(World:211)
\tat net.minecraft.world.World.setBlockState(World:196)
\tat net.minecraft.client.network.ClientPlayerInteractionManager.breakBlock(ClientPlayerInteractionManager:128)
\tat net.minecraft.client.network.ClientPlayerInteractionManager.attackBlock(ClientPlayerInteractionManager:155)
\tat net.minecraft.client.MinecraftClient.redirect$bni000$checkForEntity(MinecraftClient:12063)
\tat net.minecraft.client.MinecraftClient.doAttack(MinecraftClient:1590)
\tat net.minecraft.client.MinecraftClient.handleInputEvents(MinecraftClient:1897)
\tat net.minecraft.client.MinecraftClient.tick(MinecraftClient:1728)
\tat net.minecraft.client.MinecraftClient.render(MinecraftClient:1081)
\tat net.minecraft.client.MinecraftClient.run(MinecraftClient:728)
\tat net.minecraft.client.main.Main.main(Main:217)
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.lang.reflect.Method.invoke(Method.java:567)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Render thread
Stacktrace:
\tat net.minecraft.class_1937.redirect$blp000$onBlockChanged(class_1937.java:2101)
\tat net.minecraft.class_1937.method_30092(class_1937.java:211)
\tat net.minecraft.class_1937.method_8652(class_1937.java:196)
\tat net.minecraft.class_636.method_2899(class_636.java:128)
\tat net.minecraft.class_636.method_2910(class_636.java:155)
\tat net.minecraft.class_310.redirect$bni000$checkForEntity(class_310.java:12063)
\tat net.minecraft.class_310.method_1536(class_310.java:1590)
\tat net.minecraft.class_310.method_1508(class_310.java:1897)

-- Affected level --
Details:
\tAll players: 1 total; [class_746['Isaac'/462, l='ClientWorld minecraft:overworld', x=-317.23, y=67.41, z=3.66]]
\tChunk stats: Client Chunks (ImmPtl) 475
\tLevel dimension: minecraft:overworld
\tLevel spawn location: World: (16,64,21), Section: (at 0,0,5 in 1,4,1; chunk contains blocks 16,-64,16 to 31,319,31), Region: (0,0; contains chunks 0,0 to 31,31, blocks 0,-64,0 to 511,319,511)
\tLevel time: 25835 game time, 25835 day time
\tServer brand: fabric
\tServer type: Non-integrated multiplayer server
Stacktrace:
\tat net.minecraft.class_638.method_8538(class_638.java:370)
\tat net.minecraft.class_310.method_1587(class_310.java:2399)
\tat net.minecraft.class_310.method_1514(class_310.java:752)
\tat net.minecraft.client.main.Main.main(Main.java:217)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:78)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:567)
\tat net.fabricmc.loader.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:234)
\tat net.fabricmc.loader.launch.knot.Knot.launch(Knot.java:153)
\tat net.fabricmc.loader.launch.knot.KnotClient.main(KnotClient.java:28)

-- Last reload --
Details:
\tReload number: 1
\tReload reason: initial
\tFinished: Yes
\tPacks: Default, Fabric Mods, KubeJS Resource Pack [assets], moreberries/modifiedsweetberrybushmodel

-- System Details --
Details:
\tMinecraft Version: 1.17.1
\tMinecraft Version ID: 1.17.1
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 16.0.1, Microsoft
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode), Microsoft
\tMemory: 1576651752 bytes (1503 MiB) / 2852126720 bytes (2720 MiB) up to 5368709120 bytes (5120 MiB)
\tCPUs: 4
\tProcessor Vendor: GenuineIntel
\tProcessor Name: Intel(R) Core(TM) i3-8100 CPU @ 3.60GHz
\tIdentifier: Intel64 Family 6 Model 158 Stepping 11
\tMicroarchitecture: Coffee Lake
\tFrequency (GHz): 3.60
\tNumber of physical packages: 1
\tNumber of physical CPUs: 4
\tNumber of logical CPUs: 4
\tGraphics card #0 name: NVIDIA GeForce GTX 1050 Ti
\tGraphics card #0 vendor: NVIDIA (0x10de)
\tGraphics card #0 VRAM (MB): 4095.00
\tGraphics card #0 deviceId: 0x1c82
\tGraphics card #0 versionInfo: DriverVersion=27.21.14.5671
\tMemory slot #0 capacity (MB): 8192.00
\tMemory slot #0 clockSpeed (GHz): 2.40
\tMemory slot #0 type: DDR4
\tMemory slot #1 capacity (MB): 8192.00
\tMemory slot #1 clockSpeed (GHz): 2.40
\tMemory slot #1 type: DDR4
\tVirtual memory max (MB): 19258.22
\tVirtual memory used (MB): 16835.80
\tSwap memory total (MB): 2944.00
\tSwap memory used (MB): 122.25
\tJVM Flags: 11 total; -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M -XX:ConcGCThreads=1 -XX:ParallelGCThreads=4 -Xmx5120M -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xss1M
\tFabric Mods: 
\t\tadditionaladditions: Additional Additions 2.1.3
\t\tadditionalbars: Additional Bars 2.1.1
\t\tadvanced_runtime_resource_pack: Runtime Resource Pack 0.2.9
\t\tadvancementplaques: Advancement Plaques 1.4.1
\t\tadvancements-enlarger: Advancements Enlarger 0.2.4
\t\tadventure-platform-fabric: adventure-platform-fabric 4.1.0-SNAPSHOT
\t\tadventurez: AdventureZ 1.3.0
\t\tamecsapi: Amecs API 1.1.5+mc21w16a
\t\tantixray: AntiXray 1.1.0
\t\tapocalypse: Apocalypse Origins 0.1.1
\t\tapoli: Apoli 2.0.3
\t\taqupdcaracal: Caracal mob 1.17-1.3.2
\t\taqupdgrizzly: Grizzly Bear mob 1.17-1.2.0
\t\tarcanus: Arcanus 1.19
\t\tarchitects_palette: Architect's Palette Fabric 1.2
\t\tarchitectury: Architectury 2.5.32
\t\tartifality: Artifality 0.4.2
\t\tassembly: Assembly 21w06a-1.0.0
\t\tattributefix: Attribute Fix {FABRIC} 1.0.3
\t\tauthme: Auth Me 1.5.0
\t\tautobackup: Auto Backup Mod 1.4.5
\t\tautoswitch: AutoSwitch 3.4.0
\t\tautoswitch-api: AutoSwitch API 1.0.0
\t\tawesomedungeon: Awesome Dungeon 1.1.0
\t\taxolotlitemfix: Axolotl Item Fix 1.1.2
\t\tbackslot: BackSlot 1.2.1
\t\tbackslotaddon: BackSlot Addon 1.0.7
\t\tbclib: BCLib 0.3.1
\t\tbetterdungeons: YUNG's Better Dungeons 1.17-1.0.2
\t\tbetterend: Better End 0.11.0-pre
\t\tbetterf3: BetterF3 1.1.5
\t\tbettermineshafts: YUNG's Better Mineshafts 1.17-1.0.1
\t\tbetternether: Better Nether 5.1.3
\t\tbetterthirdperson: Better Third Person 1.5.0
\t\tbewitchment: Bewitchment 1.17-11
\t\tbiomeinfo: Biome Info 1.17-7
\t\tboatcontainer: BoatContainer 1.0.2
\t\tbosses_of_mass_destruction: Bosses of Mass Destruction (Beta) 1.2.3-1.17.1
\t\tcaelus: Caelus API 0.0.18-1.17.1
\t\tcalio: Calio 1.0.3
\t\tcardinal-components: Cardinal Components API 3.1.1
\t\tcardinal-components-base: Cardinal Components API (base) 3.1.1
\t\tcardinal-components-block: Cardinal Components API (blocks) 3.1.1
\t\tcardinal-components-chunk: Cardinal Components API (chunks) 3.1.1
\t\tcardinal-components-entity: Cardinal Components API (entities) 3.1.1
\t\tcardinal-components-item: Cardinal Components API (items) 3.1.1
\t\tcardinal-components-level: Cardinal Components API (world saves) 3.1.1
\t\tcardinal-components-scoreboard: Cardinal Components API (scoreboard) 3.1.1
\t\tcardinal-components-util: Cardinal Components API (utilities) 3.1.1
\t\tcardinal-components-world: Cardinal Components API (worlds) 3.1.1
\t\tcarrier: Carrier 1.8.0
\t\tcaves-and-cliffs-add-on-for-william-wythers-overhauled-overworld: Caves and Cliffs add-on for William Wythers Overhauled Overworld 1.4
\t\tcharm: Charm 3.3.2
\t\tcharmonium: Charmonium 3.3.0
\t\tchat_heads: Chat Heads 0.4.2
\t\tcherishedworlds: Cherished Worlds 2.0.1-1.17.1
\t\tcleancut: CleanCut 1.17-4.0-fabric
\t\tcleardespawn: Clear Despawn 1.17.1-1.1.2
\t\tcloth-api: Cloth API 2.0.54
\t\tcloth-basic-math: Cloth Basic Math 0.5.1
\t\tcloth-client-events-v0: Cloth Client Events v0 2.0.54
\t\tcloth-common-events-v1: Cloth Common Events v1 2.0.54
\t\tcloth-config2: Cloth Config v5 5.0.38
\t\tcloth-datagen-api-v1: Cloth Datagen v1 2.0.54
\t\tcloth-scissors-api-v1: Cloth Scissors API v1 2.0.54
\t\tcloth-utils-v1: Cloth Utils v1 2.0.54
\t\tclumps: Clumps 7.0.10
\t\tcollective-fabric: Collective (Fabric) 1.44
\t\tcolytra: Colytra 2.0.0-1.17
\t\tcom_electronwill_night-config_core: core 3.6.3
\t\tcom_electronwill_night-config_toml: toml 3.6.3
\t\tcom_moandjiezana_toml_toml4j: toml4j 0.7.2
\t\tcom_velocitypowered_velocity-native: velocity-native 1.1.0-SNAPSHOT
\t\tcomforts: Comforts 0.0.7-1.17.1
\t\tconjuring: Conjuring 1.0.12
\t\tcontrolling: Controlling For Fabric 1.1.2
\t\tcopperequipment: Copper Equipment 1.6
\t\tcosmetica: Cosmetica 0.2.0
\t\tcouplings: Couplings 1.5.0+1.17
\t\tcozy_camping: Cozy Camping 1.0.0-1.17
\t\tcroptopia: Croptopia 1.6.3
\t\tcrossreverie: Cross Reverie RPG Mod 1.0.0
\t\tcrowdin-translate: CrowdinTranslate 1.3+1.17
\t\tcustomportalapi: Custom Portals 0.0.1-beta33-1.17
\t\tdark-enchanting: Dark Enchanting 0.4.1-1.17.1
\t\tdarkpaintings: Dark Paintings 4.0.2
\t\tdataattributes: Data Attributes 1.0.6
\t\tdawn: Dawn API 2.0.6
\t\tdeepslatecutting: Deepslate Cutting 1.2.2
\t\tdehydration: Dehydration 1.2.5
\t\tdisable_custom_worlds_advice: Disable Custom Worlds Advice 1.3
\t\tdragonloot: DragonLoot 1.0.9
\t\tdrinkbeer: Drink Beer 2.2
\t\tdrippyloadingscreen: Drippy Loading Screen 1.2.0
\t\tdual_riders: DualRiders 1.0.5
\t\tdungeons_arise: When Dungeons Arise 2.1.47-fabric
\t\tdynamicfps: Dynamic FPS 2.0.6
\t\tdynmus: Dynamic Music 1.3.1
\t\tearthtojavamobs: Earth2Java 1.7.3+1.17
\t\teldritch_mobs: Eldritch Mobs 1.9.6
\t\telytratrinket: Elytra Trinket 2.0.1-1.17
\t\tenchant_giver: Enchant Giver 1.1.0
\t\tenchantment_lore: EnchantmentLore 1.2.1+MC1.17.1
\t\tendgoblintraders: End Goblin Traders 1.2
\t\tendrem: End Remastered 4.1.0
\t\tenhanced_attack_indicator: Enhanced Attack Indicator 1.0.2+1.17
\t\tenhanced_mushrooms: Enhanced Mushrooms 1.0.5
\t\tenhancedcelestials: Enhanced Celestials 2.0.5
\t\tenvironmentz: EnvironmentZ 1.1.6
\t\tfabric: Fabric API 0.41.0+1.17
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
\t\tfabric-entity-events-v1: Fabric Entity Events (v1) 1.3.0+57bef5a318
\t\tfabric-events-interaction-v0: Fabric Events Interaction (v0) 0.4.10+fc40aa9d18
\t\tfabric-events-lifecycle-v0: Fabric Events Lifecycle (v0) 0.2.1+92519afa18
\t\tfabric-game-rule-api-v1: Fabric Game Rule API (v1) 1.0.7+cbda931818
\t\tfabric-item-api-v1: Fabric Item API (v1) 1.2.4+a02b4463d5
\t\tfabric-item-groups-v0: Fabric Item Groups (v0) 0.2.10+b7ab612118
\t\tfabric-key-binding-api-v1: Fabric Key Binding API (v1) 1.0.4+cbda931818
\t\tfabric-keybindings-v0: Fabric Key Bindings (v0) 0.2.2+36b77c3e18
\t\tfabric-language-kotlin: Fabric Language Kotlin 1.6.5+kotlin.1.5.31
\t\tfabric-lifecycle-events-v1: Fabric Lifecycle Events (v1) 1.4.4+a02b4463d5
\t\tfabric-loot-tables-v1: Fabric Loot Tables (v1) 1.0.4+a02b446318
\t\tfabric-mining-levels-v0: Fabric Mining Levels (v0) 0.1.3+92519afa18
\t\tfabric-models-v0: Fabric Models (v0) 0.3.0+a02b446318
\t\tfabric-networking-api-v1: Fabric Networking API (v1) 1.0.13+cbda931818
\t\tfabric-networking-blockentity-v0: Fabric Networking Block Entity (v0) 0.2.11+a02b446318
\t\tfabric-networking-v0: Fabric Networking (v0) 0.3.2+92519afa13
\t\tfabric-object-builder-api-v1: Fabric Object Builder API (v1) 1.10.9+b7ab6121d5
\t\tfabric-object-builders-v0: Fabric Object Builders (v0) 0.7.3+a02b446318
\t\tfabric-particles-v1: Fabric Particles (v1) 0.2.4+a02b446318
\t\tfabric-permissions-api-v0: fabric-permissions-api 0.1-SNAPSHOT
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
\t\tfabric-tool-attribute-api-v1: Fabric Tool Attribute API (v1) 1.2.12+b7ab6121d5
\t\tfabric-transfer-api-v1: Fabric Transfer API (v1) 1.4.0+7931163218
\t\tfabric-tree-chopper: Fabric Tree Chopper 0.7.2
\t\tfabricloader: Fabric Loader 0.11.7
\t\tfallflyinglib: FallFlyingLib 3.0.0-beta.2
\t\tfallingleaves: Falling Leaves 1.7.4+1.17.1
\t\tfancymenu: FancyMenu 2.3.4
\t\tfermion: Fermion 2.11.241
\t\tfermion-modkeys: Fermion Modifier Keys 1.10.241
\t\tferritecore: FerriteCore 3.1.0
\t\tfiber: fiber 0.23.0-2
\t\tfiber2cloth: Fiber To Cloth 3.2.0
\t\tflesh2leather: Flesh2Leather 1.0.2
\t\tflintytools: Flinty Tools 1.0.0
\t\tflytre-lib-base: Flytre Lib - Base Module 1.2.0
\t\tflytre-lib-compat: Flytre Lib - Compat Module 1.0.0
\t\tflytre-lib-config: Flytre Lib - Config Module 1.1.0
\t\tflytre-lib-event: Flytre Lib - Event Module 1.0.1
\t\tflytre-lib-gui: Flytre Lib - GUI Module 1.0.0
\t\tflytre-lib-storage: Flytre Lib - Storage Module 2.3.1
\t\tflytre_lib: Flytre Lib 1.3.9
\t\tforgottenrecipes: Forgotten Recipes 1.0.3
\t\tgateofbabylon: Gate Of Babylon 1.5.1-1.17.1
\t\tgbfabrictools: GBfabrictools 1.3.4+1.17
\t\tgeckolib3: Geckolib 3.0.18
\t\tglobalspawn: GlobalSpawn 1.3.1-1.17.0
\t\tgo-fish: Go Fish 1.3.0-beta-1.17.1
\t\tgobber2: Gobber2 2.4.53
\t\tgoblintraders: Goblin Traders 1.1.1
\t\tgoldenhoppers: Golden Hoppers 1.1.0
\t\tgrass_pass: Grass Bypass 1.0.0
\t\tgraveyard: The Graveyard 1.0
\t\tguild: Guild 0.3.3
\t\tharvest_scythes: Harvest Scythes 2.0.6
\t\thorsestatsvanilla: Horse Stats Vanilla 4.1.8
\t\thumans: Humans 0.2.0-beta.1+1.17
\t\tias: In-Game Account Switcher 7.1.3
\t\ticarus: Icarus 1.4
\t\tilluminations: Illuminations 1.9
\t\timm_ptl_core: Immersive Portals Core 0.29
\t\timmersive_portals: Immersive Portals 0.29
\t\timpaled: Impaled 1.0.1
\t\timpersonate: Impersonate 2.3.5
\t\tinfusion_table: Infusion Table 1.0.2
\t\tinmis: Inmis 2.3.2-1.17.1
\t\tinteractic: Interactic 0.1.6-1.17
\t\tinventoryhud: Inventory HUD + 3.4.0
\t\tjankson: Jankson 3.0.1+j1.2.0
\t\tjava: OpenJDK 64-Bit Server VM 16
\t\tjust_end_anchor: Just An End Anchor 1.0.1
\t\tkanos_config: Kanos Config 0.1.4+1.14.4-1.17.1
\t\tkirin: Kirin UI 1.9.1
\t\tkonkrete: Konkrete 1.3.0
\t\tkrypton: Krypton 0.1.4
\t\tkubejs: KubeJS 1701.3.10-build.9999
\t\tlacrimis: Lacrimis 2.1.3+1.17.1
\t\tlazydfu: LazyDFU 0.1.2
\t\tlibcd: LibCapableData 3.0.3+1.16.3
\t\tlibgui: LibGui 4.1.7+1.17.1
\t\tlibninepatch: LibNinePatch 1.1.0
\t\tlightestlamp: Lightest Lamps 0.9.3
\t\tlithium: Lithium 0.7.4
\t\tlovely_snails: Lovely Snails 1.0.3+1.17
\t\tmaelstrom_library: Maelstrom Library 1.2.1-1.17
\t\tmagicfungi: Magic Fungi 0.4.1-BETA+1.17.1
\t\tmavm: More Axolotl Variants Mod 1.0.5
\t\tmaybe-data: Maybe data 1.0.1-1.17
\t\tmaybe-more-data: Maybe More Data 1.0.0-1.17.1
\t\tmcda: MC Dungeons Armors 1.7.13
\t\tmcdar: MC Dungeons Artifacts 1.4.2
\t\tmcdw: MC Dungeons Weapons 3.5.5
\t\tme_hypherionmc_simple-rpc-lib: simple-rpc-lib 2.1.10
\t\tmedieval_origins: Medieval Origins 2.1.3
\t\tmedievalweapons: Medieval Weapons 1.1.7
\t\tmegane: megane 5.5.0
\t\tmegane-base: megane-base 5.5.0
\t\tmegane-fabric-transfer: megane-fabric-transfer 5.5.0+1.3.0-fc40aa9d18
\t\tmegane-runtime: megane-runtime 5.5.0
\t\tmegane-team-reborn-energy: megane-team-reborn-energy 5.5.0+2.0.0-beta1
\t\tmegane-vanilla: megane-vanilla 5.5.0+1.17.1
\t\tmermod: Mermod 1.9
\t\tminecraft: Minecraft 1.17.1
\t\tmm: Manningham Mills 2.3
\t\tmoborigins: Mob Origins 1.7.0
\t\tmodmenu: Mod Menu 2.0.14
\t\tmore-structures-add-on-for-william-wythers-overhauled-overworld: More Structures add-on for William Wythers Overhauled Overworld 1.2
\t\tmoreberries: More Berries 1.4.3
\t\tmorerespawnanchors: More Respawn Anchors 1.0.2
\t\tmorevillagers-fabric: MoreVillagersFabric 2.1.1-SNAPSHOT
\t\tmostructures: Mo' Structures 1.3.0-pre1-1.17.1
\t\tmousewheelie: Mouse Wheelie 1.7.3+mc1.17.1-pre1
\t\tmultipart_entities: MultipartEntities 1.1.2-1.17
\t\tmythic-mounts: Mythic Mounts 1.17.1-2.0
\t\tnamepain: Name Pain 1.4.0
\t\tnaturescompass: Nature's Compass 1.17.1-2.0.1-fabric
\t\tnears: Nears 1.1.2
\t\tnearsightedly: Near-Sightedly 1.2.1
\t\tnecro: Necromancer 1.3.3
\t\tnet_kyori_adventure-api: adventure-api 4.8.1
\t\tnet_kyori_adventure-key: adventure-key 4.8.1
\t\tnet_kyori_adventure-platform-api: adventure-platform-api 4.0.0-SNAPSHOT
\t\tnet_kyori_adventure-text-feature-pagination: adventure-text-feature-pagination 4.0.0-SNAPSHOT
\t\tnet_kyori_adventure-text-minimessage: adventure-text-minimessage 4.2.0-SNAPSHOT
\t\tnet_kyori_adventure-text-serializer-gson: adventure-text-serializer-gson 4.8.1
\t\tnet_kyori_adventure-text-serializer-plain: adventure-text-serializer-plain 4.8.1
\t\tnet_kyori_examination-api: examination-api 1.1.0
\t\tnet_kyori_examination-string: examination-string 1.1.0
\t\tnet_objecthunter_exp4j: exp4j 0.4.8
\t\tnetherite_items: Netherite Items 1.1.0
\t\tnofade: No Fade 1.17-2.0.0
\t\tnotenoughanimations: NotEnoughAnimations 1.3.3
\t\tnotenoughcrashes: Not Enough Crashes 3.7.0+1.17.1
\t\tnpcvariety: NPC Variety 2.1.3
\t\tomega-config: OmegaConfig 1.0.8
\t\tonsoulfire: On Soul Fire 1.17-3
\t\torg_aeonbits_owner_owner: owner 1.0.12
\t\torg_jetbrains_kotlin_kotlin-reflect: kotlin-reflect 1.5.31
\t\torg_jetbrains_kotlin_kotlin-stdlib: kotlin-stdlib 1.5.31
\t\torg_jetbrains_kotlin_kotlin-stdlib-jdk7: kotlin-stdlib-jdk7 1.5.31
\t\torg_jetbrains_kotlin_kotlin-stdlib-jdk8: kotlin-stdlib-jdk8 1.5.31
\t\torg_jetbrains_kotlinx_kotlinx-coroutines-core-jvm: kotlinx-coroutines-core-jvm 1.5.2
\t\torg_jetbrains_kotlinx_kotlinx-coroutines-jdk8: kotlinx-coroutines-jdk8 1.5.2
\t\torg_jetbrains_kotlinx_kotlinx-serialization-core-jvm: kotlinx-serialization-core-jvm 1.3.0
\t\torg_jetbrains_kotlinx_kotlinx-serialization-json-jvm: kotlinx-serialization-json-jvm 1.3.0
\t\torigins: Origins 1.1.2
\t\toutvoted: Outvoted 2.0.0-alpha.14
\t\towo: oωo 0.3.0
\t\toxidized: Oxidized 1.4.0
\t\toxidizelib: OxidizeLib 1.1.0
\t\tpaintings: Paintings ++ 1.17.1-1.0.0.3
\t\tpatchouli: Patchouli 1.17.1-56-FABRIC
\t\tpaxi: Paxi 1.17-1.2.2
\t\tpeepingcreepers: Peeping Creepers 1.1-1.17
\t\tpehkui: Pehkui 2.5.0+1.14.4-1.18
\t\tpigsteel: Pigsteel Mod 1.6.6
\t\tplaceholder-api: Placeholder API 1.1.1+1.17.1
\t\tplasmo_voice: Plasmo Voice 1.2.5
\t\tplayerabilitylib: Pal 1.3.0
\t\tplayerex: PlayerEx 3.0.5
\t\tpolymorph: Polymorph 0.0.14-1.17.1
\t\tpresencefootsteps: Presence Footsteps r32-1.17-rc1
\t\tprimordial-shores-add-on-for-wwoo: Primordial Shores add-on for William Wythers Overhauled Overworld 1.0
\t\tpromenade: Promenade 2.1.2
\t\tpugh_lib: Pugh Lib \${version}
\t\tpugh_tools: Pugh Tools \${version}
\t\tq_misc_util: A Miscellaneous Utility Library from qouteall 0.29
\t\tquartzelv: Quartz Elevator 1.2.5
\t\tratsmischief: Rat's Mischief 1.2.3
\t\treach-entity-attributes: Reach Entity Attributes 2.1.1
\t\trealisticfirespread: Realistic Fire Spread 1.17-3
\t\treinfchest: Reinforced Chests 1.0.3
\t\treinfcore: Reinforced Core 1.1.0
\t\trepurposed_structures: Repurposed Structures 2.4.0+1.17.1
\t\treroll: Reroll 1.3.0-1.17.1
\t\trhino: Rhino 1701.1.5-build.71
\t\trightclickharvest: Right Click Harvest 1.4.0
\t\troughlyenoughitems: Roughly Enough Items 6.0.287-alpha
\t\troughlyenoughresources: Roughly Enough Resources 2.2.0
\t\trpgdifficulty: Rpg Difficulty 1.0.7
\t\trunelic: Runelic 3.0.1
\t\tscorch: Scorch 1.1.2
\t\tseasons: Fabric Seasons 1.3.1-BETA+1.17
\t\tseedy-behavior: Seedy Behavior 1.0.1
\t\tshulkerutils: shulkerutils 1.0.4-1.17
\t\tshwfox: Shadew's Foxes 1.1+fabric
\t\tsilentbackground: SilentBackground 1.0.1
\t\tsimple-rpc: Simple Rpc 1.17-2.4-fabric
\t\tsit: Sit 1.17.1-13
\t\tskinlayers: 3d Skin Layers 1.1.1
\t\tsmall_artifacts: Small Artifacts 0.0.3-1.17.1
\t\tsnowundertrees: Snow Under Trees 1.0.0
\t\tsomnus: Somnus API 0.0.14-1.17.1
\t\tsoundphysics: Sound Physics 2.1.0
\t\tspark: spark 1.6.2
\t\tstackablepotions: Stackable Potions 1.0.0
\t\tstaffofbuilding: Staff of Building 1.3.2-1.17
\t\tstatic-content: Static Content 1.0.1-1.16.2
\t\tstaticdata: Static Data 1.1.2
\t\tstep-height-entity-attribute: Step Height Entity Attribute 1.0.0
\t\tstoneholm: Stoneholm 1.3
\t\tstonevaults: Stonevaults 1.1.0
\t\tsulfurpotassiummod: Sulfur & Potassium 1.1.1
\t\ttalking-villagers: Talking Villagers 1.1.3
\t\tteam_reborn_energy: Energy 2.0.0-beta1
\t\tterraform-biome-builder-api-v1: Terraform Biome Builder API (v1) 2.0.0
\t\tterraform-config-api-v1: Terraform Config API (v1) 2.0.0
\t\tterraform-overworld-biome-extensions-api-v1: Terraform Overworld Biome Extensions API (v1) 2.0.0
\t\tterraform-shapes-api-v1: Terraform Shapes API (v1) 1.0.4
\t\tterraform-surfaces-api-v1: Terraform Surfaces API (v1) 2.0.0
\t\tterraform-tree-api-v1: Terraform Tree API (v1) 2.0.0
\t\tterraform-wood-api-v1: Terraform Wood API (v1) 2.0.2
\t\tterraria_paintings: Terraria Paintings 1.0.0
\t\tthe_aether: The Aether 1.17.1-1.5.0
\t\tthings: Things 0.2.6
\t\tthonkutil: ThonkUtil 1.2
\t\ttooltiprareness: Tooltip Rareness 1.0.3
\t\ttransliterationlib: TRansliterationLib 1.2.2
\t\ttraverse: Traverse 4.0.0
\t\ttrinkets: Trinkets 3.0.4
\t\ttweed: Tweed 3.0.0-beta.26
\t\tupgradedechests: Upgraded Ender Chests 1.0.2-1.17
\t\tupgradedshulkers: Upgraded Shulkers 1.1.0-1.17
\t\turns: Urns 1.0.1
\t\tvanilla_degus: Vanilla Degus 1.2.3
\t\tveinmining: Vein Mining 0.0.10-1.17
\t\tvillager-hats: Villager Hats Mod 1.2.1
\t\tvillagernames: Villager Names 2.0.0
\t\tvisuality: Visuality 0.2.0
\t\tvoidtotem: Void Totem (Fabric) 1.17.0-1.0.0
\t\tvoidz: VoidZ 1.0.5
\t\twandering_collector: Wandering Collector 1.0.2+mc1.17
\t\twaystones: Waystones 2.1.2
\t\twilliam-wythers-overhauled-overworld: William Wythers Overhauled Overworld 1.7
\t\twolveswitharmor: Wolves With Armor 1.6.1-1.17.1
\t\twoods_and_mires: Woods and Mires 1.1.1+1.17
\t\tworldborder-fabric: World Border (Fabric) 2.5
\t\twrenchable: Wrenchable 1.1.0+1.17
\t\twthit: wthit 3.9.3
\t\txaeroworldmap: Xaero's World Map 1.15.0.1
\t\txps: Xp Obelisk 0.2.0_for_1.17.x_Fabric
\t\tyungsapi: YUNG's API 1.17-Fabric-19
\tLaunched Version: fabric-loader-0.11.7-1.17.1
\tBackend library: LWJGL version 3.2.2 build 10
\tBackend API: GeForce GTX 1050 Ti/PCIe/SSE2 GL version 3.2.0 NVIDIA 456.71, NVIDIA Corporation
\tWindow size: 1920x1080
\tGL Caps: Using framebuffer using OpenGL 3.2
\tGL debug messages: 
\tUsing VBOs: Yes
\tIs Modded: Definitely; Client brand changed to 'fabric'
\tType: Client (map_client.txt)
\tGraphics mode: fancy
\tResource Packs: vanilla, Fabric Mods, kubejs:resource_pack (incompatible)
\tCurrent Language: Русский (Россия)
\tCPU: 4x Intel(R) Core(TM) i3-8100 CPU @ 3.60GHz
\tClient Crashes Since Restart: 1
\tIntegrated Server Crashes Since Restart: 0
\tSuspected Mods: None`