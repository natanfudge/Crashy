export const OnePointTwelveForgeCrash = `---- Minecraft Crash Report ----
// There are four lights!

Time: 5/4/18 4:30 PM
Description: Ticking block entity

java.lang.NullPointerException: The validated object is null
\tat org.apache.commons.lang3.Validate.notNull(Validate.java:225)
\tat org.apache.commons.lang3.Validate.notNull(Validate.java:206)
\tat net.minecraft.util.NonNullList.set(SourceFile:49)
\tat thaumcraft.common.tiles.TileThaumcraftInventory.func_70299_a(TileThaumcraftInventory.java:71)
\tat thaumcraft.common.tiles.crafting.TileInfusionMatrix.inEvEjectItem(TileInfusionMatrix.java:535)
\tat thaumcraft.common.tiles.crafting.TileInfusionMatrix.craftCycle(TileInfusionMatrix.java:348)
\tat thaumcraft.common.tiles.crafting.TileInfusionMatrix.func_73660_a(TileInfusionMatrix.java:231)
\tat net.minecraft.world.World.func_72939_s(World.java:1832)
\tat net.minecraft.world.WorldServer.func_72939_s(WorldServer.java:613)
\tat net.minecraft.server.MinecraftServer.func_71190_q(MinecraftServer.java:765)
\tat net.minecraft.server.MinecraftServer.func_71217_p(MinecraftServer.java:666)
\tat net.minecraft.server.integrated.IntegratedServer.func_71217_p(IntegratedServer.java:185)
\tat net.minecraft.server.MinecraftServer.run(MinecraftServer.java:524)
\tat java.lang.Thread.run(Unknown Source)


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Server thread
Stacktrace:
\tat org.apache.commons.lang3.Validate.notNull(Validate.java:225)
\tat org.apache.commons.lang3.Validate.notNull(Validate.java:206)
\tat net.minecraft.util.NonNullList.set(SourceFile:49)
\tat thaumcraft.common.tiles.TileThaumcraftInventory.func_70299_a(TileThaumcraftInventory.java:71)
\tat thaumcraft.common.tiles.crafting.TileInfusionMatrix.inEvEjectItem(TileInfusionMatrix.java:535)
\tat thaumcraft.common.tiles.crafting.TileInfusionMatrix.craftCycle(TileInfusionMatrix.java:348)
\tat thaumcraft.common.tiles.crafting.TileInfusionMatrix.func_73660_a(TileInfusionMatrix.java:231)

-- Block entity being ticked --
Details:
\tName: thaumcraft:tileinfusionmatrix // thaumcraft.common.tiles.crafting.TileInfusionMatrix
\tBlock type: ID #415 (tile.infusion_matrix // thaumcraft.common.blocks.crafting.BlockInfusionMatrix)
\tBlock data value: 0 / 0x0 / 0b0000
\tBlock location: World: (-640,29,372), Chunk: (at 0,1,4 in -40,23; contains blocks -640,0,368 to -625,255,383), Region: (-2,0; contains chunks -64,0 to -33,31, blocks -1024,0,0 to -513,255,511)
\tActual block type: ID #415 (tile.infusion_matrix // thaumcraft.common.blocks.crafting.BlockInfusionMatrix)
\tActual block data value: 0 / 0x0 / 0b0000
Stacktrace:
\tat net.minecraft.world.World.func_72939_s(World.java:1832)
\tat net.minecraft.world.WorldServer.func_72939_s(WorldServer.java:613)

-- Affected level --
Details:
\tLevel name: New World
\tAll players: 1 total; [EntityPlayerMP['wamc2017'/30, l='New World', x=-636.55, y=27.75, z=373.30]]
\tChunk stats: ServerChunkCache: 625 Drop: 0
\tLevel seed: 5515707122656629367
\tLevel generator: ID 01 - flat, ver 0. Features enabled: false
\tLevel generator options: 3;minecraft:bedrock,20*minecraft:stone,5*minecraft:dirt,minecraft:grass;3;biome_1,decoration,stronghold,mineshaft,dungeon
\tLevel spawn location: World: (-625,4,379), Chunk: (at 15,0,11 in -40,23; contains blocks -640,0,368 to -625,255,383), Region: (-2,0; contains chunks -64,0 to -33,31, blocks -1024,0,0 to -513,255,511)
\tLevel time: 142657 game time, 7494 day time
\tLevel dimension: 0
\tLevel storage version: 0x04ABD - Anvil
\tLevel weather: Rain time: 18720 (now: true), thunder time: 68400 (now: false)
\tLevel game mode: Game mode: creative (ID 1). Hardcore: false. Cheats: true
Stacktrace:
\tat net.minecraft.server.MinecraftServer.func_71190_q(MinecraftServer.java:765)
\tat net.minecraft.server.MinecraftServer.func_71217_p(MinecraftServer.java:666)
\tat net.minecraft.server.integrated.IntegratedServer.func_71217_p(IntegratedServer.java:185)
\tat net.minecraft.server.MinecraftServer.run(MinecraftServer.java:524)
\tat java.lang.Thread.run(Unknown Source)

-- System Details --
Details:
\tMinecraft Version: 1.12.2
\tOperating System: Windows 7 (amd64) version 6.1
\tJava Version: 1.8.0_171, Oracle Corporation
\tJava VM Version: Java HotSpot(TM) 64-Bit Server VM (mixed mode), Oracle Corporation
\tMemory: 1332282616 bytes (1270 MB) / 1768423424 bytes (1686 MB) up to 9783214080 bytes (9330 MB)
\tJVM Flags: 5 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xmx10496m -Xms256m -XX:PermSize=256m -XX:G1HeapRegionSize=32M
\tIntCache: cache: 0, tcache: 0, allocated: 0, tallocated: 0
\tFML: MCP 9.42 Powered by Forge 14.23.3.2678 9 mods loaded, 9 mods active
\tStates: 'U' = Unloaded 'L' = Loaded 'C' = Constructed 'H' = Pre-initialized 'I' = Initialized 'J' = Post-initialized 'A' = Available 'D' = Disabled 'E' = Errored

\t| State     | ID              | Version      | Source                                    | Signature                                |
\t|:--------- |:--------------- |:------------ |:----------------------------------------- |:---------------------------------------- |
\t| UCHIJAAAA | minecraft       | 1.12.2       | minecraft.jar                             | None                                     |
\t| UCHIJAAAA | mcp             | 9.42         | minecraft.jar                             | None                                     |
\t| UCHIJAAAA | FML             | 8.0.99.99    | forge-1.12.2-14.23.3.2678.jar             | e3c3d50c7c986df74c645c0ac54639741c90a557 |
\t| UCHIJAAAA | forge           | 14.23.3.2678 | forge-1.12.2-14.23.3.2678.jar             | e3c3d50c7c986df74c645c0ac54639741c90a557 |
\t| UCHIJAAAA | baubles         | 1.5.2        | Baubles-1.12-1.5.2.jar                    | None                                     |
\t| UCHIJAAAA | jei             | 4.9.1.175    | jei_1.12.2-4.9.1.175.jar                  | None                                     |
\t| UCHIJAAAA | thaumcraft      | 6.1.BETA12   | Thaumcraft-1.12.2-6.1.BETA12.jar          | None                                     |
\t| UCHIJAAAA | tcinventoryscan | 2.0.8        | ThaumicInventoryScanning_1.12.2-2.0.8.jar | None                                     |
\t| UCHIJAAAA | thaumicjei      | 1.2.1        | ThaumicJEI-1.12.2-1.2.2-5.jar             | None                                     |

\tLoaded coremods (and transformers): 
\tGL info: ~~ERROR~~ RuntimeException: No OpenGL context found in the current thread.
\tProfiler Position: N/A (disabled)
\tPlayer Count: 1 / 8; [EntityPlayerMP['wamc2017'/30, l='New World', x=-636.55, y=27.75, z=373.30]]
\tType: Integrated Server (map_client.txt)
\tIs Modded: Definitely; Client brand changed to 'fml,forge'`