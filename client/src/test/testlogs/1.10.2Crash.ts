export const OnePointTenForgeCrash = `---- Minecraft Crash Report ----

WARNING: coremods are present:
  AppleCore (AppleCore-mc1.10.2-1.3.5.jar)
  EnderCorePlugin (EnderCore-1.10.2-0.4.1.41-beta.jar)
  IC2core (industrialcraft-2-2.6.23-ex110.jar)
  LoadingPlugin (ResourceLoader-MC1.9.4-1.5.1.jar)
  NWRTweak (redstonepaste-mc1.9.4-1.7.4.jar)
  SpongeCoremod (spongeforge-1.10.2-2026-5.0.0-BETA-1619.jar)
  LoadingPluginBuildingBricks (BuildingBricks-1.10.2-2.0.12.jar)
  LoadingPlugin (RandomThings-MC1.10-3.7.4.jar)
  LoadingPlugin (Quark-beta-49.jar)
  LoadingPlugin (CustomMainMenu-MC1.9.4-2.0.1.jar)
  llibrary (llibrary-1.4.2-1.10.2.jar)
  FMLPlugin (InventoryTweaks-1.61-58.jar)
  MalisisCorePlugin (malisiscore-1.9.4-4.0.2.jar)
  CorePlugin (FluxedRedstone-2.2.1.44.jar)
  ShetiPhian-ASM (shetiphiancore-1.10.0-3.3.0.jar)
Contact their authors BEFORE contacting forge

// Surprise! Haha. Well, this is awkward.

Time: 7/30/16 12:53 AM
Description: Exception initializing level

java.lang.NullPointerException: Exception initializing level
\tat org.spongepowered.mod.event.SpongeModEventManager.post(SpongeModEventManager.java:358)
\tat org.spongepowered.mod.event.SpongeModEventManager.post(SpongeModEventManager.java:337)
\tat org.spongepowered.mod.event.SpongeModEventManager.post(SpongeModEventManager.java:382)
\tat org.spongepowered.mod.event.SpongeModEventManager.post(SpongeModEventManager.java:367)
\tat org.spongepowered.common.SpongeImpl.postEvent(SpongeImpl.java:138)
\tat org.spongepowered.common.event.SpongeCommonEventFactory.callNotifyNeighborEvent(SpongeCommonEventFactory.java:267)
\tat net.minecraft.world.WorldServer.func_175685_c(WorldServer.java:1090)
\tat net.minecraft.world.World.func_175722_b(World.java:421)
\tat org.spongepowered.common.event.tracking.CauseTracker.setBlockState(CauseTracker.java:359)
\tat net.minecraft.world.WorldServer.func_180501_a(WorldServer.java:999)
\tat net.minecraft.world.World.func_175656_a(World.java:406)
\tat team.chisel.common.util.GenerationHandler.replace(GenerationHandler.java:97)
\tat team.chisel.common.util.GenerationHandler.onLavaLakes(GenerationHandler.java:76)
\tat net.minecraftforge.fml.common.eventhandler.ASMEventHandler_84_GenerationHandler_onLavaLakes_Post.invoke(.dynamic)
\tat net.minecraftforge.fml.common.eventhandler.ASMEventHandler.invoke(ASMEventHandler.java:72)
\tat net.minecraftforge.fml.common.eventhandler.EventBus.post(EventBus.java:129)
\tat net.minecraftforge.fml.common.eventhandler.EventBus.post(EventBus.java:98)
\tat org.spongepowered.mod.world.gen.SpongeChunkGeneratorForge.func_185931_b(SpongeChunkGeneratorForge.java:231)
\tat net.minecraft.world.chunk.Chunk.func_186034_a(Chunk.java:1000)
\tat net.minecraft.world.chunk.Chunk.func_186030_a(Chunk.java:974)
\tat net.minecraft.world.gen.ChunkProviderServer.func_186025_d(ChunkProviderServer.java:154)
\tat net.minecraft.world.World.func_72964_e(World.java:301)
\tat net.minecraft.world.World.func_175726_f(World.java:296)
\tat net.minecraft.world.World.func_180495_p(World.java:840)
\tat net.minecraft.world.World.func_175623_d(World.java:221)
\tat net.minecraft.world.World.func_184141_c(World.java:201)
\tat net.minecraft.world.WorldProvider.func_76566_a(WorldProvider.java:67)
\tat net.minecraft.world.WorldServer.func_73052_b(WorldServer.java:949)
\tat net.minecraft.world.WorldServer.func_72963_a(WorldServer.java:871)
\tat org.spongepowered.common.world.WorldManager.createWorldFromProperties(WorldManager.java:769)
\tat org.spongepowered.common.world.WorldManager.loadAllWorlds(WorldManager.java:728)
\tat net.minecraft.server.MinecraftServer.func_71247_a(MinecraftServer.java:323)
\tat net.minecraft.server.dedicated.DedicatedServer.func_71197_b(DedicatedServer.java:266)
\tat net.minecraft.server.MinecraftServer.run(MinecraftServer.java:431)
\tat java.lang.Thread.run(Thread.java:745)


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Server thread
Stacktrace:
\tat org.spongepowered.mod.event.SpongeModEventManager.post(SpongeModEventManager.java:358)
\tat org.spongepowered.mod.event.SpongeModEventManager.post(SpongeModEventManager.java:337)
\tat org.spongepowered.mod.event.SpongeModEventManager.post(SpongeModEventManager.java:382)
\tat org.spongepowered.mod.event.SpongeModEventManager.post(SpongeModEventManager.java:367)
\tat org.spongepowered.common.SpongeImpl.postEvent(SpongeImpl.java:138)
\tat org.spongepowered.common.event.SpongeCommonEventFactory.callNotifyNeighborEvent(SpongeCommonEventFactory.java:267)
\tat net.minecraft.world.WorldServer.func_175685_c(WorldServer.java:1090)
\tat net.minecraft.world.World.func_175722_b(World.java:421)
\tat org.spongepowered.common.event.tracking.CauseTracker.setBlockState(CauseTracker.java:359)
\tat net.minecraft.world.WorldServer.func_180501_a(WorldServer.java:999)
\tat net.minecraft.world.World.func_175656_a(World.java:406)
\tat team.chisel.common.util.GenerationHandler.replace(GenerationHandler.java:97)
\tat team.chisel.common.util.GenerationHandler.onLavaLakes(GenerationHandler.java:76)
\tat net.minecraftforge.fml.common.eventhandler.ASMEventHandler_84_GenerationHandler_onLavaLakes_Post.invoke(.dynamic)
\tat net.minecraftforge.fml.common.eventhandler.ASMEventHandler.invoke(ASMEventHandler.java:72)
\tat net.minecraftforge.fml.common.eventhandler.EventBus.post(EventBus.java:129)
\tat net.minecraftforge.fml.common.eventhandler.EventBus.post(EventBus.java:98)
\tat org.spongepowered.mod.world.gen.SpongeChunkGeneratorForge.func_185931_b(SpongeChunkGeneratorForge.java:231)
\tat net.minecraft.world.chunk.Chunk.func_186034_a(Chunk.java:1000)
\tat net.minecraft.world.chunk.Chunk.func_186030_a(Chunk.java:974)
\tat net.minecraft.world.gen.ChunkProviderServer.func_186025_d(ChunkProviderServer.java:154)
\tat net.minecraft.world.World.func_72964_e(World.java:301)
\tat net.minecraft.world.World.func_175726_f(World.java:296)
\tat net.minecraft.world.World.func_180495_p(World.java:840)
\tat net.minecraft.world.World.func_175623_d(World.java:221)
\tat net.minecraft.world.World.func_184141_c(World.java:201)
\tat net.minecraft.world.WorldProvider.func_76566_a(WorldProvider.java:67)
\tat net.minecraft.world.WorldServer.func_73052_b(WorldServer.java:949)

-- Affected level --
Details:
\tLevel name: world
\tAll players: 0 total; []
\tChunk stats: ServerChunkCache: 10 Drop: 0
\tLevel seed: -3636444602671937399
\tLevel generator: ID 10 - quark_realistic, ver 0. Features enabled: true
\tLevel generator options: 
\tLevel spawn location: World: (0,0,0), Chunk: (at 0,0,0 in 0,0; contains blocks 0,0,0 to 15,255,15), Region: (0,0; contains chunks 0,0 to 31,31, blocks 0,0,0 to 511,255,511)
\tLevel time: 0 game time, 0 day time
\tLevel dimension: 0
\tLevel storage version: 0x00000 - Unknown?
\tLevel weather: Rain time: 0 (now: false), thunder time: 0 (now: false)
\tLevel game mode: Game mode: survival (ID 0). Hardcore: false. Cheats: false
Stacktrace:
\tat net.minecraft.world.WorldServer.func_72963_a(WorldServer.java:871)
\tat org.spongepowered.common.world.WorldManager.createWorldFromProperties(WorldManager.java:769)
\tat org.spongepowered.common.world.WorldManager.loadAllWorlds(WorldManager.java:728)
\tat net.minecraft.server.MinecraftServer.func_71247_a(MinecraftServer.java:323)
\tat net.minecraft.server.dedicated.DedicatedServer.func_71197_b(DedicatedServer.java:266)
\tat net.minecraft.server.MinecraftServer.run(MinecraftServer.java:431)
\tat java.lang.Thread.run(Thread.java:745)

-- System Details --
Details:
\tMinecraft Version: 1.10.2
\tOperating System: Linux (amd64) version 3.16.0-4-amd64
\tJava Version: 1.8.0_91, Oracle Corporation
\tJava VM Version: Java HotSpot(TM) 64-Bit Server VM (mixed mode), Oracle Corporation
\tMemory: 6727432208 bytes (6415 MB) / 8089763840 bytes (7715 MB) up to 8089763840 bytes (7715 MB)
\tJVM Flags: 2 total; -Xmx8000M -Xms8000M
\tIntCache: cache: 0, tcache: 0, allocated: 12, tallocated: 94
\tFML: MCP 9.32 Powered by Forge 12.18.1.2031 106 mods loaded, 106 mods active
\tStates: 'U' = Unloaded 'L' = Loaded 'C' = Constructed 'H' = Pre-initialized 'I' = Initialized 'J' = Post-initialized 'A' = Available 'D' = Disabled 'E' = Errored
\tUCHIJAA\tmcp{9.19} [Minecraft Coder Pack] (minecraft.jar) 
\tUCHIJAA\tFML{8.0.99.99} [Forge Mod Loader] (forge.jar) 
\tUCHIJAA\tForge{12.18.1.2031} [Minecraft Forge] (forge.jar) 
\tUCHIJAA\tbuildingbrickshooks{1.10.2-2.0.12} [Building Bricks Hooks] (minecraft.jar) 
\tUCHIJAA\tsponge{1.10.2-2026-5.0.0-BETA-1619} [SpongeForge] (spongeforge-1.10.2-2026-5.0.0-BETA-1619.jar) 
\tUCHIJAA\tadvancedswords{1.3.0} [Advanced Swords] (advancedswords-1.3.0-[1.9.4].jar) 
\tUCHIJAA\tadvancedaddons{1.1.0} [Advanced Addons] (advancedaddons-1.1.0-[1.9.4].jar) 
\tUCHIJAA\tagriculturalexpansion{r-1.2.0} [Agricultural Expansion] (AgriculturalExpansion[1.9.4][1.10.2]r-1.2.0.jar) 
\tUCHIJAA\tExtraUtils2{1.0} [ExtraUtils2] (extrautils2-1.10.2-alpha-1.0.1.jar) 
\tUCHIJAA\tJEI{3.7.8.234} [Just Enough Items] (jei_1.10.2-3.7.8.234.jar) 
\tUCHIJAA\tAppleCore{1.3.5} [AppleCore] (AppleCore-mc1.10.2-1.3.5.jar) 
\tUCHIJAA\tbaconators{3.0.3} [Baconators] (baconators-1.10.2-3.0.3.jar) 
\tUCHIJAA\tbagginses{2.4.2d} [Bagginses] (Bagginses-1.10-3.0.3.jar) 
\tUCHIJAA\tbasemetals{2.3.2} [Base Metals] (BaseMetals_1.9.4-2.3.2.6.jar) 
\tUCHIJAA\tgolems{5.01} [Extra Golems] (ExtraGolems[1.9.4]-5.01.jar) 
\tUCHIJAA\tgolems_metal{4.03.1} [Base Metal Golems] (BaseMetalGolems[1.9.4]-5.01.1.jar) 
\tUCHIJAA\tbdlib{1.12.0.2} [BD Lib] (bdlib-1.12.0.2-mc1.10.2.jar) 
\tUCHIJAA\tBetterAchievements{0.3.0.30} [Better Achievements] (BetterAchievements-1.10.2-0.3.0.30.jar) 
\tUCHIJAA\tbetteragriculture{0.16} [Better Agriculture] (BetterAgriculture_(MC-1.10)-0.16.jar) 
\tUCHIJAA\tbetterbuilderswands{0.6.5} [Better Builder's Wands] (BetterBuildersWands-0.6.5-1.10r138+8595fc7.jar) 
\tUCHIJAA\tbookshelf{1.3.0.282} [Bookshelf] (Bookshelf-1.10.2-1.3.0.282.jar) 
\tUCHIJAA\tQuark{beta-49} [Quark] (Quark-beta-49.jar) 
\tUCHIJAA\tbuildingbricks{1.10.2-2.0.12} [Building Bricks] (BuildingBricks-1.10.2-2.0.12.jar) 
\tUCHIJAA\tChameleon{1.9.4-2.1.6} [Chameleon] (Chameleon-1.9.4-2.1.6.jar) 
\tUCHIJAA\tchisel{MC1.9.4-0.0.6.33} [Chisel] (Chisel-MC1.9.4-0.0.6.33.jar) 
\tUCHIJAA\tmcmultipart{1.2.0} [MCMultiPart] (MCMultiPart-1.2.0-universal.jar) 
\tUCHIJAA\tchiselsandbits{11.7} [Chisels & Bits] (chiselsandbits-11.7.jar) 
\tUCHIJAA\tcosmeticarmorreworked{1.10.2-v1a} [CosmeticArmorReworked] (CosmeticArmorReworked-1.10.2-v1a.jar) 
\tUCHIJAA\tMineTweaker3{3.0.10} [MineTweaker 3] (CraftTweaker-1.10.2-3.0.10.jar) 
\tUCHIJAA\twonderfulwands{2.1.0} [Wonderful Wands] (CyanosWonderfulWands_1.9.4-2.1.0.jar) 
\tUCHIJAA\tWaila{1.7.0} [Waila] (Waila-1.7.0-B3_1.9.4.jar) 
\tUCHIJAA\tDarkUtils{1.1.3.67} [Dark Utilities] (DarkUtilities-1.10.2-1.1.3.70.jar) 
\tUCHIJAA\tpoweradvantage{2.2.1} [Power Advantage] (PowerAdvantage_1.9.4-2.2.1.jar) 
\tUCHIJAA\telectricadvantage{2.1.0} [Electric Advantage] (ElectricAdvantage_1.9-2.1.0.jar) 
\tUCHIJAA\tendercore{1.10.2-0.4.1.41-beta} [EnderCore] (EnderCore-1.10.2-0.4.1.41-beta.jar) 
\tUCHIJAA\tEnderIO{1.10.2-3.0.1.75_beta} [Ender IO] (EnderIO-1.10.2-3.0.1.75_beta.jar) 
\tUCHIJAA\tshetiphiancore{3.3.0} [ShetiPhian-Core] (shetiphiancore-1.10.0-3.3.0.jar) 
\tUCHIJAA\tendertanks{1.4.1} [EnderTanks] (endertanks-1.10.0-1.4.1.jar) 
\tUCHIJAA\tmodernmetals{0.11.0} [Modern Metals] (ModernMetals-0.11.0.jar) 
\tUCHIJAA\tendmetals{1.0.4} [End Metals] (EndMetals_1.9-1.0.4.jar) 
\tUCHIJAA\tfastleafdecay{v11} [Fast Leaf Decay] (FastLeafDecay-v11.jar) 
\tUCHIJAA\tSonarCore{3.0.7} [SonarCore] (SonarCore-1.9.4-3.0.7.jar) 
\tUCHIJAA\tFluxNetworks{1.0.1} [Flux Networks] (Flux-Networks-1.9.4-1.0.1.jar) 
\tUCHIJAA\treborncore{2.5.5.3} [RebornCore] (RebornCore-1.10.2-2.5.5.3-universal.jar) 
\tUCHIJAA\treborncore-mcmultipart{2.5.5.3} [reborncore-MCMultiPart] (RebornCore-1.10.2-2.5.5.3-universal.jar) 
\tUCHIJAA\tTesla{1.2.0.38} [TESLA] (Tesla-1.10.2-1.2.0.38.jar) 
\tUCHIJAA\tfluxedredstone{2.2.1.44} [FluxedRedstone] (FluxedRedstone-2.2.1.44.jar) 
\tUCHIJAA\tftbl{2.1.0} [FTBLib] (FTBLib-1.9.4-2.1.0-pre2.jar) 
\tUCHIJAA\tftbu{2.1.0} [FTBUtilities] (FTBUtilities-1.9.4-2.1.0-pre2.jar) 
\tUCHIJAA\tSilentLib{1.0.12} [Silent Lib] (SilentLib-1.9.4-1.0.12-20.jar) 
\tUCHIJAA\tFunOres{1.2.7} [Fun Ores] (FunOres-1.10-1.2.7-68.jar) 
\tUCHIJAA\tfyrestone{0.6.5.0} [Fyrestone] (fyrestone-0.6.5.0.jar) 
\tUCHIJAA\tIC2{2.6.23-ex110} [IndustrialCraft 2] (industrialcraft-2-2.6.23-ex110.jar) 
\tUCHIJAA\tadvgenerators{0.9.20.4} [Advanced Generators] (generators-0.9.20.4-mc1.10.2.jar) 
\tUCHIJAA\tgeo{0.0.3} [Geology Mod] (geologymod-0.0.3.jar) 
\tUCHIJAA\tgravestone{1.5.4} [Gravestone] (GraveStone Mod 1.5.4.jar) 
\tUCHIJAA\tgriefprevention{1.1.0} [GriefPrevention] (griefprevention-1.10.2-1.1.0.49.jar) 
\tUCHIJAA\tguideapi{@VERSION@} [Guide-API] (Guide-API-1.9.4-2.0.0-40.jar) 
\tUCHIJAA\tshadowmc{3.4.4} [ShadowMC] (ShadowMC-1.10.2-3.4.4.jar) 
\tUCHIJAA\tInductionCharger{1.1.1} [Induction Charger] (InductionCharger-1.10.2-1.1.1.jar) 
\tUCHIJAA\tinventorytweaks{1.61-58-a1fd884} [Inventory Tweaks] (InventoryTweaks-1.61-58.jar) 
\tUCHIJAA\tIronChest{7.0.7.795} [Iron Chest] (ironchest-1.10.2-7.0.7.795.jar) 
\tUCHIJAA\tjourneymap{1.10.2-5.2.4} [JourneyMap] (journeymap-1.10.2-5.2.4-unlimited.jar) 
\tUCHIJAA\tllibrary{1.4.2} [LLibrary] (llibrary-1.4.2-1.10.2.jar) 
\tUCHIJAA\tmagicpab{0.0.1} [Magical Potions And Brews] (magicalpotionsandbrews-0.1.7.jar) 
\tUCHIJAA\tmalisiscore{1.9.4-4.0.2} [MalisisCore] (malisiscore-1.9.4-4.0.2.jar) 
\tUCHIJAA\tmalisisdoors{1.9.4-5.0.1} [MalisisDoors] (malisisdoors-1.9.4-5.0.1.jar) 
\tUCHIJAA\tmikedongles{0.2.2} [Mike Dongles] (MikeDongles-0.2.2-MC[1.9.4-1.10-1.10.2].jar) 
\tUCHIJAA\tmultistorage{1.2.1} [Multi-Storage] (multistorage-1.10.0-1.2.1.jar) 
\tUCHIJAA\tnaturesgift{1.10.2-2011-0.6} [NaturesGift] (naturesgift-0.6.jar) 
\tUCHIJAA\tnethermetals{1.1.2} [Nether Metals] (NetherMetals_1.9-1.1.2.jar) 
\tUCHIJAA\tyurtmod{7.01} [Nomadic Tents] (NomadicTents[1.10.2]-7.01.jar) 
\tUCHIJAA\tnotenoughwands{1.3.5} [Not Enough Wands] (notenoughwands-1.9.4-1.3.5.jar) 
\tUCHIJAA\tnucleus{0.6.0-5.0} [Nucleus] (Nucleus-0.6.0-S5.0-MC-1.10.jar) 
\tUCHIJAA\tfodc{1.9.1} [Ore Dictionary Converter] (OreDictionaryConverter-1.9.1.jar) 
\tUCHIJAA\torespawn{1.0.3} [Ore Spawn] (OreSpawn_1.9.4-1.0.3.jar) 
\tUCHIJAA\tharvestcraft{1.9.4-pre} [Pam's HarvestCraft] (Pam's HarvestCraft 1.9.4-1.10.2a.jar) 
\tUCHIJAA\tninja.leaping.permissionsex{2.0-SNAPSHOT} [PermissionsEx] (PermissionsEx-Sponge (1).jar) 
\tUCHIJAA\tProjectE{1.9.4-PE1.0.4B} [ProjectE] (ProjectE-1.9.4-PE1.0.4B.jar) 
\tUCHIJAA\tcom.gmail.trentech.pjp{0.12.3} [Project Portals] (projectportals-5.0.0-0.12.3.jar) 
\tUCHIJAA\tquantumflux{2.0.7} [QuantumFlux] (quantumflux-1.9.4-2.0.7.jar) 
\tUCHIJAA\trandomthings{3.7.4} [Random Things] (RandomThings-MC1.10-3.7.4.jar) 
\tUCHIJAA\tredstonepaste{1.7.4} [Redstone Paste] (redstonepaste-mc1.9.4-1.7.4.jar) 
\tUCHIJAA\tStorageDrawers{1.9.4-3.2.1} [Storage Drawers] (StorageDrawers-1.9.4-3.2.1.jar) 
\tUCHIJAA\trefinedstorage{0.8.12} [Refined Storage] (refinedstorage-0.8.12.jar) 
\tUCHIJAA\trftools{5.08} [RFTools] (rftools-1.10-5.08.jar) 
\tUCHIJAA\tSilentGems{2.0.23} [Silent's Gems] (SilentsGems-1.10.2-2.0.23-52.jar) 
\tUCHIJAA\tSGExtraParts{1.0.3} [Silent's Gems: Extra Parts] (SGExtraParts-1.9.4-1.0.3-4.jar) 
\tUCHIJAA\tValkyrieLib{1.10.2-0.10.2} [Valkyrie Lib] (valkyrielib-1.10.2-0.10.2.jar) 
\tUCHIJAA\tSimpleGenerators{1.10-0.7.1a} [Simple Generators] (simplegenerators-1.10-0.7.1a.jar) 
\tUCHIJAA\tSolarFluxReborn{1.9.4_0.7b} [Solar Flux Reborn] (SolarFluxReborn-1.9.4_0.7b.jar) 
\tUCHIJAA\tsolarvillage{1.1.0.15} [Solar Village] (SolarVillage-1.10.2-1.1.0.19.jar) 
\tUCHIJAA\tsteamadvantage{2.1.0} [Steam Advantage] (SteamAdvantage_1.9.4-2.1.0.jar) 
\tUCHIJAA\tstoragenetwork{1.12.6} [Storage Network] (StorageNetwork-1.9.4-1.12.6.jar) 
\tUCHIJAA\tSuperMultiDrills{1.4.1} [Super Multi-Drills] (SuperMultiDrills-1.10.2-1.4.1-28.jar) 
\tUCHIJAA\tsupersticksword{0.3.0.0} [Super Stick Sword] (supersticksword-0.3.0.0.jar) 
\tUCHIJAA\tteslaarsenal{1.2} [Tesla Arsenal] (TeslaArsenal-1.2.jar) 
\tUCHIJAA\tteslacoils{v0.2.0.0} [Tesla Coils] (teslacoils-0.2.0.0.jar) 
\tUCHIJAA\ttheoneprobe{1.0.13} [The One Probe] (theoneprobe-1.10-1.0.13.jar) 
\tUCHIJAA\ttoolheadswapper{1.10.2-r2} [Tool Head Swapper] (ToolHeadSwapper-1.10.2-r2.jar) 
\tUCHIJAA\ttrashslot{6.3.2} [TrashSlot] (TrashSlot_1.10.2-6.3.2.jar) 
\tUCHIJAA\tVeinMiner{0.34.1_1.9-73be663} [Vein Miner] (VeinMiner-0.34.1-1.9r571+73be663.jar) 
\tUCHIJAA\tVeinMinerModSupport{0.34.1_1.9-73be663} [Mod Support] (VeinMiner-0.34.1-1.9r571+73be663.jar) 
\tUCHIJAA\tWailaHarvestability{1.1.7} [Waila Harvestability] (WailaHarvestability-mc1.10-1.1.7.jar) 
\tUCHIJAA\tICSE{1.1.0.0} [I Can See Everything] (Wawla-1.10.2-2.3.0.197.jar) 
\tUCHIJAA\twawla{2.3.0.194} [What Are We Looking At] (Wawla-1.10.2-2.3.0.197.jar) 
\tLoaded coremods (and transformers): 
AppleCore (AppleCore-mc1.10.2-1.3.5.jar)
  squeek.applecore.asm.TransformerModuleHandler
EnderCorePlugin (EnderCore-1.10.2-0.4.1.41-beta.jar)
  com.enderio.core.common.transform.EnderCoreTransformer
IC2core (industrialcraft-2-2.6.23-ex110.jar)
  
LoadingPlugin (ResourceLoader-MC1.9.4-1.5.1.jar)
  lumien.resourceloader.asm.ClassTransformer
NWRTweak (redstonepaste-mc1.9.4-1.7.4.jar)
  net.fybertech.nwr.NWRTransformer
SpongeCoremod (spongeforge-1.10.2-2026-5.0.0-BETA-1619.jar)
  org.spongepowered.common.launch.transformer.SpongeSuperclassTransformer
LoadingPluginBuildingBricks (BuildingBricks-1.10.2-2.0.12.jar)
  com.hea3ven.buildingbricks.core.load.ClassTransformerBuildingBricks
LoadingPlugin (RandomThings-MC1.10-3.7.4.jar)
  lumien.randomthings.asm.ClassTransformer
LoadingPlugin (Quark-beta-49.jar)
  vazkii.quark.base.asm.ClassTransformer
LoadingPlugin (CustomMainMenu-MC1.9.4-2.0.1.jar)
  lumien.custommainmenu.asm.ClassTransformer
llibrary (llibrary-1.4.2-1.10.2.jar)
  net.ilexiconn.llibrary.server.asm.LLibraryPlugin
FMLPlugin (InventoryTweaks-1.61-58.jar)
  invtweaks.forge.asm.ContainerTransformer
MalisisCorePlugin (malisiscore-1.9.4-4.0.2.jar)
  net.malisis.core.util.chunkcollision.ChunkCollisionTransformer
  net.malisis.core.util.chunkblock.ChunkBlockTransformer
  net.malisis.core.renderer.transformer.MalisisRendererTransformer
  net.malisis.core.renderer.icon.asm.TextureMapTransformer
  net.malisis.core.util.clientnotif.ClientNotifTransformer
CorePlugin (FluxedRedstone-2.2.1.44.jar)
  
ShetiPhian-ASM (shetiphiancore-1.10.0-3.3.0.jar)
  shetiphian.core.asm.ClassTransformer
\tList of loaded APIs: 
\t\t* AppleCoreAPI (2.1.0) from AppleCore-mc1.10.2-1.3.5.jar
\t\t* BetterAchievements|API (0.3.0.30) from BetterAchievements-1.10.2-0.3.0.30.jar
\t\t* ChiselAPI (0.0.1) from Chisel-MC1.9.4-0.0.6.33.jar
\t\t* ChiselAPI|Carving (0.0.1) from Chisel-MC1.9.4-0.0.6.33.jar
\t\t* ChiselsAndBitsAPI (11.7.0) from chiselsandbits-11.7.jar
\t\t* CoFHAPI (1.8.9R1.2.0B1) from SolarFluxReborn-1.9.4_0.7b.jar
\t\t* CoFHAPI|core (1.8.9R1.2.0B1) from valkyrielib-1.10.2-0.10.2.jar
\t\t* CoFHAPI|energy (1.8.9R1.2.0B1) from RebornCore-1.10.2-2.5.5.3-universal.jar
\t\t* CoFHAPI|inventory (1.8.9R1.2.0B1) from valkyrielib-1.10.2-0.10.2.jar
\t\t* CoFHAPI|item (1.8.9R1.2.0B1) from valkyrielib-1.10.2-0.10.2.jar
\t\t* EnderIOAPI (0.0.2) from EnderIO-1.10.2-3.0.1.75_beta.jar
\t\t* EnderIOAPI|Redstone (0.0.2) from EnderIO-1.10.2-3.0.1.75_beta.jar
\t\t* EnderIOAPI|Teleport (0.0.2) from EnderIO-1.10.2-3.0.1.75_beta.jar
\t\t* EnderIOAPI|Tools (0.0.2) from EnderIO-1.10.2-3.0.1.75_beta.jar
\t\t* FluxNetworkAPI (1.0.0) from Flux-Networks-1.9.4-1.0.1.jar
\t\t* FunOresAPI (3) from FunOres-1.10-1.2.7-68.jar
\t\t* Guide-API|API (1.9.4-2.0.0-40) from Guide-API-1.9.4-2.0.0-40.jar
\t\t* IC2API (1.0) from industrialcraft-2-2.6.23-ex110.jar
\t\t* jeresources|API (0.4.6.42) from JustEnoughResources-1.10.2-0.4.6.42.jar
\t\t* journeymap|client-api (1.2) from journeymap-1.10.2-5.2.4-unlimited.jar
\t\t* journeymap|client-api-display (1.2) from journeymap-1.10.2-5.2.4-unlimited.jar
\t\t* journeymap|client-api-event (1.2) from journeymap-1.10.2-5.2.4-unlimited.jar
\t\t* journeymap|client-api-model (1.2) from journeymap-1.10.2-5.2.4-unlimited.jar
\t\t* journeymap|client-api-util (1.2) from journeymap-1.10.2-5.2.4-unlimited.jar
\t\t* JustEnoughItemsAPI (4.0.0) from jei_1.10.2-3.7.8.234.jar
\t\t* McJtyLib (1.10-1.9.9) from mcjtylib-1.10-1.9.9.jar
\t\t* ProjectEAPI (1.9.4-1.0.0) from ProjectE-1.9.4-PE1.0.4B.jar
\t\t* reborncoreAPI (2.5.5.3) from RebornCore-1.10.2-2.5.5.3-universal.jar
\t\t* StorageDrawersAPI (1.7.10-1.2.0) from StorageDrawers-1.9.4-3.2.1.jar
\t\t* StorageDrawersAPI|config (1.7.10-1.2.0) from refinedstorage-0.8.12.jar
\t\t* StorageDrawersAPI|event (1.7.10-1.2.0) from refinedstorage-0.8.12.jar
\t\t* StorageDrawersAPI|inventory (1.7.10-1.2.0) from StorageDrawers-1.9.4-3.2.1.jar
\t\t* StorageDrawersAPI|pack (1.7.10-1.2.0) from refinedstorage-0.8.12.jar
\t\t* StorageDrawersAPI|registry (1.7.10-1.2.0) from StorageDrawers-1.9.4-3.2.1.jar
\t\t* StorageDrawersAPI|render (1.7.10-1.2.0) from StorageDrawers-1.9.4-3.2.1.jar
\t\t* StorageDrawersAPI|storage (1.7.10-1.2.0) from refinedstorage-0.8.12.jar
\t\t* StorageDrawersAPI|storage-attribute (1.7.10-1.2.0) from StorageDrawers-1.9.4-3.2.1.jar
\t\t* ValkyrieLib.api (1.10.2-0.10.2) from valkyrielib-1.10.2-0.10.2.jar
\t\t* VeinMinerApi (0.3) from VeinMiner-0.34.1-1.9r571+73be663.jar
\t\t* WailaAPI (1.3) from Waila-1.7.0-B3_1.9.4.jar
\tEnderIO: Found the following problem(s) with your installation (That does NOT mean that Ender IO caused the crash or was involved in it in any way. We add this information to help finding common problems, not as an invitation to post any crash you encounter to Ender IO's issue tracker.):
                 An unsupported base software is installed: 'sponge'. This is NOT supported.
                 This may (look up the meaning of 'may' in the dictionary if you're not sure what it means) have caused the error. Try reproducing the crash WITHOUT this/these mod(s) before reporting it.
\tDetailed RF API diagnostics:
                  * RF API class 'EnergyStorage' is loaded from: jar:file:/home/minecraft/multicraft/servers/server11/mods/mcjtylib-1.10-1.9.9.jar!/cofh/api/energy/EnergyStorage.class
                  * RF API class 'IEnergyConnection' is loaded from: jar:file:/home/minecraft/multicraft/servers/server11/mods/mcjtylib-1.10-1.9.9.jar!/cofh/api/energy/IEnergyConnection.class
                  * RF API class 'IEnergyContainerItem' is loaded from: jar:file:/home/minecraft/multicraft/servers/server11/mods/mcjtylib-1.10-1.9.9.jar!/cofh/api/energy/IEnergyContainerItem.class
                  * RF API class 'IEnergyHandler' is loaded from: jar:file:/home/minecraft/multicraft/servers/server11/mods/mcjtylib-1.10-1.9.9.jar!/cofh/api/energy/IEnergyHandler.class
                  * RF API class 'IEnergyProvider' is loaded from: jar:file:/home/minecraft/multicraft/servers/server11/mods/mcjtylib-1.10-1.9.9.jar!/cofh/api/energy/IEnergyProvider.class
                  * RF API class 'IEnergyReceiver' is loaded from: jar:file:/home/minecraft/multicraft/servers/server11/mods/mcjtylib-1.10-1.9.9.jar!/cofh/api/energy/IEnergyReceiver.class
                  * RF API class 'IEnergyStorage' is loaded from: jar:file:/home/minecraft/multicraft/servers/server11/mods/mcjtylib-1.10-1.9.9.jar!/cofh/api/energy/IEnergyStorage.class
                  * RF API class 'ItemEnergyContainer' is loaded from: jar:file:/home/minecraft/multicraft/servers/server11/mods/mcjtylib-1.10-1.9.9.jar!/cofh/api/energy/ItemEnergyContainer.class
                  * RF API class 'TileEnergyHandler' is loaded from: jar:file:/home/minecraft/multicraft/servers/server11/mods/mcjtylib-1.10-1.9.9.jar!/cofh/api/energy/TileEnergyHandler.class
                  * RF API class 'TileEnergyHandler' is loaded from: jar:file:/home/minecraft/multicraft/servers/server11/mods/mcjtylib-1.10-1.9.9.jar!/cofh/api/energy/TileEnergyHandler.class

\tProfiler Position: N/A (disabled)
\tPlayer Count: 0 / 50; []
\tIs Modded: Definitely; Server brand changed to 'fml,forge,sponge'
\tType: Dedicated Server (map_server.txt)`