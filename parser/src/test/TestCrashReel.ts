export const TestCrashReel = `---- Minecraft Crash Report ----
// Daisy, daisy...

Time: 21-10-7 ??6:22
Description: Exception ticking world

java.lang.OutOfMemoryError: Java heap space
\tat java.util.Arrays.copyOf(Arrays.java:3181) ~[?:1.8.0-internal] {}
\tat java.util.AbstractCollection.finishToArray(AbstractCollection.java:230) ~[?:1.8.0-internal] {}
\tat java.util.AbstractCollection.toArray(AbstractCollection.java:199) ~[?:1.8.0-internal] {}
\tat com.google.common.collect.Iterables.toArray(Iterables.java:295) ~[guava-21.0.jar:?] {}
\tat com.google.common.collect.ImmutableSortedMap.fromEntries(ImmutableSortedMap.java:361) ~[guava-21.0.jar:?] {}
\tat com.google.common.collect.ImmutableSortedMap.copyOfInternal(ImmutableSortedMap.java:346) ~[guava-21.0.jar:?] {}
\tat com.google.common.collect.ImmutableSortedMap.copyOf(ImmutableSortedMap.java:237) ~[guava-21.0.jar:?] {}
\tat top.theillusivec4.champions.common.rank.RankManager.getRanks(RankManager.java:24) ~[champions:task ':jar' property 'archiveVersion'] {re:classloading}
\tat top.theillusivec4.champions.common.util.ChampionBuilder.createRank(ChampionBuilder.java:109) ~[champions:task ':jar' property 'archiveVersion'] {re:classloading}
\tat top.theillusivec4.champions.common.util.ChampionBuilder.spawn(ChampionBuilder.java:36) ~[champions:task ':jar' property 'archiveVersion'] {re:classloading}
\tat top.theillusivec4.champions.common.capability.CapabilityEventHandler.lambda$onSpecialSpawn$0(CapabilityEventHandler.java:48) ~[champions:task ':jar' property 'archiveVersion'] {re:classloading}
\tat top.theillusivec4.champions.common.capability.CapabilityEventHandler$$Lambda$15825/555499769.accept(Unknown Source) ~[?:?] {}
\tat net.minecraftforge.common.util.LazyOptional.ifPresent(LazyOptional.java:165) ~[forge:?] {re:mixin,re:classloading}
\tat top.theillusivec4.champions.common.capability.CapabilityEventHandler.onSpecialSpawn(CapabilityEventHandler.java:40) ~[champions:task ':jar' property 'archiveVersion'] {re:classloading}
\tat net.minecraftforge.eventbus.ASMEventHandler_1475_CapabilityEventHandler_onSpecialSpawn_SpecialSpawn.invoke(.dynamic) ~[?:?] {}
\tat net.minecraftforge.eventbus.ASMEventHandler.invoke(ASMEventHandler.java:85) ~[eventbus-4.0.0.jar:?] {}
\tat net.minecraftforge.eventbus.EventBus$$Lambda$2541/1840514976.invoke(Unknown Source) ~[?:?] {}
\tat net.minecraftforge.eventbus.EventBus.post(EventBus.java:302) ~[eventbus-4.0.0.jar:?] {}
\tat net.minecraftforge.eventbus.EventBus.post(EventBus.java:283) ~[eventbus-4.0.0.jar:?] {}
\tat net.minecraftforge.event.ForgeEventFactory.doSpecialSpawn(ForgeEventFactory.java:216) ~[forge:?] {re:classloading}
\tat net.minecraft.world.spawner.WorldEntitySpawner.func_234966_a_(WorldEntitySpawner.java:174) ~[?:?] {re:mixin,re:classloading,pl:mixin:APP:enhancedcelestials.mixins.json:MixinEntityWorldSpawner,pl:mixin:A}
\tat net.minecraft.world.spawner.WorldEntitySpawner.func_234967_a_(WorldEntitySpawner.java:124) ~[?:?] {re:mixin,re:classloading,pl:mixin:APP:enhancedcelestials.mixins.json:MixinEntityWorldSpawner,pl:mixin:A}
\tat net.minecraft.world.spawner.WorldEntitySpawner.func_234979_a_(WorldEntitySpawner.java:110) ~[?:?] {re:mixin,re:classloading,pl:mixin:APP:enhancedcelestials.mixins.json:MixinEntityWorldSpawner,pl:mixin:A}
\tat net.minecraft.world.server.ServerChunkProvider.func_241099_a_(ServerChunkProvider.java:364) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
\tat net.minecraft.world.server.ServerChunkProvider$$Lambda$14535/372409431.accept(Unknown Source) ~[?:?] {}
\tat java.util.ArrayList.forEach(ArrayList.java:1259) ~[?:1.8.0-internal] {}
\tat net.minecraft.world.server.ServerChunkProvider.func_217220_m(ServerChunkProvider.java:351) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
\tat net.minecraft.world.server.ServerChunkProvider.func_217207_a(ServerChunkProvider.java:326) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
\tat net.minecraft.world.server.ServerWorld.func_72835_b(ServerWorld.java:333) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
\tat net.minecraft.server.MinecraftServer.func_71190_q(MinecraftServer.java:851) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:enhancedcelestials.mixins.json:MixinMinecraftServer,pl:mixin:A}
\tat net.minecraft.server.MinecraftServer.func_71217_p(MinecraftServer.java:787) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:enhancedcelestials.mixins.json:MixinMinecraftServer,pl:mixin:A}
\tat net.minecraft.server.integrated.IntegratedServer.func_71217_p(IntegratedServer.java:118) ~[?:?] {re:mixin,xf:OptiFine:default,re:classloading,xf:OptiFine:default,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinIntegratedServer,pl:mixin:APP:smoothboot.mixins.json:client.IntegratedServerMixin,pl:mixin:A}


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Affected level --
Details:
\tAll players: 1 total; [ServerPlayerEntity['??'/145, l='ServerLevel[????]', x=150.50, y=4.00, z=127.50]]
\tChunk stats: ServerChunkCache: 2025
\tLevel dimension: minecraft:overworld
\tLevel spawn location: World: (160,4,128), Chunk: (at 0,0,0 in 10,8; contains blocks 160,0,128 to 175,255,143), Region: (0,0; contains chunks 0,0 to 31,31, blocks 0,0,0 to 511,255,511)
\tLevel time: 76 game time, 76 day time
\tLevel name: ????
\tLevel game mode: Game mode: creative (ID 1). Hardcore: false. Cheats: true
\tLevel weather: Rain time: 12012 (now: false), thunder time: 46498 (now: false)
\tKnown server brands: forge
\tLevel was modded: true
\tLevel storage version: 0x04ABD - Anvil
Stacktrace:
\tat net.minecraft.server.MinecraftServer.func_71190_q(MinecraftServer.java:854) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:enhancedcelestials.mixins.json:MixinMinecraftServer,pl:mixin:A}
\tat net.minecraft.server.MinecraftServer.func_71217_p(MinecraftServer.java:787) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:enhancedcelestials.mixins.json:MixinMinecraftServer,pl:mixin:A}
\tat net.minecraft.server.integrated.IntegratedServer.func_71217_p(IntegratedServer.java:118) ~[?:?] {re:mixin,xf:OptiFine:default,re:classloading,xf:OptiFine:default,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinIntegratedServer,pl:mixin:APP:smoothboot.mixins.json:client.IntegratedServerMixin,pl:mixin:A}
\tat net.minecraft.server.MinecraftServer.func_240802_v_(MinecraftServer.java:642) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:enhancedcelestials.mixins.json:MixinMinecraftServer,pl:mixin:A}
\tat net.minecraft.server.MinecraftServer.func_240783_a_(MinecraftServer.java:232) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:enhancedcelestials.mixins.json:MixinMinecraftServer,pl:mixin:A}
\tat java.lang.Thread.run(Thread.java:748) ~[?:1.8.0-internal] {}

-- System Details --
Details:
\tMinecraft Version: 1.16.5
\tMinecraft Version ID: 1.16.5
\tOperating System: Linux (aarch64) version 4.9.186-perf-g10af704
\tJava Version: 1.8.0-internal, Oracle Corporation
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode), Oracle Corporation
\tMemory: 710141848 bytes (677 MB) / 1931476992 bytes (1842 MB) up to 1931476992 bytes (1842 MB)
\tCPUs: 8
\tJVM Flags: 3 total; -Xms1024M -Xmx2048M -Xbootclasspath/a:/data/data/com.mio.launcher/app_runtime/caciocavallo/cacio-shared-1.10-SNAPSHOT.jar:/data/data/com.mio.launcher/app_runtime/caciocavallo/ResConfHack.jar:/data/data/com.mio.launcher/app_runtime/caciocavallo/cacio-androidnw-1.10-SNAPSHOT.jar
\tModLauncher: 8.0.9+86+master.3cf110c
\tModLauncher launch target: fmlclient
\tModLauncher naming: srg
\tModLauncher services: 
\t\t/mixin-0.8.4.jar mixin PLUGINSERVICE 
\t\t/eventbus-4.0.0.jar eventbus PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.5.jar object_holder_definalize PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.5.jar runtime_enum_extender PLUGINSERVICE 
\t\t/accesstransformers-3.0.1.jar accesstransformer PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.5.jar capability_inject_definalize PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.5.jar runtimedistcleaner PLUGINSERVICE 
\t\t/mixin-0.8.4.jar mixin TRANSFORMATIONSERVICE 
\t\t/%5B%E9%AB%98%E6%B8%85%E4%BF%AE%E5%A4%8D%5DOptiFine_1.16.5_HD_U_G8.jar OptiFine TRANSFORMATIONSERVICE 
\t\t/forge-1.16.5-36.2.5.jar fml TRANSFORMATIONSERVICE 
\tFML: 36.2
\tForge: net.minecraftforge:36.2.5
\tFML Language Providers: 
\t\tjavafml@36.2
\t\tminecraft@1
\tMod List: 
\t\t[??]notenoughcrashes.jar                          |Not Enough Crashes            |notenoughcrashes              |3.2.0               |DONE      |Manifest: NOSIGNATURE
\t\t[???]GokiStats.jar                                |Goki Stats                    |gokistats                     |1.2.13              |DONE      |Manifest: NOSIGNATURE
\t\t[??????] blood-particles-1.16.3-1.0.1.jar         |Blood Particles               |blood_particles               |1.0.1               |DONE      |Manifest: NOSIGNATURE
\t\t[????][??????] inventoryprofiles-forge-1.16.2-0.4.|Inventory Profiles            |inventoryprofiles             |0.4.2               |DONE      |Manifest: NOSIGNATURE
\t\t[???F3] BetterF3-1.1.3-forge-1.16.5.jar           |BetterF3 Forge                |betterf3forge                 |1.1.3               |DONE      |Manifest: NOSIGNATURE
\t\t[??]SlashBlade.jar                                |Slash Blade                   |slashblade                    |0.0.12              |DONE      |Manifest: NOSIGNATURE
\t\t[????]ProjectE.jar                                |ProjectE                      |projecte                      |PE1.0.1B            |DONE      |Manifest: NOSIGNATURE
\t\t[????]dynamiclights.jar                           |Dynamic Lights                |dynamiclights                 |1.16.5.1            |DONE      |Manifest: NOSIGNATURE
\t\t[??]Guide.jar                                     |Guide-API VP                  |guideapi-vp                   |2.2.2               |DONE      |Manifest: NOSIGNATURE
\t\t[??????] Neat 1.7-27.jar                          |Neat                          |neat                          |1.7-27              |DONE      |Manifest: NOSIGNATURE
\t\t[?????????????] EnhancedVisuals_v1.3.32_mc1.16.5.j|EnhancedVisuals               |enhancedvisuals               |1.3.0               |DONE      |Manifest: NOSIGNATURE
\t\t[??????] i18nupdatemod-1.16.5-2.0.2-hotfix-4.jar  |I18n update Mod               |i18nupdatemod                 |2.0.2               |DONE      |Manifest: NOSIGNATURE
\t\t[??]ReAuth.jar                                    |ReAuth                        |reauth                        |3.9.3               |DONE      |Manifest: 3d:06:1e:e5:da:e2:ff:ae:04:00:be:45:5b:ff:fd:70:65:00:67:0b:33:87:a6:5f:af:20:3c:b6:a1:35:ca:7e
\t\t[YUNG's API] YungsApi-1.16.4-Forge-12.jar         |YUNG's API                    |yungsapi                      |1.16.4-Forge-12     |DONE      |Manifest: NOSIGNATURE
\t\t[??????] culinaryconstruct-forge-1.16.5-4.0.0.6.ja|Culinary Construct            |culinaryconstruct             |1.16.5-4.0.0.6      |DONE      |Manifest: NOSIGNATURE
\t\t[????]MutantBeasts.jar                            |Mutant Beasts                 |mutantbeasts                  |1.16.4-1.1.3        |DONE      |Manifest: d9:be:bd:b6:9a:e4:14:aa:05:67:fb:84:06:77:a0:c5:10:ec:27:15:1b:d6:c0:88:49:9a:ef:26:77:61:0b:5e
\t\t[API]Bookshelf-Forge-1.16.5-10.2.27.jar           |Bookshelf                     |bookshelf                     |10.2.27             |DONE      |Manifest: eb:c4:b1:67:8b:f9:0c:db:dc:4f:01:b1:8e:61:64:39:4c:10:85:0b:a6:c4:c7:48:f0:fa:95:f2:cb:08:3a:e5
\t\t[????]guardvillagers.jar                          |Guard Villagers               |guardvillagers                |1.2.5               |DONE      |Manifest: NOSIGNATURE
\t\t[???]Ore_Tree_.jar                                |Ore Tree                      |ore_tree                      |0.1.0               |DONE      |Manifest: NOSIGNATURE
\t\t[????]simpleplanes.jar                            |Simple Planes                 |simpleplanes                  |1.16.5-4.6.0        |DONE      |Manifest: NOSIGNATURE
\t\t[??]Hwyla.jar                                     |Waila                         |waila                         |1.10.11-B78_1.16.2  |DONE      |Manifest: NOSIGNATURE
\t\t[??]FpsReducer.jar                                |FPS Reducer                   |fpsreducer                    |1.23-mc1.16.5       |DONE      |Manifest: NOSIGNATURE
\t\t[JEI??]JustEnoughResources.jar                    |Just Enough Resources         |jeresources                   |0.12.1.127          |DONE      |Manifest: NOSIGNATURE
\t\t[??????]pvzmod-1.16.5-0.5.3 pre 1.jar             |Plants vs Zombies             |pvz                           |0.5.3               |DONE      |Manifest: NOSIGNATURE
\t\t[???]NeoUltraCraft 1.1.0.jar                      |NeoUltraCraft                 |neoultracraft                 |1.1.0               |DONE      |Manifest: NOSIGNATURE
\t\t[????] FarmersDelight-1.16.3-0.4.0.jar            |Farmer's Delight              |farmersdelight                |1.16.3-0.4.0        |DONE      |Manifest: NOSIGNATURE
\t\t[??????] BiomesOPlenty-1.16.5-13.1.0.477-universal|Biomes O' Plenty              |biomesoplenty                 |1.16.5-13.1.0.477   |DONE      |Manifest: NOSIGNATURE
\t\t[?????] BetterDrowning-1.16.5-2.0.3.jar           |BetterDrowning                |betterdrowning                |2.0.3               |DONE      |Manifest: eb:c4:b1:67:8b:f9:0c:db:dc:4f:01:b1:8e:61:64:39:4c:10:85:0b:a6:c4:c7:48:f0:fa:95:f2:cb:08:3a:e5
\t\t[????]ChunkAnimator.jar                           |Chunk Animator                |chunkanimator                 |1.16.5-1.2.4        |DONE      |Manifest: NOSIGNATURE
\t\t[?????] EditSign-Forge-1.16.5-2.2.0.jar           |Edit Sign                     |editsign                      |2.2.0               |DONE      |Manifest: NOSIGNATURE
\t\t[?????????????????]supermartijn642corelib-1.0.3-mc|SuperMartijn642's Core Lib    |supermartijn642corelib        |1.0.3               |DONE      |Manifest: NOSIGNATURE
\t\t[????] simplylight-1.16.4-1.2.0-build.11.jar      |Simply Light                  |simplylight                   |1.16.4-1.2.0-build.1|DONE      |Manifest: NOSIGNATURE
\t\t[??????] fishingreal-1.16.3-1.0.0.jar             |Fishing Real                  |fishingreal                   |1.0.0               |DONE      |Manifest: NOSIGNATURE
\t\t[???????]MysticalAdaptations.jar                  |Mystical Adaptations          |mysticaladaptations           |1.16.5-1.2.1        |DONE      |Manifest: NOSIGNATURE
\t\t[????]combat_music.jar                            |Combat Music                  |combat_music                  |1.0                 |DONE      |Manifest: NOSIGNATURE
\t\t[??????????]TTIGRAAS.jar                          |TTIGRAAS                      |ttigraas                      |1.7.0               |DONE      |Manifest: NOSIGNATURE
\t\t[???]Patchouli.jar                                |Patchouli                     |patchouli                     |1.16.4-53.1         |DONE      |Manifest: NOSIGNATURE
\t\t[API]collective-1.16.5-2.58.jar                   |Collective                    |collective                    |2.58                |DONE      |Manifest: NOSIGNATURE
\t\t[AI??]specialai.jar                               |Special AI                    |specialai                     |1.16.5-1.0.1        |DONE      |Manifest: NOSIGNATURE
\t\t[????]OreExcavation.jar                           |Ore Excavation                |oreexcavation                 |1.8.157             |DONE      |Manifest: e7:68:1c:0d:b9:7e:cf:f8:f3:40:9c:84:c5:39:d7:a4:59:78:b0:6b:c3:fd:b7:4f:69:18:a3:88:e3:76:8c:3f
\t\t[????]ProjectExtended.jar                         |ProjectExtended               |projectextended               |1.2.0               |DONE      |Manifest: NOSIGNATURE
\t\t[??]cfm.jar                                       |MrCrayfish's Furniture Mod    |cfm                           |7.0.0-pre22         |DONE      |Manifest: NOSIGNATURE
\t\t[Architectury API] architectury-1.22.32-forge.jar |Architectury                  |architectury                  |1.22.32             |DONE      |Manifest: NOSIGNATURE
\t\t[API]ftb-gui-library-1605.2.1.41-forge.jar        |FTB GUI Library               |ftbguilibrary                 |1605.2.1.41         |DONE      |Manifest: NOSIGNATURE
\t\t[????? ??????]ItemPhysicFULL_v1.4.18_mc1.16.5.jar |ItemPhysic                    |itemphysic                    |1.6.0               |DONE      |Manifest: NOSIGNATURE
\t\t[API]cloth-config-4.11.26-forge.jar               |Cloth Config v4 API           |cloth-config                  |4.11.26             |DONE      |Manifest: NOSIGNATURE
\t\t[????][??????] FastLeafDecay-v25.jar              |FastLeafDecay                 |fastleafdecay                 |v25                 |DONE      |Manifest: NOSIGNATURE
\t\t[?????]PrettyBeaches_1.16.3-5.2.0.jar             |Pretty Beaches                |prettybeaches                 |5.2.0               |DONE      |Manifest: NOSIGNATURE
\t\t[YUNG?????] BetterMineshafts-Forge-1.16.4-2.0.4.ja|YUNG's Better Mineshafts      |bettermineshafts              |1.16.4-2.0.4        |DONE      |Manifest: NOSIGNATURE
\t\t[??]Cucumber.jar                                  |Cucumber Library              |cucumber                      |4.1.10              |DONE      |Manifest: NOSIGNATURE
\t\t[ftblib]ftb-library-forge-1605.3.2-build.64.jar   |FTB Library                   |ftblibrary                    |1605.3.2-build.64   |DONE      |Manifest: NOSIGNATURE
\t\t[ftb??]ftb-teams-forge-1605.2.1-build.20.jar      |FTB Teams                     |ftbteams                      |1605.2.1-build.20   |DONE      |Manifest: NOSIGNATURE
\t\t[???]pamhc2trees.jar                              |Pam's HarvestCraft 2 Fruit Tre|pamhc2trees                   |1.0.1               |DONE      |Manifest: NOSIGNATURE
\t\t[??]bmorph.jar                                    |Budschie's Morph Mod          |bmorph                        |1.16.5-1.4.1        |DONE      |Manifest: NOSIGNATURE
\t\t[??plus super ti pro xt]spiders-2.0-1.16.4-1.0.4.j|Spiders 2.0                   |spiderstpo                    |1.0.4               |DONE      |Manifest: NOSIGNATURE
\t\t[?????]CustomSkinLoader.jar                       |CustomSkinLoader              |customskinloader              |14.13-SNAPSHOT-282  |DONE      |Manifest: 4a:31:8b:cf:34:eb:d0:13:f3:19:39:d5:d2:b9:12:78:b5:f2:8d:91:3e:6f:8f:ed:97:48:00:69:e1:30:3a:54
\t\t[?????]jei.jar                                    |Just Enough Items             |jei                           |7.7.1.118           |DONE      |Manifest: NOSIGNATURE
\t\t[?????]item-filters-forge-1605.2.5-build.9.jar    |Item Filters                  |itemfilters                   |1605.2.5-build.9    |DONE      |Manifest: NOSIGNATURE
\t\t[????] InvMove-1.16.3-0.4.6.jar                   |InvMove                       |invmove                       |0.4.6               |DONE      |Manifest: NOSIGNATURE
\t\t[??]Hwyla.jar                                     |WAWLA                         |wawla                         |8.0.1               |DONE      |Manifest: eb:c4:b1:67:8b:f9:0c:db:dc:4f:01:b1:8e:61:64:39:4c:10:85:0b:a6:c4:c7:48:f0:fa:95:f2:cb:08:3a:e5
\t\t[R???]invtweaks.jar                               |Inventory Tweaks Renewed      |invtweaks                     |1.16.4-1.0.1        |DONE      |Manifest: NOSIGNATURE
\t\t[yung??????]BetterPortals-1.16.4-0.3.2.jar        |YUNG's Better Portals         |betterportals                 |1.16.4-0.3.2        |DONE      |Manifest: NOSIGNATURE
\t\t[????????????bug????????????????]shutupexperimenta|Shutup Experimental Settings! |shutupexperimentalsettings    |1.0.3               |DONE      |Manifest: NOSIGNATURE
\t\t[???]journeymap.jar                               |Journeymap                    |journeymap                    |5.7.3               |DONE      |Manifest: NOSIGNATURE
\t\t[?????]TravelersBackpack.jar                      |Traveler's Backpack           |travelersbackpack             |5.4.3               |DONE      |Manifest: NOSIGNATURE
\t\t[????] SereneSeasons-1.16.5-4.0.1.121-universal.ja|Serene Seasons                |sereneseasons                 |1.16.5-4.0.1.121    |DONE      |Manifest: NOSIGNATURE
\t\t[???]champions.jar                                |Champions                     |champions                     |1.16.5-2.0.1.7      |DONE      |Manifest: NOSIGNATURE
\t\t[??]DungeonCrawl.jar                              |Dungeon Crawl                 |dungeoncrawl                  |2.3.2               |DONE      |Manifest: NOSIGNATURE
\t\t[???]mahoutsukai.jar                              |Mahou Tsukai                  |mahoutsukai                   |1.16.5-v1.31.36     |DONE      |Manifest: NOSIGNATURE
\t\t[??]catalogue.jar                                 |Catalogue                     |catalogue                     |1.3.0               |DONE      |Manifest: NOSIGNATURE
\t\tforge-1.16.5-36.2.5-universal.jar                 |Forge                         |forge                         |36.2.5              |DONE      |Manifest: 22:af:21:d8:19:82:7f:93:94:fe:2b:ac:b7:e4:41:57:68:39:87:b1:a7:5c:c6:44:f9:25:74:21:14:f5:0d:90
\t\t[???] Ceramics-1.16.5-1.6.3.jar                   |Ceramics                      |ceramics                      |1.6.3               |DONE      |Manifest: NOSIGNATURE
\t\t[????]DynTranslation.jar                          |DynTranslation Mod            |dyntranslation                |beta-1.3.2          |DONE      |Manifest: NOSIGNATURE
\t\t[????]MysticalAgriculture.jar                     |Mystical Agriculture          |mysticalagriculture           |4.2.1               |DONE      |Manifest: NOSIGNATURE
\t\t[??????]MysticalAgradditions-1.16.5-4.2.0.jar     |Mystical Agradditions         |mysticalagradditions          |4.2.0               |DONE      |Manifest: NOSIGNATURE
\t\t[????]ironchest.jar                               |Iron Chests                   |ironchest                     |1.16.5-11.2.13      |DONE      |Manifest: NOSIGNATURE
\t\tforge-1.16.5-36.2.5-client.jar                    |Minecraft                     |minecraft                     |1.16.5              |DONE      |Manifest: NOSIGNATURE
\t\t[????]luckyblock.jar                              |Lucky Block                   |lucky                         |1.16.5-1            |DONE      |Manifest: NOSIGNATURE
\t\t[??]TConstruct.jar                                |Tinkers' Construct            |tconstruct                    |3.1.1.252           |DONE      |Manifest: NOSIGNATURE
\t\t[????]MouseTweaks.jar                             |Mouse Tweaks                  |mousetweaks                   |2.14                |DONE      |Manifest: NOSIGNATURE
\t\t[ftb??]ftb-quests-forge-1605.3.4-build.52.jar     |FTB Quests                    |ftbquests                     |1605.3.4-build.52   |DONE      |Manifest: NOSIGNATURE
\t\t[???]pamhc2crops.jar                              |Pam's HarvestCraft 2 Crops    |pamhc2crops                   |version             |DONE      |Manifest: NOSIGNATURE
\t\t[????] spidersproducewebs_1.16.5-1.4.jar          |Spiders Produce Webs          |spidersproducewebs            |1.4                 |DONE      |Manifest: NOSIGNATURE
\t\t[API]CreativeCore_v2.2.1_mc1.16.5.jar             |CreativeCore                  |creativecore                  |2.0.0               |DONE      |Manifest: NOSIGNATURE
\t\t[??????] Ding-1.16.5-1.3.0.jar                    |Ding                          |ding                          |1.3.0               |DONE      |Manifest: NOSIGNATURE
\t\t[bios-uefi]smoothboot-forge-1.16.4-1.2.2.jar      |Smooth Boot                   |smoothboot                    |1.16.4-1.2.2        |DONE      |Manifest: NOSIGNATURE
\t\t[?????]netherite_nugget-1.1.0.jar                 |Netherite Nuggets             |netherite_nugget              |1.1.0               |DONE      |Manifest: NOSIGNATURE
\t\t[??] Mantle-1.16.5-1.6.123.jar                    |Mantle                        |mantle                        |1.6.123             |DONE      |Manifest: NOSIGNATURE
\t\t[???]pamhc2foodcore.jar                           |Pam's HarvestCraft 2 Food Core|pamhc2foodcore                |version             |DONE      |Manifest: NOSIGNATURE
\t\t[??]StorageDrawers.jar                            |Storage Drawers               |storagedrawers                |8.3.0               |DONE      |Manifest: NOSIGNATURE
\t\t[????]torcherino.jar                              |Torcherino                    |torcherino                    |14.0.0              |DONE      |Manifest: NOSIGNATURE
\t\t[????] ToughAsNails-1.16.5-4.1.0.9-universal.jar  |Tough As Nails                |toughasnails                  |1.16.5-4.0.1.8      |DONE      |Manifest: NOSIGNATURE
\t\t[JEI??]JustEnoughCharacters.jar                   |Just Enough Characters        |jecharacters                  |1.16.4-4.3.1        |DONE      |Manifest: NOSIGNATURE
\t\t[?????] simplytea-1.16.5-2.4.0.jar                |Simply Tea                    |simplytea                     |2.4.0               |DONE      |Manifest: NOSIGNATURE
\t\t[????] InstantLava_Forge1.16.1-1.2.2.jar          |InstantLava                   |instantlava                   |1.2.2               |DONE      |Manifest: NOSIGNATURE
\t\t[???] appleskin-forge-mc1.16.x-2.1.0.jar          |AppleSkin                     |appleskin                     |mc1.16.4-2.1.0      |DONE      |Manifest: NOSIGNATURE
\t\t[??]ferritecore.jar                               |Ferrite Core                  |ferritecore                   |2.0.5               |DONE      |Manifest: 41:ce:50:66:d1:a0:05:ce:a1:0e:02:85:9b:46:64:e0:bf:2e:cf:60:30:9a:fe:0c:27:e0:63:66:9a:84:ce:8a
\t\t[????][??????] durabilityviewer-1.16.4-forge35.0.7|Giselbaers Durability Viewer  |durabilityviewer              |1.16.4-forge35.0.7-1|DONE      |Manifest: NOSIGNATURE
\t\t[????]enhancedcelestials.jar                      |Enhanced Celestials           |enhancedcelestials            |1.0.4-1.16.4        |DONE      |Manifest: NOSIGNATURE
\t\t[????]Aquaculture.jar                             |Aquaculture 2                 |aquaculture                   |1.16.5-2.1.20       |DONE      |Manifest: NOSIGNATURE
\t\t[????]farmerstea-1.16.5-1.2.jar                   |Farmer's Tea                  |farmerstea                    |1.16.5-1.2          |DONE      |Manifest: NOSIGNATURE
\tCrash Report UUID: f52f331b-cc6a-4925-a6ab-5836fe16f40d
\tPatchouli open book context: n/a
\tSuspected Mods: Forge (forge), Forge (forge), Champions (champions), Champions (champions), Champions (champions)
\tPlayer Count: 1 / 8; [ServerPlayerEntity['??'/145, l='ServerLevel[????]', x=150.50, y=4.00, z=127.50]]
\tData Packs: vanilla, mod:notenoughcrashes, mod:gokistats, mod:blood_particles (incompatible), mod:inventoryprofiles (incompatible), mod:betterf3forge, mod:slashblade (incompatible), mod:projecte, mod:dynamiclights, mod:guideapi-vp, mod:neat (incompatible), mod:enhancedvisuals, mod:i18nupdatemod, mod:reauth, mod:yungsapi, mod:culinaryconstruct (incompatible), mod:mutantbeasts (incompatible), mod:bookshelf, mod:guardvillagers, mod:ore_tree, mod:simpleplanes, mod:waila, mod:fpsreducer, mod:jeresources, mod:pvz (incompatible), mod:neoultracraft, mod:farmersdelight, mod:biomesoplenty, mod:betterdrowning (incompatible), mod:chunkanimator, mod:editsign, mod:supermartijn642corelib, mod:simplylight, mod:fishingreal (incompatible), mod:mysticaladaptations (incompatible), mod:combat_music, mod:ttigraas, mod:patchouli (incompatible), mod:collective, mod:specialai, mod:oreexcavation, mod:projectextended, mod:cfm (incompatible), mod:architectury, mod:ftbguilibrary (incompatible), mod:itemphysic, mod:cloth-config (incompatible), mod:fastleafdecay (incompatible), mod:prettybeaches (incompatible), mod:bettermineshafts, mod:cucumber, mod:ftblibrary, mod:ftbteams, mod:pamhc2trees (incompatible), mod:bmorph, mod:spiderstpo, mod:customskinloader (incompatible), mod:jei, mod:itemfilters, mod:invmove (incompatible), mod:wawla, mod:invtweaks (incompatible), mod:betterportals, mod:shutupexperimentalsettings (incompatible), mod:journeymap (incompatible), mod:travelersbackpack (incompatible), mod:sereneseasons, mod:champions (incompatible), mod:dungeoncrawl, mod:mahoutsukai (incompatible), mod:catalogue, mod:forge, mod:ceramics (incompatible), mod:dyntranslation, mod:mysticalagriculture, mod:mysticalagradditions, mod:ironchest, mod:lucky (incompatible), mod:tconstruct, mod:mousetweaks, mod:ftbquests, mod:pamhc2crops (incompatible), mod:spidersproducewebs, mod:creativecore, mod:ding, mod:smoothboot, mod:netherite_nugget, mod:mantle (incompatible), mod:pamhc2foodcore (incompatible), mod:storagedrawers (incompatible), mod:torcherino, mod:toughasnails, mod:jecharacters (incompatible), mod:simplytea (incompatible), mod:instantlava (incompatible), mod:appleskin, mod:ferritecore (incompatible), mod:durabilityviewer (incompatible), mod:enhancedcelestials, mod:aquaculture (incompatible), mod:farmerstea
\tType: Integrated Server (map_client.txt)
\tIs Modded: Definitely; Client brand changed to 'forge'
\tOptiFine Version: OptiFine_1.16.5_HD_U_G8
\tOptiFine Build: 20210515-161946
\tRender Distance Chunks: 2
\tMipmaps: 4
\tAnisotropic Filtering: 1
\tAntialiasing: 0
\tMultitexture: false
\tShaders: null
\tOpenGlVersion: 2.1 gl4es wrapper 1.1.2
\tOpenGlRenderer: GL4ES wrapper
\tOpenGlVendor: ptitSeb
\tCpuCount: 8
\tClient Crashes Since Restart: 0
\tIntegrated Server Crashes Since Restart: 1`