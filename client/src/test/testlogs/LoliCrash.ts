export const loliCrash = `---- Minecraft Crash Report ----
// Lolis deobfuscated this stacktrace using MCP's stable-39 mappings.
// On the bright side, I bought you a teddy bear!

Time: 2023-06-11 19:37:54 EDT
Description: Initializing game

net.minecraftforge.fml.common.LoaderExceptionModCrash: Caught exception from ScalingGUIs (scalingguis)
Caused by: java.util.ConcurrentModificationException
    at java.util.ArrayList$Itr.checkForComodification(ArrayList.java:901)
    at java.util.ArrayList$Itr.next(ArrayList.java:851)
    at spazley.scalingguis.config.JsonHelper.getKeyList(JsonHelper.java:86)
    at spazley.scalingguis.config.CustomScales.checkCustomEntries(CustomScales.java:23)
    at spazley.scalingguis.handlers.ConfigHandler.initConfigs(ConfigHandler.java:64)
    at spazley.scalingguis.ScalingGUIs.postInit(ScalingGUIs.java:46)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at net.minecraftforge.fml.common.FMLModContainer.handleModStateEvent(FMLModContainer.java:637)
    at sun.reflect.GeneratedMethodAccessor8.invoke(Unknown Source)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at com.google.common.eventbus.Subscriber.invokeSubscriberMethod(Subscriber.java:91)
    at com.google.common.eventbus.Subscriber$SynchronizedSubscriber.invokeSubscriberMethod(Subscriber.java:150)
    at com.google.common.eventbus.Subscriber$1.run(Subscriber.java:76)
    at com.google.common.util.concurrent.MoreExecutors$DirectExecutor.execute(MoreExecutors.java:399)
    at com.google.common.eventbus.Subscriber.dispatchEvent(Subscriber.java:71)
    at com.google.common.eventbus.Dispatcher$PerThreadQueuedDispatcher.dispatch(Dispatcher.java:116)
    at com.google.common.eventbus.EventBus.post(EventBus.java:217)
    at net.minecraftforge.fml.common.LoadController.sendEventToModContainer(LoadController.java:219)
    at net.minecraftforge.fml.common.LoadController.propogateStateMessage(LoadController.java:197)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at com.google.common.eventbus.Subscriber.invokeSubscriberMethod(Subscriber.java:91)
    at com.google.common.eventbus.Subscriber$SynchronizedSubscriber.invokeSubscriberMethod(Subscriber.java:150)
    at com.google.common.eventbus.Subscriber$1.run(Subscriber.java:76)
    at com.google.common.util.concurrent.MoreExecutors$DirectExecutor.execute(MoreExecutors.java:399)
    at com.google.common.eventbus.Subscriber.dispatchEvent(Subscriber.java:71)
    at com.google.common.eventbus.Dispatcher$PerThreadQueuedDispatcher.dispatch(Dispatcher.java:116)
    at com.google.common.eventbus.EventBus.post(EventBus.java:217)
    at net.minecraftforge.fml.common.LoadController.distributeStateMessage(LoadController.java:136)
    at net.minecraftforge.fml.common.Loader.initializeMods(Loader.java:754)
    at net.minecraftforge.fml.client.FMLClientHandler.finishMinecraftLoading(FMLClientHandler.java:336)
    at net.minecraft.client.Minecraft.init(Minecraft.java:535)
    at net.minecraft.client.Minecraft.run(Minecraft.java:7101)
    at net.minecraft.client.main.Main.main(SourceFile:123)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at net.minecraft.launchwrapper.Launch.launch(Launch.java:135)
    at net.minecraft.launchwrapper.Launch.main(Launch.java:28)


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- System Details --
  Minecraft Version: 1.12.2
  Operating System: Mac OS X (x86_64) version 10.16
  Java Version: 1.8.0_74, Oracle Corporation
  Java VM Version: Java HotSpot(TM) 64-Bit Server VM (mixed mode), Oracle Corporation
  Memory: 182737568 bytes (174 MB) / 5686951936 bytes (5423 MB) up to 6591873024 bytes (6286 MB)
  JVM Flags: 2 total; -Xmx7072m -Xms256m
  IntCache: cache: 0, tcache: 0, allocated: 0, tallocated: 0
  FML: MCP 9.42 LoliASM 5.8 Powered by Forge 14.23.5.2860 Optifine OptiFine_1.12.2_HD_U_G5 437 mods loaded, 436 mods active
       States: 'U' = Unloaded 'L' = Loaded 'C' = Constructed 'H' = Pre-initialized 'I' = Initialized 'J' = Post-initialized 'A' = Available 'D' = Disabled 'E' = Errored
       
       | State | ID                                | Version                             | Source                                                      | Signature                                |
       |:----- |:--------------------------------- |:----------------------------------- |:----------------------------------------------------------- |:---------------------------------------- |
       | LCHIJ | minecraft                         | 1.12.2                              | minecraft.jar                                               | None                                     |
       | LCHIJ | mcp                               | 9.42                                | minecraft.jar                                               | None                                     |
       | LCHIJ | bansoukou                         | 4.3.1                               | minecraft.jar                                               | None                                     |
       | LCHIJ | ic2patcher-core                   | 1.0                                 | minecraft.jar                                               | None                                     |
       | LCHIJ | FML                               | 8.0.99.99                           | forge-1.12.2-14.23.5.2860.jar                               | e3c3d50c7c986df74c645c0ac54639741c90a557 |
       | LCHIJ | forge                             | 14.23.5.2860                        | forge-1.12.2-14.23.5.2860.jar                               | e3c3d50c7c986df74c645c0ac54639741c90a557 |
       | LCHIJ | creativecoredummy                 | 1.0.0                               | minecraft.jar                                               | None                                     |
       | LCHIJ | ivtoolkit                         | 1.3.3-1.12                          | minecraft.jar                                               | None                                     |
       | LCHIJ | littletilescore                   | 1.0.0                               | minecraft.jar                                               | None                                     |
       | LCHIJ | otgcore                           | 1.12.2-v9.4                         | minecraft.jar                                               | None                                     |
       | LCHIJ | persistency                       | 1.2.0                               | minecraft.jar                                               | None                                     |
       | LCHIJ | smoothfontcore                    | mc1.12.2-2.1.4                      | minecraft.jar                                               | None                                     |
       | LCHIJ | mixinbooter                       | 7.1                                 | minecraft.jar                                               | None                                     |
       | LCHIJ | openmodscore                      | 0.12.2                              | minecraft.jar                                               | None                                     |
       | LCHIJ | biometweakercore                  | 1.0.39                              | minecraft.jar                                               | None                                     |
       | LCHIJ | bnbgamingcore                     | 0.12.0                              | minecraft.jar                                               | None                                     |
       | LCHIJ | foamfixcore                       | 7.7.4                               | minecraft.jar                                               | None                                     |
       | LCHIJ | opencomputers|core                | 1.8.2                               | minecraft.jar                                               | None                                     |
       | LCHIJ | botania_tweaks_core               | -100                                | minecraft.jar                                               | None                                     |
       | LCHIJ | randompatches                     | 1.12.2-1.22.1.10                    | randompatches-1.12.2-1.22.1.10.jar                          | None                                     |
       | LCHIJ | smoothfont                        | mc1.12.2-2.1.4                      | SmoothFont-mc1.12.2-2.1.4.jar                               | None                                     |
       | LCHIJ | tweakersconstruct                 | 1.12.2-1.6.1                        | tweakersconstruct-1.12.2-1.6.1.jar                          | None                                     |
       | LCHIJ | actuallyadditions                 | 1.12.2-r152                         | ActuallyAdditions-1.12.2-r152-patched.jar                   | None                                     |
       | LCHIJ | baubles                           | 1.5.2                               | Baubles-1.12-1.5.2.jar                                      | None                                     |
       | LCHIJ | actuallybaubles                   | 1.1                                 | ActuallyBaubles-1.12-1.1-patched.jar                        | None                                     |
       | LCHIJ | crafttweaker                      | 4.1.20                              | CraftTweaker2-1.12-4.1.20.689.jar                           | None                                     |
       | LCHIJ | endertweaker                      | 1.2.3                               | EnderTweaker-1.12.2-1.2.3.jar                               | None                                     |
       | LCHIJ | mtlib                             | 3.0.7                               | MTLib-3.0.7.jar                                             | None                                     |
       | LCHIJ | modtweaker                        | 4.0.19                              | modtweaker-4.0.20.11.jar                                    | None                                     |
       | LCHIJ | jei                               | 4.25.0                              | HadEnoughItems_1.12.2-4.25.0.jar                            | None                                     |
       | LCHIJ | ic2                               | 2.8.222-ex112                       | industrialcraft-2-2.8.222-ex112-patched.jar                 | None                                     |
       | LCHIJ | forestry                          | 5.8.2.422                           | forestry_1.12.2-5.8.2.422-patched.jar                       | None                                     |
       | LCHIJ | forgelin                          | 1.8.4                               | Forgelin-1.8.4.jar                                          | None                                     |
       | LCHIJ | ctm                               | MC1.12.2-1.0.2.31                   | CTM-MC1.12.2-1.0.2.31.jar                                   | None                                     |
       | LCHIJ | chisel                            | MC1.12.2-1.0.2.45                   | Chisel-MC1.12.2-1.0.2.45.jar                                | None                                     |
       | LCHIJ | endercore                         | 1.12.2-0.5.76                       | EnderCore-1.12.2-0.5.76.jar                                 | None                                     |
       | LCHIJ | thaumcraft                        | 6.1.BETA26                          | Thaumcraft-1.12.2-6.1.BETA26-patched.jar                    | None                                     |
       | LCHIJ | biometweaker                      | 3.2.369                             | BiomeTweaker-1.12.2-3.2.369.jar                             | 631f326344f7f5fd7df7eb940760ebd52b7c9c17 |
       | LCHIJ | biomesoplenty                     | 7.0.1.2445                          | BiomesOPlenty-1.12.2-7.0.1.2445-universal-patched.jar       | None                                     |
       | LCHIJ | botania_tweaks                    | 1.9.1                               | botaniatweaks-1.9.1-patched.jar                             | None                                     |
       | LCHIJ | botania                           | r1.10-364                           | Botania r1.10-364.4-patched.jar                             | None                                     |
       | LCHIJ | redstoneflux                      | 2.1.1                               | RedstoneFlux-1.12-2.1.1.1-universal.jar                     | None                                     |
       | LCHIJ | cofhcore                          | 4.6.6                               | CoFHCore-1.12.2-4.6.6.1-universal.jar                       | None                                     |
       | LCHIJ | craftstudioapi                    | 1.0.0                               | CraftStudioAPI-universal-1.0.1.95-mc1.12-alpha.jar          | None                                     |
       | LCHIJ | openterraingenerator              | v9.4                                | OpenTerrainGenerator-1.12.2-v9.5-patched.jar                | None                                     |
       | LCHIJ | harvestcraft                      | 1.12.2zb                            | Pam's HarvestCraft 1.12.2zg.jar                             | None                                     |
       | LCHIJ | bookshelf                         | 2.3.590                             | Bookshelf-1.12.2-2.3.590.jar                                | d476d1b22b218a10d845928d1665d45fce301b27 |
       | LCHIJ | gamestages                        | 2.0.123                             | GameStages-1.12.2-2.0.123.jar                               | d476d1b22b218a10d845928d1665d45fce301b27 |
       | LCHIJ | toolprogression                   | 1.12.2-1.6.12                       | toolprogression-1.12.2-1.6.12.jar                           | e631d7254e451d0360d0148cb21407d5511d45e9 |
       | LCHIJ | twilightforest                    | 3.11.1021                           | twilightforest-1.12.2-3.11.1021-universal.jar               | None                                     |
       | LCHIJ | animania                          | 2.0.3.28                            | animania-1.12.2-base-2.0.3.28.jar                           | None                                     |
       | LCHIJ | codechickenlib                    | 3.2.3.358                           | CodeChickenLib-1.12.2-3.2.3.358-universal.jar               | f1850c39b2516232a2108a7bd84d1cb5df93b261 |
       | LCHIJ | brandonscore                      | 2.4.20                              | BrandonsCore-1.12.2-2.4.20.162-universal.jar                | None                                     |
       | LCHIJ | cofhworld                         | 1.4.0                               | CoFHWorld-1.12.2-1.4.0.1-universal.jar                      | None                                     |
       | LCHIJ | thermalfoundation                 | 2.6.7                               | ThermalFoundation-1.12.2-2.6.7.1-universal.jar              | None                                     |
       | LCHIJ | draconicevolution                 | 2.3.28                              | Draconic-Evolution-1.12.2-2.3.28.354-universal.jar          | None                                     |
       | LCHIJ | thermalexpansion                  | 5.5.7                               | ThermalExpansion-1.12.2-5.5.7.1-universal.jar               | None                                     |
       | LCHIJ | enderio                           | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | enderiointegrationtic             | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | mantle                            | 1.12-1.3.3.55                       | Mantle-1.12-1.3.3.55.jar                                    | None                                     |
       | LCHIJ | quark                             | r1.6-187                            | QuarkRotN-r1.6-187-patched.jar                              | None                                     |
       | LCHIJ | tinkersextras                     | 1.12.2-1.1.0                        | TinkersExtras-1.12.2-1.1.0.jar                              | b02331787272ec3515ebe63ecdeea0d746653468 |
       | LCHIJ | tconstruct                        | 1.12.2-2.13.0.183                   | TConstruct-1.12.2-2.13.0.183-patched.jar                    | None                                     |
       | LCHIJ | exnihilocreatio                   | 1.12.2-0.4.7.2                      | exnihilocreatio-1.12.2-0.4.7.2-patched.jar                  | None                                     |
       | LCHIJ | excompressum                      | 3.0.32                              | ExCompressum_1.12.2-3.0.32-patched.jar                      | None                                     |
       | LCHIJ | additionalcompression             | 3.4                                 | Additional-Compression-1.12.2-3.4.jar                       | None                                     |
       | LCHIJ | engineersdecor                    | 1.1.5                               | engineersdecor-1.12.2-1.1.5.jar                             | ed58ed655893ced6280650866985abcae2bf7559 |
       | LCHIJ | immersiveengineering              | 0.12-98                             | ImmersiveEngineering-0.12-98-patched.jar                    | None                                     |
       | LCHIJ | libvulpes                         | 0.4.2.-25                           | LibVulpes-1.12.2-0.4.2-25-universal-patched.jar             | None                                     |
       | LCHIJ | advancedrocketry                  | 1.12.2-2.0.0-13                     | AdvancedRocketry-1.12.2-2.0.0-13.jar                        | None                                     |
       | LCHIJ | appliedenergistics2               | rv6-stable-7-extended_life-v0.55.14 | appliedenergistics2-rv6-stable-7-extended_life-v0.55.14.jar | None                                     |
       | LCHIJ | aenetvistool                      | 1.0.3                               | AE-Net-Vis-Tool-1.12.2-1.0.3.0-universal.jar                | None                                     |
       | LCHIJ | bdlib                             | 1.14.3.12                           | bdlib-1.14.3.12-mc1.12.2.jar                                | None                                     |
       | LCHIJ | ae2stuff                          | 0.7.0.4                             | ae2stuff-0.7.0.4-mc1.12.2.jar                               | None                                     |
       | LCHIJ | p455w0rdslib                      | 2.3.161                             | p455w0rdslib-1.12.2-2.3.161.jar                             | 186bc454cd122c9c2f1aa4f95611254bcc543363 |
       | LCHIJ | ae2wtlib                          | 1.0.34                              | AE2WTLib-1.12.2-1.0.34.jar                                  | 186bc454cd122c9c2f1aa4f95611254bcc543363 |
       | LCHIJ | waila                             | 1.8.26                              | Hwyla-1.8.26-B41_1.12.2.jar                                 | None                                     |
       | LCHIJ | computercraft                     | 1.89.2                              | cc-tweaked-1.12.2-1.89.2-patched.jar                        | None                                     |
       | LCHIJ | cyclicmagic                       | 1.20.12                             | Cyclic-1.12.2-1.20.14.jar                                   | 0e5cb559be7d03f3fc18b8cba547d663e25f28af |
       | LCHIJ | mekanism                          | 9.12.7                              | Mekanism-Community-Edition-1.12.2-9.12.7-Core.jar           | None                                     |
       | LCHIJ | aeadditions                       | 1.3.8                               | AEAdditions-1.12.2-1.3.8.jar                                | None                                     |
       | LCHIJ | aireducer                         | 0.3.0                               | AIReducer-1.12.2-0.3.0.jar                                  | None                                     |
       | LCHIJ | akashictome                       | 1.2-12                              | AkashicTome-1.2-12.jar                                      | None                                     |
       | LCHIJ | alfinivia                         | 0.4hotfix                           | Alfinivia-0.4hotfix.jar                                     | None                                     |
       | LCHIJ | angermanagement                   | 1.12.2-1.0.2                        | angermanagement-1.12.2-1.0.2.jar                            | 1bc8f8dbe770187a854cef35dad0ff40ba441bbe |
       | LCHIJ | guideapi                          | 1.12-2.1.8-63                       | Guide-API-1.12-2.1.8-63.jar                                 | None                                     |
       | LCHIJ | bloodmagic                        | 1.12.2-2.4.3-105                    | BloodMagic-1.12.2-2.4.3-105.jar                             | None                                     |
       | LCHIJ | animus                            | 1                                   | Animus-1.12-2.1.8.jar                                       | None                                     |
       | LCHIJ | applecore                         | 3.4.0                               | AppleCore-mc1.12.2-3.4.0.jar                                | None                                     |
       | LCHIJ | appleskin                         | 1.0.14                              | AppleSkin-mc1.12-1.0.14.jar                                 | None                                     |
       | LCHIJ | aquaacrobatics                    | 1.15.3                              | AquaAcrobatics-1.15.3.jar                                   | None                                     |
       | LCHIJ | architecturecraft                 | @VERSION@                           | architecturecraft-1.12-3.108.jar                            | None                                     |
       | LCHIJ | armorcurve                        | 1.2.0                               | armorcurve-1.2.9.jar                                        | None                                     |
       | LCHIJ | armoreablemobs                    | 1.1.2                               | armoreablemobs-1.12.2-1.1.8.jar                             | None                                     |
       | LCHIJ | base                              | 3.14.0                              | base-1.12.2-3.14.0.jar                                      | None                                     |
       | LCHIJ | contenttweaker                    | 1.12.2-4.10.0                       | ContentTweaker-1.12.2-4.10.0.jar                            | None                                     |
       | LCHIJ | conarm                            | 1.2.5.10                            | conarm-1.12.2-1.2.5.10.jar                                  | b33d2c8df492beff56d1bbbc92da49b8ab7345a1 |
       | LCHIJ | armoryexpansion                   | 2.0.0-alpha                         | armoryexpansion-2.0.0-alpha.jar                             | None                                     |
       | LCHIJ | armoryexpansion-custommaterials   | 2.0.0-alpha                         | armoryexpansion-2.0.0-alpha.jar                             | None                                     |
       | LCHIJ | hammercore                        | 2.0.6.32                            | HammerLib-1.12.2-2.0.6.32.jar                               | 9f5e2a811a8332a842b34f6967b7db0ac4f24856 |
       | LCHIJ | thaumadditions                    | 12.7.8                              | ThaumicAdditions-1.12.2-12.7.8.jar                          | 9f5e2a811a8332a842b34f6967b7db0ac4f24856 |
       | LCHIJ | llibrary                          | 1.7.20                              | llibrary-1.7.20-1.12.2.jar                                  | b9f30a813bee3b9dd5652c460310cfcd54f6b7ec |
       | LCHIJ | iceandfire                        | 1.9.1                               | iceandfire-1.9.1-1.12.2-patched.jar                         | None                                     |
       | LCHIJ | armoryexpansion-iceandfire        | 2.0.0-alpha                         | armoryexpansion-2.0.0-alpha.jar                             | None                                     |
       | LCHIJ | armoryexpansion-matteroverdrive   | 2.0.0-alpha                         | armoryexpansion-2.0.0-alpha.jar                             | None                                     |
       | LCHIJ | astralsorcery                     | 1.10.27                             | astralsorcery-1.12.2-1.10.27.jar                            | a0f0b759d895c15ceb3e3bcb5f3c2db7c582edf0 |
       | LCHIJ | athenaeum                         | 1.12.2-1.19.5                       | athenaeum-1.12.2-1.19.5.jar                                 | None                                     |
       | LCHIJ | atlaslib                          | 1.1.5a                              | Atlas-Lib-1.12.2-1.1.5a.jar                                 | None                                     |
       | LCHIJ | morphtool                         | 1.2-21                              | Morph-o-Tool-1.2-21.jar                                     | None                                     |
       | LCHIJ | autoreglib                        | 1.3-32                              | AutoRegLib-1.3-32.jar                                       | None                                     |
       | LCHIJ | avaritia                          | 3.3.0                               | Avaritia-1.12.2-3.3.0.37-universal.jar                      | None                                     |
       | LCHIJ | avaritiaio                        | @VERSION@                           | avaritiaio-1.4.jar                                          | None                                     |
       | LCHIJ | bedrockores                       | 1.2.7.42                            | Bedrock Ores-MC1.12-1.2.7.42-patched.jar                    | None                                     |
       | LCHIJ | betteradvancements                | 0.1.0.77                            | BetterAdvancements-1.12.2-0.1.0.77.jar                      | None                                     |
       | LCHIJ | betterbiomeblend                  | 1.12.2-1.1.7-forge                  | betterbiomeblend-1.12.2-1.1.7-forge.jar                     | None                                     |
       | LCHIJ | betterbuilderswands               | 0.13.2                              | BetterBuildersWands-1.12.2-0.13.2.271+5997513.jar           | None                                     |
       | LCHIJ | bettercaves                       | 1.12.2                              | bettercaves-1.12.2-2.0.4.jar                                | None                                     |
       | LCHIJ | betterhurttimer                   | 1.12.2-1.3.0.0                      | BetterHurtTimer-1.12.2-1.5.0.1.jar                          | 72cd337644e68ff7257f69b2927894048793e577 |
       | LCHIJ | bettermineshafts                  | 1.12.2-2.2.1                        | BetterMineshaftsForge-1.12.2-2.2.1.jar                      | None                                     |
       | LCHIJ | betterp2p                         | 1.12.2-1.2.3-extended_life          | betterp2p-1.12.2-1.2.3-extended_life.jar                    | None                                     |
       | LCHIJ | bibliocraft                       | 2.4.6                               | BiblioCraft[v2.4.6][MC1.12.2].jar                           | None                                     |
       | LCHIJ | bilingualname                     | 1.2                                 | bilingualname-1.2.jar                                       | None                                     |
       | LCHIJ | biomeborderviewer                 | 1.3.0.0                             | Biome Border Viewer-1.3.0.0-1.12.2.jar                      | None                                     |
       | LCHIJ | bithop                            | master-1.2.54                       | BitHop-1.2.jar                                              | None                                     |
       | LCHIJ | blockdrops                        | 1.4.0                               | blockdrops-1.12.2-1.4.0.jar                                 | None                                     |
       | LCHIJ | bloodsmeltery                     | 1.1.2                               | Blood-Smeltery-1.12.2-1.1.2.jar                             | None                                     |
       | LCHIJ | bnbgaminglib                      | 2.17.6                              | BNBGamingLib-1.12.2-2.17.6.jar                              | None                                     |
       | LCHIJ | bmtr                              | 0.4                                 | BringMeTheRings-0.4.jar                                     | None                                     |
       | LCHIJ | brokenwings                       | 2.0.0                               | brokenwings-3.0.0.jar                                       | None                                     |
       | LCHIJ | buildinggadgets                   | 2.8.4                               | BuildingGadgets-2.8.4.jar                                   | None                                     |
       | LCHIJ | carryon                           | 1.12.3                              | carryon-1.12.2-1.12.7.23.jar                                | None                                     |
       | LCHIJ | cctweaked                         | 1.89.2                              | cc-tweaked-1.12.2-1.89.2-patched.jar                        | None                                     |
       | LCHIJ | spark                             | 1.5.2                               | spark-forge1122.jar                                         | None                                     |
       | LCHIJ | loliasm                           | 5.8                                 | censoredasm5.8.jar                                          | None                                     |
       | LCHIJ | chameleon                         | 1.12-4.1.3                          | Chameleon-1.12-4.1.3.jar                                    | None                                     |
       | LCHIJ | chatflow                          | ANT:VERSION                         | ChatFlow-1.4-7.jar                                          | None                                     |
       | LCHIJ | chunkanimator                     | 1.12.2-1.2                          | ChunkAnimator-1.12.2-1.2.1.jar                              | None                                     |
       | LCHIJ | claybucket                        | 1.1                                 | ClayBucket-1.12-1.1.jar                                     | None                                     |
       | LCHIJ | cucumber                          | 1.1.3                               | Cucumber-1.12.2-1.1.3.jar                                   | None                                     |
       | LCHIJ | mysticalagriculture               | 1.7.5                               | MysticalAgriculture-1.12.2-1.7.5.jar                        | None                                     |
       | LCHIJ | mysticalagradditions              | 1.3.2                               | MysticalAgradditions-1.12.2-1.3.2.jar                       | None                                     |
       | LCHIJ | clochepp                          | 1.0.3                               | cloche-profit-peripheral-1.12.2-1.0.3.jar                   | None                                     |
       | LCHIJ | clumps                            | 3.1.2                               | Clumps-3.1.2.jar                                            | None                                     |
       | LCHIJ | collective                        | 3.0                                 | collective-1.12.2-3.0.jar                                   | None                                     |
       | LCHIJ | cyclopscore                       | 1.6.7                               | CyclopsCore-1.12.2-1.6.7.jar                                | bd0353b3e8a2810d60dd584e256e364bc3bedd44 |
       | LCHIJ | commoncapabilities                | 2.4.8                               | CommonCapabilities-1.12.2-2.4.8.jar                         | bd0353b3e8a2810d60dd584e256e364bc3bedd44 |
       | LCHIJ | colossalchests                    | 1.7.3                               | ColossalChests-1.12.2-1.7.3-patched.jar                     | None                                     |
       | LCHIJ | colytra                           | 1.2.0.4                             | colytra-1.12.2-1.2.0.4.jar                                  | 2484ef4d131fdc0dca0647aa21b7b944ddb935a1 |
       | LCHIJ | compactmachines3                  | 3.0.18                              | compactmachines3-1.12.2-3.0.18-b278.jar                     | None                                     |
       | LCHIJ | compactsolars                     | 1.12.2-5.0.18.341                   | CompactSolars-1.12.2-5.0.18.341-universal.jar               | None                                     |
       | LCHIJ | conditionoverload                 | 1.1.0                               | conditionoverload-1.1.0.jar                                 | None                                     |
       | LCHIJ | consolefilter                     | 1.1.1                               | ConsoleFilter-1.12.2-1.1.1.jar                              | None                                     |
       | LCHIJ | controlling                       | 3.0.10                              | Controlling-3.0.12.2.jar                                    | None                                     |
       | LCHIJ | cookingforblockheads              | 6.5.0                               | CookingForBlockheads_1.12.2-6.5.0.jar                       | None                                     |
       | LCHIJ | cosmeticarmorreworked             | 1.12.2-v5a                          | CosmeticArmorReworked-1.12.2-v5a.jar                        | aaaf83332a11df02406e9f266b1b65c1306f0f76 |
       | LCHIJ | cotro                             | 1.0.0                               | CoTRO-1.0.0-1.12.2.jar                                      | None                                     |
       | LCHIJ | craftingtweaks                    | 9.0.1                               | CraftingTweaks_1.12.2-9.0.1.jar                             | None                                     |
       | LCHIJ | craftpresence                     | 2.0.5                               | CraftPresence-2.0.5+1.12.2.jar                              | None                                     |
       | LCHIJ | ctgui                             | 1.0.0                               | CraftTweaker2-1.12-4.1.20.689.jar                           | None                                     |
       | LCHIJ | crafttweakerjei                   | 2.0.3                               | CraftTweaker2-1.12-4.1.20.689.jar                           | None                                     |
       | LCHIJ | crafttweakerutils                 | 0.7                                 | crafttweakerutils-0.7.jar                                   | None                                     |
       | LCHIJ | creativecore                      | 1.10.0                              | CreativeCore_v1.10.70_mc1.12.2.jar                          | None                                     |
       | LCHIJ | cryingghasts                      | 1.3                                 | cryingghasts_1.12.2-1.3.jar                                 | None                                     |
       | LCHIJ | ctintegration                     | 1.8.0                               | ctintegration-1.8.0.jar                                     | None                                     |
       | LCHIJ | culinaryconstruct                 | 1.3.4                               | culinaryconstruct-1.3.4.jar                                 | 2484ef4d131fdc0dca0647aa21b7b944ddb935a1 |
       | LCHIJ | custombackgrounds                 | 1.0                                 | CustomBackgrounds-MC1.12-1.1.1.jar                          | None                                     |
       | LCHIJ | custommainmenu                    | 2.0.9.1                             | CustomMainMenu-MC1.12.2-2.0.9.1.jar                         | None                                     |
       | LCHIJ | mousetweaks                       | 3.1.2                               | MouseTweaks-3.1.2-mc1.12.2.jar                              | None                                     |
       | LCHIJ | danknull                          | 1.7.101                             | DankNull-1.12.2-1.7.101.jar                                 | 644f38521a349310a5dae0239577dc7beebefaec |
       | LCHIJ | darkutils                         | 1.8.230                             | DarkUtils-1.12.2-1.8.230.jar                                | d476d1b22b218a10d845928d1665d45fce301b27 |
       | LCHIJ | patchouli                         | 1.0-23.6                            | Patchouli-1.0-23.6.jar                                      | None                                     |
       | LCHIJ | deepmoblearning                   | 1.0.0                               | DeepMobEvolution-1.1.2.jar                                  | None                                     |
       | LCHIJ | deepmoblearningbm                 | @VERSION@                           | DeepBloodEvolution-1.1.3-e.jar                              | None                                     |
       | LCHIJ | demagnetize                       | 1.12.2-1.1.2                        | demagnetize-1.12.2-1.1.2.jar                                | None                                     |
       | LCHIJ | dropt                             | 1.12.2-1.19.3                       | dropt-1.12.2-1.19.3.jar                                     | None                                     |
       | LCHIJ | dynamistics                       | 1.0.2                               | dynamistics-1.0.2.jar                                       | None                                     |
       | LCHIJ | emberroot                         | 1.3.9                               | EmberRootZoo-1.12.2-1.3.10.jar                              | None                                     |
       | LCHIJ | enderiobase                       | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | enderioconduits                   | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | enderioconduitsappliedenergistics | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | opencomputers                     | 1.8.2                               | OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar            | None                                     |
       | LCHIJ | enderioconduitsopencomputers      | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | enderioconduitsrefinedstorage     | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | enderiointegrationforestry        | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | enderiointegrationticlate         | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | enderioinvpanel                   | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | ftblib                            | 5.4.7.2                             | FTBLib-5.4.7.2.jar                                          | None                                     |
       | LCHIJ | enderiomachines                   | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | enderiopowertools                 | 5.3.70                              | EnderIO-1.12.2-5.3.70-patched.jar                           | None                                     |
       | LCHIJ | gasconduits                       | 5.3.70                              | EnderIO-conduits-mekanism-1.12.2-5.3.70.jar                 | None                                     |
       | LCHIJ | enderioendergy                    | 5.3.70                              | EnderIO-endergy-1.12.2-5.3.70.jar                           | None                                     |
       | LCHIJ | enderstorage                      | 2.4.9                               | EnderStorage-1.12.2-2.4.9.jar                               | None                                     |
       | LCHIJ | endreborn                         | 0.3.8                               | EndReborn [0.3.9].jar                                       | None                                     |
       | LCHIJ | engineersdoors                    | 0.9.1                               | engineers_doors-1.12.2-0.9.1.jar                            | None                                     |
       | LCHIJ | valkyrielib                       | 1.12.2-2.0.20.1                     | valkyrielib-1.12.2-2.0.20.1.jar                             | None                                     |
       | LCHIJ | environmentalmaterials            | @EM_VERSION@                        | environmentalmaterials-1.12.2-1.0.20.1.jar                  | None                                     |
       | LCHIJ | environmentaltech                 | 1.12.2-2.0.20.1                     | environmentaltech-1.12.2-2.0.20.1.jar                       | None                                     |
       | LCHIJ | extendedcrafting                  | 1.7.0                               | ExtendedCrafting-Nomifactory-Edition-1.7.0.jar              | None                                     |
       | LCHIJ | extrautils2                       | 1.0                                 | extrautils2-1.12-1.9.9.jar                                  | None                                     |
       | LCHIJ | eyeofdragons                      | 0.0.1                               | eyeofdragons-0.0.2.jar                                      | None                                     |
       | LCHIJ | farmingforblockheads              | 3.1.28                              | FarmingForBlockheads_1.12.2-3.1.28.jar                      | None                                     |
       | LCHIJ | fastfurnace                       | 1.3.1                               | FastFurnace-1.12.2-1.3.1.jar                                | None                                     |
       | LCHIJ | findme                            | 1.1.0                               | findme-1.12.2-1.1.0.jar                                     | None                                     |
       | LCHIJ | flopper                           | 1.0.3                               | Flopper-1.12.2-1.0.3.jar                                    | bd0353b3e8a2810d60dd584e256e364bc3bedd44 |
       | LCHIJ | floralchemy                       | 1.12.2-1.1.1                        | Floralchemy-1.12.2-1.1.1.jar                                | None                                     |
       | LCHIJ | ae2fc                             | 2.4.22-r                            | Fluid Craft for AE2-2.4.22-r.jar                            | None                                     |
       | LCHIJ | libnine                           | 1.2.1                               | libnine-1.12.2-1.2.1.jar                                    | None                                     |
       | LCHIJ | storagedrawers                    | 5.2.2                               | StorageDrawers-1.12.2-5.4.2.jar                             | None                                     |
       | LCHIJ | fluiddrawers                      | 1.0.7                               | fluiddrawers-1.12.2-1.0.7.jar                               | None                                     |
       | LCHIJ | fluidlogged_api                   | 2.2.4                               | Fluidlogged-API-v2.2.4-mc1.12.2.jar                         | None                                     |
       | LCHIJ | sonarcore                         | 5.0.19                              | sonarcore-1.12.2-5.0.19-20.jar                              | None                                     |
       | LCHIJ | fluxnetworks                      | 4.1.0                               | FluxNetworks-1.12.2-4.1.1.34-patched.jar                    | None                                     |
       | LCHIJ | foamfix                           | @VERSION@                           | foamfix-0.10.15-1.12.2.jar                                  | None                                     |
       | LCHIJ | integrateddynamics                | 1.1.11                              | IntegratedDynamics-1.12.2-1.1.11-patched.jar                | None                                     |
       | LCHIJ | integrated_proxy                  | 1.0.1                               | forkedproxy-1.0.1.jar                                       | None                                     |
       | LCHIJ | fpsreducer                        | mc1.12.2-1.20                       | FpsReducer-mc1.12.2-1.20.jar                                | None                                     |
       | LCHIJ | framedcompactdrawers              | 1.2.7                               | framedcompactdrawers-1.2.7.jar                              | None                                     |
       | LCHIJ | ftbbackups                        | 1.1.0.1                             | FTBBackups-1.1.0.1.jar                                      | None                                     |
       | LCHIJ | ftbutilities                      | 5.4.1.131                           | FTBUtilities-5.4.1.131.jar                                  | None                                     |
       | LCHIJ | itemfilters                       | 1.0.4.2                             | ItemFilters-1.0.4.2.jar                                     | None                                     |
       | LCHIJ | ftbquests                         | 1202.9.0.15                         | FTBQuests-1202.9.0.15.jar                                   | None                                     |
       | LCHIJ | gamblingstyle                     | 1.1.3                               | GamblingStyle-v1.1.3-1.12.2.jar                             | None                                     |
       | LCHIJ | gendustry                         | 1.6.5.8                             | gendustry-1.6.5.8-mc1.12.2.jar                              | None                                     |
       | LCHIJ | gendustryjei                      | 1.0.2                               | gendustryjei-1.0.2.jar                                      | None                                     |
       | LCHIJ | advgenerators                     | 0.9.20.12                           | generators-0.9.20.12-mc1.12.2.jar                           | None                                     |
       | LCHIJ | grid                              | 1.12-forge14.21.1.2387-1.4          | grid-1.12-forge14.21.1.2387-1.4.jar                         | None                                     |
       | LCHIJ | gunpowderlib                      | 1.12.2-1.1                          | GunpowderLib-1.12.2-1.1.jar                                 | 4ffa87db52cf086d00ecc4853a929367b1c39b5c |
       | LCHIJ | handoveryouritems                 | 1.2                                 | handoveryouritems_1.12.2-1.2.jar                            | None                                     |
       | LCHIJ | hbm                               | 2.0.0.16                            | HarderBranchMining-1.12.2-2.0.0.16.jar                      | None                                     |
       | LCHIJ | hole_filler_mod                   | 1.0                                 | hole_filler_mod-1.2.4.1-mc_1.12.2-forge.jar                 | None                                     |
       | LCHIJ | horsetweaks                       | 1.0.5                               | HorseTweaks_1.12.2-1.0.5.jar                                | None                                     |
       | LCHIJ | ic2cropplugin                     | 1.1                                 | IC2CropBreeding Plugin V1.12-1.1.jar                        | None                                     |
       | LCHIJ | ic2patcher                        | 2.0.3                               | ic2patcher-2.0.3.jar                                        | None                                     |
       | LCHIJ | immersivecables                   | 1.3.2                               | ImmersiveCables-1.12.2-1.3.2-patched.jar                    | None                                     |
       | LCHIJ | immersivepetroleum                | 1.1.10                              | immersivepetroleum-1.12.2-1.1.10.jar                        | None                                     |
       | LCHIJ | incontrol                         | 3.9.18                              | incontrol-1.12-3.9.18.jar                                   | None                                     |
       | LCHIJ | teslacorelib                      | 1.0.18                              | tesla-core-lib-1.12.2-1.0.18.jar                            | d476d1b22b218a10d845928d1665d45fce301b27 |
       | LCHIJ | industrialforegoing               | 1.12.2-1.12.2                       | industrialforegoing-1.12.2-1.12.13-237.jar                  | None                                     |
       | LCHIJ | integratedcrafting                | 1.0.10                              | IntegratedCrafting-1.12.2-1.0.10-patched.jar                | None                                     |
       | LCHIJ | integrateddynamicscompat          | 1.0.0                               | IntegratedDynamics-1.12.2-1.1.11-patched.jar                | None                                     |
       | LCHIJ | integratednbt                     | 1.2.2                               | integratednbt-1.2.2.jar                                     | None                                     |
       | LCHIJ | integratedterminals               | 1.0.14                              | IntegratedTerminals-1.12.2-1.0.14-patched.jar               | None                                     |
       | LCHIJ | integratedterminalscompat         | 1.0.0                               | IntegratedTerminals-1.12.2-1.0.14-patched.jar               | None                                     |
       | LCHIJ | integratedtunnels                 | 1.6.14                              | IntegratedTunnels-1.12.2-1.6.14-patched.jar                 | None                                     |
       | LCHIJ | integratedtunnelscompat           | 1.0.0                               | IntegratedTunnels-1.12.2-1.6.14-patched.jar                 | None                                     |
       | LCHIJ | nuclearcraft                      | 2o.6.2                              | NuclearCraft-2o.6.2-1.12.2.jar                              | None                                     |
       | LCHIJ | randomthings                      | 4.2.7.4                             | RandomThings-MC1.12.2-4.2.7.4-patched.jar                   | None                                     |
       | LCHIJ | mcjtylib_ng                       | 3.5.4                               | mcjtylib-1.12-3.5.4.jar                                     | None                                     |
       | LCHIJ | rftools                           | 7.73                                | rftools-1.12-7.73.jar                                       | None                                     |
       | LCHIJ | rustic                            | 1.1.7                               | rustic-1.1.7-patched.jar                                    | None                                     |
       | LCHIJ | integrationforegoing              | 1.12.2-1.11                         | IntegrationForegoing-1.12.2-1.11.jar                        | 4ffa87db52cf086d00ecc4853a929367b1c39b5c |
       | LCHIJ | inventorytweaks                   | 1.64+dev.151.822d839                | InventoryTweaks-1.64+dev.151.jar                            | 55d2cd4f5f0961410bf7b91ef6c6bf00a766dcbe |
       | LCHIJ | inworldcrafting                   | 1.12.2-1.2.0                        | inworldcrafting-1.12.2-1.2.0-universal.jar                  | None                                     |
       | LCHIJ | ironchest                         | 1.12.2-7.0.67.844                   | ironchest-1.12.2-7.0.72.847.jar                             | None                                     |
       | LCHIJ | jaopcacustom                      | 1.12-2.2.2.14                       | JAOPCACustom-1.12-2.2.2.14.jar                              | None                                     |
       | LCHIJ | jaopca                            | 1.12.2-2.2.8.106                    | JAOPCA-1.12.2-2.2.8.106.jar                                 | None                                     |
       | LCHIJ | oredictinit                       | 1.12.2-2.2.1.72                     | JAOPCA-1.12.2-2.2.8.106.jar                                 | None                                     |
       | LCHIJ | jeiutilities                      | 0.2.11                              | JEI-Utilities-1.12.2-0.2.11.jar                             | None                                     |
       | LCHIJ | jeibees                           | 0.9.0.5                             | jeibees-0.9.0.5-mc1.12.2.jar                                | None                                     |
       | LCHIJ | jepb                              | 1.2.1                               | jepb-1.12-1.2.1.jar                                         | None                                     |
       | LCHIJ | jetif                             | 1.5.2                               | jetif-1.12.2-1.5.2.jar                                      | None                                     |
       | LCHIJ | journeymap                        | 1.12.2-5.7.1                        | journeymap-1.12.2-5.7.1.jar                                 | None                                     |
       | LCHIJ | jehc                              | 1.7.2                               | just-enough-harvestcraft-1.12.2-1.7.2.jar                   | None                                     |
       | LCHIJ | jecalculation                     | 1.12.2-3.2.7                        | JustEnoughCalculation-1.12.2-3.2.7.jar                      | None                                     |
       | LCHIJ | justenoughdimensions              | 1.6.0-dev.20211009.214847           | justenoughdimensions-1.12.2-1.6.0-dev.20211009.214847.jar   | None                                     |
       | LCHIJ | justenoughdrags                   | 1.4-beta.1                          | justenoughdrags-1.4-beta.1.jar                              | None                                     |
       | LCHIJ | justenoughpetroleum               | 0.1                                 | JustEnoughPetroleum-0.1.jar                                 | None                                     |
       | LCHIJ | loottweaker                       | 0.3.1                               | LootTweaker-0.3.1+MC1.12.2.jar                              | None                                     |
       | LCHIJ | jeresources                       | 0.9.3.203                           | JustEnoughResources-1.12.2-0.9.3.203-patched.jar            | None                                     |
       | LCHIJ | keywizard                         | 1.12.2-1.7.3                        | keywizard-1.12.2-1.7.3.jar                                  | None                                     |
       | LCHIJ | kirosblocks                       | 1.2.1                               | kirosblocks-1.2.1.jar                                       | None                                     |
       | LCHIJ | kleeslabs                         | 5.4.12                              | KleeSlabs_1.12.2-5.4.12.jar                                 | None                                     |
       | LCHIJ | threng                            | 1.1.26                              | lazy-ae2-1.12.2-1.1.26.jar                                  | None                                     |
       | LCHIJ | letmesleep                        | 1.2.2                               | LetMeSleep-v1.2.3-1.12.2.jar                                | None                                     |
       | LCHIJ | littletiles                       | 1.5.0                               | LittleTiles_v1.5.72_mc1.12.2.jar                            | None                                     |
       | LCHIJ | lootcapacitortooltips             | 1.3                                 | lootcapacitortooltips-1.3.jar                               | None                                     |
       | LCHIJ | lootr                             | 0.6.1                               | lootr-1.12.2-0.6.1.jar                                      | None                                     |
       | LCHIJ | lttweaker                         | 1.1.17                              | LootTableTweaker-1.12.2-1.1.17.jar                          | d476d1b22b218a10d845928d1665d45fce301b27 |
       | LCHIJ | lunatriuscore                     | 1.2.0.42                            | LunatriusCore-1.12.2-1.2.0.42-universal.jar                 | None                                     |
       | LCHIJ | matc                              | 1.0.1-hotfix                        | matc-1.0.1-hotfix.jar                                       | None                                     |
       | LCHIJ | materialchanger                   | 1.0                                 | materialchanger1.0.3-1.12.2.jar                             | None                                     |
       | LCHIJ | immersivetech                     | 1.9.100                             | MCTImmersiveTechnology-1.12.2-1.9.100.jar                   | None                                     |
       | LCHIJ | mctsmelteryio                     | 1.2.63                              | MCTSmelteryIO-1.12.2-1.2.63.jar                             | None                                     |
       | LCHIJ | mechanics                         | 1.1                                 | mechanics-1.1.jar                                           | None                                     |
       | LCHIJ | mekanismgenerators                | 9.12.7                              | Mekanism-Community-Edition-1.12.2-9.12.7-Generators.jar     | None                                     |
       | LCHIJ | mekatweaker                       | 1.2.0                               | mekatweaker-1.12-1.2.0.jar                                  | None                                     |
       | LCHIJ | mia                               | 1.12.2-0.2.2a                       | mia-1.12.2-0.2.2a.jar                                       | None                                     |
       | LCHIJ | minemenu                          | 1.6.11                              | MineMenu-1.12.2-1.6.11-universal.jar                        | None                                     |
       | LCHIJ | mineraltracker                    | \${version}                          | MineralTracker-0.9.3.jar                                    | None                                     |
       | LCHIJ | minieffects                       | 1.1.0                               | MiniEffects-1.12.2-1.1.0.jar                                | None                                     |
       | LCHIJ | miningspeed2                      | 1.7                                 | miningspeed2-1.7.jar                                        | None                                     |
       | LCHIJ | testdummy                         | 1.12                                | MmmMmmMmmMmm-1.12-1.14.jar                                  | None                                     |
       | LCHIJ | moredefaultoptions                | 1.12-0.0.2                          | moredefaultoptions-1.12-0.0.2.jar                           | None                                     |
       | LCHIJ | moreoverlays                      | 1.15.1                              | moreoverlays-1.15.1-mc1.12.2.jar                            | None                                     |
       | LCHIJ | mysticalcreations                 | 1.6.1                               | MysticalCreations-1.12.2-1.6.1.jar                          | None                                     |
       | LCHIJ | naturescompass                    | 1.8.5                               | NaturesCompass-1.12.2-1.8.5.jar                             | None                                     |
       | LCHIJ | reactorbuilder                    | 1.0.2                               | NC-ReactorBuilder-1.12.2-1.0.4b.jar                         | None                                     |
       | LCHIJ | neat                              | 1.4-17                              | Neat 1.4-17.jar                                             | None                                     |
       | LCHIJ | psi                               | r1.1-78                             | Psi-r1.1-78.2.jar                                           | None                                     |
       | LCHIJ | plustic                           | 8.0.5                               | plustic-8.0.5.jar                                           | None                                     |
       | LCHIJ | wawla                             | 2.6.275                             | Wawla-1.12.2-2.6.275.jar                                    | d476d1b22b218a10d845928d1665d45fce301b27 |
       | LCHIJ | netherendingores                  | 1.12.2-1.4.2                        | Netherending-Ores-1.12.2-1.4.2.jar                          | None                                     |
       | LCHIJ | netherportalfix                   | 5.3.17                              | NetherPortalFix_1.12.1-5.3.17.jar                           | None                                     |
       | LCHIJ | netherportalspread                | 5.4                                 | netherportalspread_1.12.2-5.4-patched.jar                   | None                                     |
       | LCHIJ | neenergistics                     | @VERSION@                           | NotEnoughEnergistics-1.12.2-2.0.5-2.0.5.jar                 | None                                     |
       | LCHIJ | nutrition                         | 4.9.0                               | Nutrition-1.12.2-4.9.0.jar                                  | None                                     |
       | LCHIJ | oreexcavation                     | 1.4.150                             | OreExcavation-1.4.150.jar                                   | None                                     |
       | LCHIJ | oeintegration                     | 2.3.4                               | oeintegration-2.3.4-patched.jar                             | None                                     |
       | LCHIJ | oldjava                           | 1.1.11                              | OldJavaWarning-1.12.2-1.1.11-patched.jar                    | None                                     |
       | LCHIJ | openmods                          | 0.12.2                              | OpenModsLib-1.12.2-0.12.2.jar                               | d2a9a8e8440196e26a268d1f3ddc01b2e9c572a5 |
       | LCHIJ | openblocks                        | 1.8.1                               | OpenBlocks-1.12.2-1.8.1.jar                                 | d2a9a8e8440196e26a268d1f3ddc01b2e9c572a5 |
       | LCHIJ | overpoweredarmorbar               | @VERSION@                           | overloadedarmorbar-1.0.4g.jar                               | None                                     |
       | LCHIJ | packagedauto                      | 1.12.2-1.0.8.31                     | PackagedAuto-1.12.2-1.0.8.31.jar                            | None                                     |
       | LCHIJ | packagedastral                    | 1.12.2-1.0.1.7                      | PackagedAstral-1.12.2-1.0.1.7.jar                           | None                                     |
       | LCHIJ | packageddraconic                  | 1.12.2-1.0.0.5                      | PackagedDraconic-1.12.2-1.0.0.5.jar                         | None                                     |
       | LCHIJ | packagedexcrafting                | 1.12.2-1.0.2.10                     | PackagedExCrafting-1.12.2-1.0.2.10.jar                      | None                                     |
       | LCHIJ | particleculling                   | v1.4.1                              | particleculling-1.12.2-v1.4.1.jar                           | None                                     |
       | LCHIJ | ping                              | 1.4.5                               | Ping-1.12.2-1.4.5.jar                                       | None                                     |
       | LCHIJ | placebo                           | 1.6.0                               | Placebo-1.12.2-1.6.0.jar                                    | None                                     |
       | LCHIJ | planefix                          | 1.0.0                               | PlaneFix-1.12.2-1.0.0.jar                                   | None                                     |
       | LCHIJ | plethora-core                     | 1.2.3                               | plethora-1.12.2-1.2.3-patched.jar                           | None                                     |
       | LCHIJ | plethora                          | 1.2.3                               | plethora-1.12.2-1.2.3-patched.jar                           | None                                     |
       | LCHIJ | plustweaks                        | 1.4.9                               | plustweaks-1.4.9.jar                                        | cab94c5dee94de53555271d8a376d237545d811c |
       | LCHIJ | pointer                           | 2.1                                 | pointer-2.1.jar                                             | None                                     |
       | LCHIJ | portabledrill                     | 1.2.1                               | portabledrill-1.2.1.jar                                     | None                                     |
       | LCHIJ | potioncore                        | 1.9_for_1.12.2                      | PotionCore-1.9_for_1.12.2.jar                               | None                                     |
       | LCHIJ | potiondescriptions                | 1.2.4                               | potiondescriptions-1.12.2-1.2.4.jar                         | None                                     |
       | LCHIJ | prettybeaches                     | 1.1.0                               | PrettyBeaches_1.12.2-1.1.0.jar                              | None                                     |
       | LCHIJ | projectintelligence               | 1.0.9                               | ProjectIntelligence-1.12.2-1.0.9.28-universal.jar           | None                                     |
       | LCHIJ | psicaster                         | 1.2                                 | psicaster-1.2.jar                                           | None                                     |
       | LCHIJ | psicosts                          | 1.0.3                               | psio-1.12.2-1.0.3.jar                                       | None                                     |
       | LCHIJ | qmd                               | 1.2.1                               | QMD-1.2.1-1.12.2.jar                                        | None                                     |
       | LCHIJ | quarkoddities                     | 1                                   | QuarkOddities-1.12.2.jar                                    | None                                     |
       | LCHIJ | randomtweaks                      | 1.12.2-2.8.3.1                      | randomtweaks-1.12.2-2.8.3.1.jar                             | 20d08fb3fe9c268a63a75d337fb507464c8aaccd |
       | LCHIJ | rats                              | 3.2.21                              | rats-3.2.21-1.12.2-patched.jar                              | None                                     |
       | LCHIJ | reauth                            | 4.0.7                               | ReAuth-1.12-Forge-4.0.7.jar                                 | daba0ec4df71b6da841768c49fb873def208a1e3 |
       | LCHIJ | reccomplex                        | 1.4.8.2                             | RecurrentComplex-1.4.8.2.jar                                | None                                     |
       | LCHIJ | redstonearsenal                   | 2.6.6                               | RedstoneArsenal-1.12.2-2.6.6.1-universal.jar                | None                                     |
       | LCHIJ | redstonerepository                | 1.3.2                               | RedstoneRepository-1.12.2-1.4.0-dev-universal.jar           | None                                     |
       | LCHIJ | requious                          | 1.0                                 | Requious Frakto-0.12-patched.jar                            | None                                     |
       | LCHIJ | resourceloader                    | 1.5.3                               | ResourceLoader-MC1.12.1-1.5.3.jar                           | d72e0dd57935b3e9476212aea0c0df352dd76291 |
       | LCHIJ | rftdimtweak                       | 1.1                                 | RFTDimTweak-1.12.2-1.1.jar                                  | None                                     |
       | LCHIJ | rftoolscontrol                    | 2.0.2                               | rftoolsctrl-1.12-2.0.2.jar                                  | None                                     |
       | LCHIJ | rftoolsdim                        | 5.71                                | rftoolsdim-1.12-5.71.jar                                    | None                                     |
       | LCHIJ | rockytweaks                       | @VERSION@                           | rockytweaks-1.12.2-0.6.1.jar                                | None                                     |
       | LCHIJ | jeid                              | 2.0.6                               | RoughlyEnoughIDs-2.0.6.jar                                  | None                                     |
       | LCHIJ | rttweaker                         | @VERSION@                           | rttweaker-1.2.jar                                           | None                                     |
       | LCHIE | scalingguis                       | @VERSION@                           | scalingguis-1.12.2-1.0.3.0.jar                              | None                                     |
       | LCHI  | silentlib                         | 3.0.13                              | SilentLib-1.12.2-3.0.14+168.jar                             | None                                     |
       | LCHI  | scalinghealth                     | 1.3.37                              | ScalingHealth-1.12.2-1.3.42+147-patched.jar                 | None                                     |
       | LCHI  | scannable                         | 1.6.3.26                            | Scannable-MC1.12.2-1.6.3.26.jar                             | None                                     |
       | LCHI  | schematica                        | 1.8.0.169                           | Schematica-1.12.2-1.8.0.169-universal.jar                   | None                                     |
       | LCHI  | searedladder                      | 1.1.2                               | Seared-Ladder-v1.1.2-mc1.12.2.jar                           | None                                     |
       | LCHI  | servertabinfo                     | 1.2.6                               | ServerTabInfo-1.12.2-1.2.6.jar                              | None                                     |
       | LCHI  | simple_trophies                   | 1.2.2                               | simpletrophies-1.2.2.1.jar                                  | None                                     |
       | LCHI  | sledgehammer                      | 1.12.2-2.0.23                       | Sledgehammer-1.12.2-2.0.23.jar                              | 565fa4dbf20e7c3c4423950ca8e0bdabf7568796 |
       | LCHI  | snowrealmagic                     | 0.7.1                               | SnowRealMagic-1.12.2-0.7.1.jar                              | None                                     |
       | LCHI  | soundphysics                      | 1.0.10-1                            | Sound-Physics-1.12.2-1.0.10-1.jar                           | None                                     |
       | LCHI  | spiceoflife                       | 1.3.12                              | SpiceOfLife-mc1.12-1.3.12.jar                               | None                                     |
       | LCHI  | sqpatch                           | 1.0.0                               | SqueezerPatch-1.12.2-1.0.0.jar                              | None                                     |
       | LCHI  | startuptimer                      | 1.0.0                               | startuptimer-1.0.1.jar                                      | None                                     |
       | LCHI  | supersoundmuffler                 | 1.0.2.10                            | supersoundmuffler-revived_1.12.2_1.0.2.10.jar               | None                                     |
       | LCHI  | tconevo                           | 1.0.44                              | tconevo-1.12.2-1.0.44.jar                                   | None                                     |
       | LCHI  | tconmodmod                        | 1.0.5                               | tconmodmod-1.12.2-1.0.5.jar                                 | None                                     |
       | LCHI  | terracart                         | 1.12.2-1.2.3                        | terracartreloaded-1.12.2-1.2.3.jar                          | None                                     |
       | LCHI  | thaumcraftaspectcreator           | 1.1                                 | thaumcraftaspectcreator-1.12.2-1.1.jar                      | None                                     |
       | LCHI  | tcresearchpatcher                 | 1.12.2-1.1.3                        | ThaumcraftResearchPatcher-1.12.2-1.1.3.jar                  | 8f678591ba6f78d579e553a8aa94b4c4766cb13d |
       | LCHI  | thaumicaugmentation               | 1.12.2-2.1.11                       | ThaumicAugmentation-1.12.2-2.1.11.jar                       | None                                     |
       | LCHI  | thaumcomp                         | 0.5.1                               | ThaumicComputers-MC1.12.2-0.5.1.jar                         | None                                     |
       | LCHI  | thaumicjei                        | 1.6.0                               | ThaumicJEI-1.12.2-1.6.0-27.jar                              | None                                     |
       | LCHI  | thaumicenergistics                | 2.2.6                               | thaumicenergistics-extended_life-2.2.7.jar                  | None                                     |
       | LCHI  | tcinventoryscan                   | 2.0.10                              | ThaumicInventoryScanning_1.12.2-2.0.10.jar                  | None                                     |
       | LCHI  | thaumicspeedup                    | 4.0                                 | thaumicspeedup-4.0.jar                                      | None                                     |
       | LCHI  | thaumictinkerer                   | 1.12.2-5.0-620a0c5                  | thaumictinkerer-1.12.2-5.0-620a0c5.jar                      | None                                     |
       | LCHI  | thaumicwonders                    | 1.8.2                               | thaumicwonders-1.8.2-patched.jar                            | None                                     |
       | LCHI  | thaumtweaks                       | 0.3.5.3                             | thaumtweaks-0.3.5.3-patched.jar                             | None                                     |
       | LCHI  | thermaldynamics                   | 2.5.6                               | ThermalDynamics-1.12.2-2.5.6.1-universal.jar                | None                                     |
       | LCHI  | thermalinnovation                 | 0.3.6                               | ThermalInnovation-1.12.2-0.3.6.1-universal-patched.jar      | None                                     |
       | LCHI  | thermallogistics                  | 0.3-43                              | thermallogistics-0.3-43.jar                                 | None                                     |
       | LCHI  | tinkersaddons                     | 1.0.10                              | Tinkers' Addons-1.12.2-1.0.10.jar                           | None                                     |
       | LCHI  | tcomplement                       | 1.12.2-0.4.3                        | TinkersComplement-1.12.2-0.4.3.jar                          | None                                     |
       | LCHI  | tinkersjei                        | 1.2                                 | tinkersjei-1.2.jar                                          | None                                     |
       | LCHI  | tinkersoc                         | 0.6                                 | tinkersoc-0.6.jar                                           | None                                     |
       | LCHI  | tinkertoolleveling                | 1.12.2-1.1.0.DEV.b23e769            | TinkerToolLeveling-1.12.2-1.1.0.jar                         | None                                     |
       | LCHI  | tips                              | 1.0.9                               | Tips-1.12.2-1.0.9.jar                                       | d476d1b22b218a10d845928d1665d45fce301b27 |
       | LCHI  | tmel                              | 1.12.2-1.4.0.0                      | tmel-1.12.2-1.4.0.0.jar                                     | None                                     |
       | LCHI  | tombmanygraves                    | 1.12-4.2.0                          | TombManyGraves-1.12-4.2.0.jar                               | None                                     |
       | LCHI  | torohealthmod                     | 1.12.2-11                           | torohealth-1.12.2-11.jar                                    | None                                     |
       | LCHI  | toughnessbar                      | @VERSION@                           | toughnessbar-2.4.jar                                        | None                                     |
       | LCHI  | travelersbackpack                 | 1.0.35                              | TravelersBackpack-1.12.2-1.0.35-patched.jar                 | None                                     |
       | LCHI  | treetweaker                       | 1.6.1                               | treetweaker-1.6.1.jar                                       | None                                     |
       | LCHI  | trinity                           | 1.4.b                               | Trinity-1.4.b.jar                                           | None                                     |
       | LCHI  | triumph                           | 3.19.2                              | Triumph-1.12.2-3.19.2.jar                                   | None                                     |
       | LCHI  | ts2k16                            | 1.2.10                              | TS2K16-1.2.10.jar                                           | None                                     |
       | LCHI  | tweakedlib                        | 1.0.1                               | tweakedlib-1.0.1.jar                                        | None                                     |
       | LCHI  | tweakedexcavation                 | 1.0.1                               | tweakedexcavation-1.0.1.jar                                 | None                                     |
       | LCHI  | tweakedpetroleum                  | 1.3.0                               | tweakedpetroleum-1.3.0.jar                                  | None                                     |
       | LCHI  | tweakedpetroleumgas               | 1.1.2                               | tweakedpetroleumgas-1.1.2.jar                               | None                                     |
       | LCHI  | uteamcore                         | 2.2.5.226                           | u_team_core-1.12.2-2.2.5.226.jar                            | None                                     |
       | LCHI  | uberconduitprobe                  | 1.0.3                               | uberconduitprobe-1.0.3.jar                                  | None                                     |
       | LCHI  | universaltweaks                   | 1.12.2-1.6.0                        | UniversalTweaks-1.12.2-1.6.0.jar                            | None                                     |
       | LCHI  | usefulrailroads                   | 1.1.3.24                            | useful_railroads-1.12.2-1.1.3.24.jar                        | None                                     |
       | LCHI  | universalmodifiers                | 1.12.2-1.0.16.1                     | valkyrielib-1.12.2-2.0.20.1.jar                             | None                                     |
       | LCHI  | vaultopic                         | 2.2                                 | vaultopic-2.2.jar                                           | None                                     |
       | LCHI  | villagenames                      | 4.4.6                               | VillageNames-1.12.2-4.4.6.jar                               | None                                     |
       | LCHI  | villagermarket                    | 1.0.2                               | villager-market-1.12.2-1.0.2.jar                            | d476d1b22b218a10d845928d1665d45fce301b27 |
       | LCHI  | voidislandcontrol                 | 1.5.3                               | voidislandcontrol-1.5.3.jar                                 | None                                     |
       | LCHI  | wailaharvestability               | 1.1.12                              | WailaHarvestability-mc1.12-1.1.12.jar                       | None                                     |
       | LCHI  | wanionlib                         | 1.12.2-2.9                          | WanionLib-1.12.2-2.9.jar                                    | None                                     |
       | LCHI  | warptheory                        | 0.0.3.2                             | WarpTheory1.12.2-0.0.3.2.jar                                | None                                     |
       | LCHI  | wct                               | 3.12.97                             | WirelessCraftingTerminal-1.12.2-3.12.97.jar                 | 186bc454cd122c9c2f1aa4f95611254bcc543363 |
       | LCHI  | wft                               | 1.0.4                               | WirelessFluidTerminal-1.12.2-1.0.4.jar                      | 186bc454cd122c9c2f1aa4f95611254bcc543363 |
       | LCHI  | wit                               | 1.0.2                               | WirelessInterfaceTerminal-1.12.2-1.0.2.jar                  | 186bc454cd122c9c2f1aa4f95611254bcc543363 |
       | LCHI  | wpt                               | 1.0.3                               | WirelessPatternTerminal-1.12.2-1.0.3.jar                    | 186bc454cd122c9c2f1aa4f95611254bcc543363 |
       | LCHI  | xnet                              | 1.8.2                               | xnet-1.12-1.8.2-patched.jar                                 | None                                     |
       | LCHI  | xtones                            | 1.2.2                               | Xtones-1.2.2.jar                                            | None                                     |
       | LCHI  | ynot                              | 0.2.4                               | YNot-0.2.4.jar                                              | None                                     |
       | LCHI  | ydt                               | 1.1.0                               | YouDroppedThis-1.1.0.jar                                    | None                                     |
       | LCHI  | zentoolforge                      | 1.1                                 | zentoolforge-1.1.jar                                        | None                                     |
       | LCHI  | zenutils                          | 1.14.1                              | zenutils-1.14.1.jar                                         | None                                     |
       | LCHI  | kiwi                              | 0.5.3.32                            | Kiwi-1.12.2-0.5.3.32.jar                                    | None                                     |
       | LCHI  | solcarrot                         | 1.8.4                               | solcarrot-1.12.2-1.8.4.jar                                  | None                                     |
       | LCHI  | rf-capability-adapter             | 1.1.3                               | capabilityadapter-1.1.3.jar                                 | None                                     |
       | LCHI  | industrialwires                   | 1.7-39                              | IndustrialWires-1.7-39.jar                                  | None                                     |
       | LCHI  | ic2_tweaker                       | 0.2.1+build.4                       | ic2-tweaker-0.2.1+build.4.jar                               | None                                     |
       | LCHI  | betteranimalsplus                 | 9.0.1                               | betteranimalsplus-1.12.2-9.0.1-patched.jar                  | None                                     |
       | LCHI  | nimble                            | 0.0.2                               | Nimble-0.0.2.jar                                            | None                                     |
       | LCHI  | phosphor-lighting                 | 1.12.2-0.2.9.2                      | phosphor-1.12.2-0.2.9.2-SNAPSHOT-universal.jar              | None                                     |
       | LCHI  | jade                              | 0.1.0                               | Jade-0.1.0.jar                                              | None                                     |
       | LCHI  | armoryexpansion-conarm            | 2.0.0-alpha                         | armoryexpansion-2.0.0-alpha.jar                             | None                                     |
       | LCHI  | hungeroverhaul                    | 1.12.2-1.3.3.jenkins148             | HungerOverhaul-1.12.2-1.3.3.jenkins148.jar                  | None                                     |
       | LCHI  | ocsensors                         | 1.0.4                               | ocsensors-1.0.4-b23.jar                                     | None                                     |
       | LCHI  | teslacorelib_registries           | 1.0.18                              | tesla-core-lib-1.12.2-1.0.18.jar                            | None                                     |
       | LCHI  | tweakersconstructpostload         | 1.12.2-1.6.1                        | tweakersconstruct-1.12.2-1.6.1.jar                          | None                                     |
       | LCHI  | unidict                           | 1.12.2-3.0.10                       | UniDict-1.12.2-3.0.10.jar                                   | None                                     |
       | LCHI  | wrapup                            | 1.12-1.1.3                          | WrapUp-1.12-1.1.3.jar                                       | None                                     |
       | UD    | advancedrocketrycore              | 1                                   | minecraft.jar                                               | None                                     |
  Loaded coremods (and transformers): Aqua Acrobatics Transformer (AquaAcrobatics-1.15.3.jar)
                                        
                                      OTGCorePlugin (OTG-Core.jar)
                                        com.pg85.otg.forge.asm.excluded.OTGClassTransformer
                                      FluidDrawersCoreMod (fluiddrawers-1.12.2-1.0.7.jar)
                                        xyz.phanta.fluiddrawers.coremod.FluidDrawersClassTransformer
                                      AppleCore (AppleCore-mc1.12.2-3.4.0.jar)
                                        squeek.applecore.asm.TransformerModuleHandler
                                      CoTROCore (CoTRO-1.0.0-1.12.2.jar)
                                        dodd.cotro.core.Transformer
                                      SqueezerCore (SqueezerPatch-1.12.2-1.0.0.jar)
                                        shadows.squeezer.Transformer
                                      PhosphorFMLPlugin (phosphor-1.12.2-0.2.9.2-SNAPSHOT-universal.jar)
                                        
                                      DeepBloodEvolutionCore (DeepBloodEvolution-1.1.3-e.jar)
                                        com.glodblock.github.dmeblood.coremod.DBEClassTransformer
                                      CoreModLoader (Sound-Physics-1.12.2-1.0.10-1.jar)
                                        com.sonicether.soundphysics.CoreModInjector
                                      UniDictCoreMod (UniDict-1.12.2-3.0.10.jar)
                                        wanion.unidict.core.UniDictCoreModTransformer
                                      EnderCorePlugin (EnderCore-1.12.2-0.5.76-core.jar)
                                        com.enderio.core.common.transform.EnderCoreTransformer
                                        com.enderio.core.common.transform.SimpleMixinPatcher
                                      MekanismCoremod (Mekanism-Community-Edition-1.12.2-9.12.7-Core.jar)
                                        mekanism.coremod.KeybindingMigrationHelper
                                      BringMeTheRings plugin (BringMeTheRings-0.4.jar)
                                        zabi.minecraft.bmtr.core.BaublesTransformer
                                      AdvancedRocketryPlugin (AdvancedRocketry-1.12.2-2.0.0-13.jar)
                                        zmaster587.advancedRocketry.asm.ClassTransformer
                                      Startup Timer (startuptimer-1.0.1.jar)
                                        
                                      RandomPatches (randompatches-1.12.2-1.22.1.10.jar)
                                        com.therandomlabs.randompatches.core.RPTransformer
                                      Do not report to Forge! (If you haven't disabled the FoamFix coremod, try disabling it in the config! Note that this bit of text will still appear.) (foamfix-0.10.15-1.12.2.jar)
                                        pl.asie.foamfix.coremod.FoamFixTransformer
                                      ForgelinPlugin (Forgelin-1.8.4.jar)
                                        
                                      Persistency (persistency-1.2.0.jar)
                                        zone.rong.persistency.Persistency$ClientTransformer
                                      TweakedPetroleumPlugin (tweakedpetroleum-1.3.0.jar)
                                        
                                      JeiUtilitiesLoadingPlugin (JEI-Utilities-1.12.2-0.2.11.jar)
                                        com.github.vfyjxf.jeiutilities.asm.JeiUtilitiesClassTransformer
                                      Quark Plugin (QuarkRotN-r1.6-187-patched.jar)
                                        vazkii.quark.base.asm.ClassTransformer
                                      TweakedPetroleumGasPlugin (tweakedpetroleumgas-1.1.2.jar)
                                        
                                      iceandfire (iceandfire-1.9.1-1.12.2-patched.jar)
                                        com.github.alexthe666.iceandfire.patcher.IceAndFireRuntimePatcher
                                      Fluidlogged API Plugin (Fluidlogged-API-v2.2.4-mc1.12.2.jar)
                                        git.jbredwards.fluidlogged_api.mod.asm.ASMHandler$Transformer
                                        git.jbredwards.fluidlogged_api.mod.asm.transformers.TransformerLevelProperty
                                        git.jbredwards.fluidlogged_api.mod.asm.transformers.TransformerSmoothWater
                                      llibrary (llibrary-core-1.0.11-1.12.2.jar)
                                        net.ilexiconn.llibrary.server.core.plugin.LLibraryTransformer
                                        net.ilexiconn.llibrary.server.core.patcher.LLibraryRuntimePatcher
                                      BNBGamingCore (BNBGamingCore-1.12.2-0.12.0.jar)
                                        com.bloodnbonesgaming.bnbgamingcore.core.BNBGamingCoreClassTransformer
                                      AstralCore (astralsorcery-1.12.2-1.10.27.jar)
                                        
                                      PlusTweaksFMLLoadingPlugin (plustweaks-1.4.9.jar)
                                        
                                      PointerLoadingPlugin (pointer-2.1.jar)
                                        
                                      TARCore (ThaumicAdditions-1.12.2-12.7.8.jar)
                                        
                                      ZenUtilsPlugin (zenutils-1.14.1.jar)
                                        
                                      TransformerLoader (OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar)
                                        li.cil.oc.common.asm.ClassTransformer
                                      PluginLoader (MemoryTester-0.4.2.jar)
                                        
                                      IELoadingPlugin (ImmersiveEngineering-core-0.12-98.jar)
                                        blusunrize.immersiveengineering.common.asm.IEClassTransformer
                                      EngineersDoorsLoadingPlugin (engineers_doors-1.12.2-0.9.1.jar)
                                        nihiltres.engineersdoors.common.asm.EngineersDoorsClassTransformer
                                      Botania Tweaks Core (botaniatweaks-1.9.1-patched.jar)
                                        quaternary.botaniatweaks.asm.BotaniaTweakerTransformer
                                      -Bansoukou- (_bansoukou-4.3.1.jar)
                                        
                                      ParticleCullingLoadingPlugin (particleculling-1.12.2-v1.4.1.jar)
                                        
                                      LoadingPlugin (ChunkAnimator-1.12.2-1.2.1.jar)
                                        lumien.chunkanimator.asm.ClassTransformer
                                      MixinLoader (miningspeed2-1.7.jar)
                                        
                                      PatcherFMLPlugin (ic2patcher-2.0.3.jar)
                                        mods.su5ed.ic2patcher.asm.PatcherClassTransformer
                                      BiomeTweakerCore (BiomeTweakerCore-1.12.2-1.0.39.jar)
                                        me.superckl.biometweakercore.BiomeTweakerASMTransformer
                                      LoadingPlugin (RandomThings-MC1.12.2-4.2.7.4-patched.jar)
                                        lumien.randomthings.asm.ClassTransformer
                                      ColytraLoadingPlugin (colytra-1.12.2-1.2.0.4.jar)
                                        c4.colytra.asm.ElytraTransformer
                                      LittlePatchingLoader (LittleTiles_v1.5.72_mc1.12.2.jar)
                                        com.creativemd.littletiles.LittleTilesTransformer
                                      TconEvoCoreMod (tconevo-1.12.2-1.0.44.jar)
                                        xyz.phanta.tconevo.coremod.TconEvoClassTransformer
                                      LoadingPlugin (ResourceLoader-MC1.12.1-1.5.3.jar)
                                        lumien.resourceloader.asm.ClassTransformer
                                      ToolProgressionPlugin (toolprogression-core-1.12.2-1.6.12.jar)
                                        tyra314.toolprogression.core.asm.ToolProgressionClassTransformer
                                      IvToolkit (IvToolkit-1.3.3-1.12.jar)
                                        
                                      LootrCore (lootr-1.12.2-0.6.1.jar)
                                        
                                      LoliASM (censoredasm5.8.jar)
                                        
                                      TweakedExcavationPlugin (tweakedexcavation-1.0.1.jar)
                                        
                                      UniversalTweaksCore (UniversalTweaks-1.12.2-1.6.0.jar)
                                        
                                      NEELoadingPlugin (NotEnoughEnergistics-1.12.2-2.0.5-2.0.5.jar)
                                        com.github.vfyjxf.nee.asm.NEEClassTransformer
                                      Inventory Tweaks Coremod (InventoryTweaks-1.64+dev.151.jar)
                                        invtweaks.forge.asm.ContainerTransformer
                                      MixinBooter (!mixinbooter-7.1.jar)
                                        
                                      Thaumcraft Research Patcher Core Plugin (ThaumcraftResearchPatcher-1.12.2-1.1.3.jar)
                                        thecodex6824.tcresearchpatcher.Transformer
                                      Thaumic Augmentation Core Plugin (ThaumicAugmentation-1.12.2-2.1.11.jar)
                                        thecodex6824.thaumicaugmentation.core.TATransformer
                                      ratscore (rats-3.2.21-1.12.2-patched.jar)
                                        com.github.alexthe666.rats.server.misc.RatsRuntimePatcher
                                      CreativePatchingLoader (CreativeCore_v1.10.70_mc1.12.2.jar)
                                        
                                      OpenModsCorePlugin (OpenModsLib-1.12.2-0.12.2.jar)
                                        openmods.core.OpenModsClassTransformer
                                      FluidCraftCore (Fluid Craft for AE2-2.4.22-r.jar)
                                        com.glodblock.github.coremod.FCClassTransformer
                                      CorePlugin (SmoothFont-mc1.12.2-2.1.4.jar)
                                        bre.smoothfont.asm.Transformer
                                      CTMCorePlugin (CTM-MC1.12.2-1.0.2.31.jar)
                                        team.chisel.ctm.client.asm.CTMTransformer
                                      Snow! Real Magic! (SnowRealMagic-1.12.2-0.7.1.jar)
                                        
                                      CoreMod (MiniEffects-1.12.2-1.1.0.jar)
                                        
                                      HCASM (HammerLib-1.12.2-2.0.6.32.jar)
                                        com.zeitheron.hammercore.asm.HammerCoreTransformer
                                      ForkedProxyPlugin (forkedproxy-1.0.1.jar)
                                        
                                      JustEnoughIDs Extension Plugin (RoughlyEnoughIDs-2.0.6.jar)
                                        org.dimdev.jeid.JEIDTransformer
                                      Better Biome Blend (betterbiomeblend-1.12.2-1.1.7-forge.jar)
                                        
                                      AE2ELCore (appliedenergistics2-rv6-stable-7-extended_life-v0.55.14.jar)
                                        appeng.core.transformer.AE2ELTransformer
  GL info: ' Vendor: 'Apple' Version: '2.1 Metal - 76.3' Renderer: 'Apple M1'
  OpenModsLib class transformers: [llama_null_fix:FINISHED],[horse_base_null_fix:FINISHED],[pre_world_render_hook:FINISHED],[player_render_hook:FINISHED],[horse_null_fix:FINISHED]
  Ender IO: Found the following problem(s) with your installation (That does NOT mean that Ender IO caused the crash or was involved in it in any way. We add this information to help finding common problems, not as an invitation to post any crash you encounter to Ender IO's issue tracker. Always check the stack trace above to see which mod is most likely failing.):
                              * Optifine is installed. This is NOT supported.
                             This may (look up the meaning of 'may' in the dictionary if you're not sure what it means) have caused the error. Try reproducing the crash WITHOUT this/these mod(s) before reporting it.
            Authlib is : /Users/galahad/Documents/curseforge/minecraft/Install/libraries/com/mojang/authlib/1.5.25/authlib-1.5.25.jar
            
            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            !!!You are looking at the diagnostics information, not at the crash.       !!!
            !!!Scroll up until you see the line with '---- Minecraft Crash Report ----'!!!
            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  Pulsar/tconstruct loaded Pulses: - TinkerCommons (Enabled/Forced)
                                   - TinkerWorld (Enabled/Not Forced)
                                   - TinkerTools (Enabled/Not Forced)
                                   - TinkerHarvestTools (Enabled/Forced)
                                   - TinkerMeleeWeapons (Enabled/Forced)
                                   - TinkerRangedWeapons (Enabled/Forced)
                                   - TinkerModifiers (Enabled/Forced)
                                   - TinkerSmeltery (Enabled/Not Forced)
                                   - TinkerGadgets (Enabled/Not Forced)
                                   - TinkerOredict (Enabled/Forced)
                                   - TinkerIntegration (Enabled/Forced)
                                   - TinkerFluids (Enabled/Forced)
                                   - TinkerMaterials (Enabled/Forced)
                                   - TinkerModelRegister (Enabled/Forced)
                                   - chiselIntegration (Enabled/Not Forced)
                                   - craftingtweaksIntegration (Enabled/Not Forced)
                                   - wailaIntegration (Enabled/Not Forced)
                                   - quarkIntegration (Enabled/Not Forced)
  AE2 Version: stable rv6-stable-7-extended_life-v0.55.14 for Forge 14.23.5.2847
  HammerCore Debug Information: Dependent Mods:
                                -Thaumic Additions: Reconstructed (thaumadditions) @ 12.7.8
  Pulsar/tcomplement loaded Pulses: - ModuleCommons (Enabled/Forced)
                                    - ModuleMelter (Enabled/Not Forced)
                                    - ModuleArmor (Enabled/Not Forced)
                                    - ModuleSteelworks (Enabled/Not Forced)
                                    - ChiselPlugin (Enabled/Not Forced)
                                    - ExNihiloPlugin (Enabled/Not Forced)
                                    - ToolLevelingPlugin (Enabled/Not Forced)
                                    - Oredict (Enabled/Forced)
  List of loaded APIs: * actuallyadditionsapi (34) from ActuallyAdditions-1.12.2-r152-patched.jar
                       * ae2wtlib|API (1.0.34) from AE2WTLib-1.12.2-1.0.34.jar
                       * AppleCoreAPI (3.4.0) from AppleCore-mc1.12.2-3.4.0.jar
                       * appliedenergistics2|API (rv6) from appliedenergistics2-rv6-stable-7-extended_life-v0.55.14.jar
                       * Base|API (1.0.0) from base-1.12.2-3.14.0.jar
                       * Baubles|API (1.4.0.2) from Baubles-1.12-1.5.2.jar
                       * betteradvancements|API (0.1.0.77) from BetterAdvancements-1.12.2-0.1.0.77.jar
                       * BetterHurtTimerAPI (0) from BetterHurtTimer-1.12.2-1.5.0.1.jar
                       * BetterWithModsAPI (Beta 0.6) from AppleSkin-mc1.12-1.0.14.jar
                       * BiomeTweakerAPI (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * BiomeTweakerAPI|block (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * BiomeTweakerAPI|event (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * BiomeTweakerAPI|property (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * BiomeTweakerAPI|script (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * BiomeTweakerAPI|script|object (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * BiomeTweakerAPI|script|pack (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * BiomeTweakerAPI|script|wrapper (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * BiomeTweakerAPI|world|gen|feature (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * bloodmagic-api (2.0.0) from BloodMagic-1.12.2-2.4.3-105.jar
                       * BotaniaAPI (93) from Botania r1.10-364.4-patched.jar
                       * Chisel-API (0.0.1) from Chisel-MC1.12.2-1.0.2.45.jar
                       * ChiselAPI|Carving (0.0.1) from Chisel-MC1.12.2-1.0.2.45.jar
                       * cofhapi (2.5.0) from CoFHCore-1.12.2-4.6.6.1-universal.jar
                       * commoncapabilities|api (0.0.1) from CommonCapabilities-1.12.2-2.4.8.jar
                       * ComputerCraft|API (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * ComputerCraft|API|FileSystem (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * ComputerCraft|API|Lua (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * ComputerCraft|API|Media (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * ComputerCraft|API|Network (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * ComputerCraft|API|Network|Wired (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * ComputerCraft|API|Peripheral (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * ComputerCraft|API|Permissions (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * ComputerCraft|API|Redstone (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * ComputerCraft|API|Turtle (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * ComputerCraft|API|Turtle|Event (1.89.2) from cc-tweaked-1.12.2-1.89.2-patched.jar
                       * cosmeticarmorreworked|api (1.0.0) from CosmeticArmorReworked-1.12.2-v5a.jar
                       * CraftingTweaks|API (4.1) from CraftingTweaks_1.12.2-9.0.1.jar
                       * ctm-api (0.1.0) from CTM-MC1.12.2-1.0.2.31.jar
                       * ctm-api-events (0.1.0) from CTM-MC1.12.2-1.0.2.31.jar
                       * ctm-api-models (0.1.0) from CTM-MC1.12.2-1.0.2.31.jar
                       * ctm-api-textures (0.1.0) from CTM-MC1.12.2-1.0.2.31.jar
                       * ctm-api-utils (0.1.0) from CTM-MC1.12.2-1.0.2.31.jar
                       * Culinary Construct API (1) from culinaryconstruct-1.3.4.jar
                       * DraconicEvolution|API (1.3) from Draconic-Evolution-1.12.2-2.3.28.354-universal.jar
                       * DroptAPI (4) from dropt-1.12.2-1.19.3.jar
                       * enderioapi (4.0.0) from EnderIO-1.12.2-5.3.70-patched.jar
                       * enderioapi|addon (4.0.0) from EnderIO-1.12.2-5.3.70-patched.jar
                       * enderioapi|capacitor (4.0.0) from EnderIO-1.12.2-5.3.70-patched.jar
                       * enderioapi|conduits (4.0.0) from EnderIO-1.12.2-5.3.70-patched.jar
                       * enderioapi|farm (4.0.0) from EnderIO-1.12.2-5.3.70-patched.jar
                       * enderioapi|redstone (4.0.0) from EnderIO-1.12.2-5.3.70-patched.jar
                       * enderioapi|teleport (4.0.0) from EnderIO-1.12.2-5.3.70-patched.jar
                       * enderioapi|tools (4.0.0) from EnderIO-1.12.2-5.3.70-patched.jar
                       * enderioapi|upgrades (4.0.0) from EnderIO-1.12.2-5.3.70-patched.jar
                       * ExCompressum|API (1.0) from ExCompressum_1.12.2-3.0.32-patched.jar
                       * farmingforblockheads|api (1.0) from FarmingForBlockheads_1.12.2-3.1.28.jar
                       * ForestryAPI|apiculture (5.0.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|arboriculture (4.3.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|book (5.8.1) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|circuits (3.1.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|climate (5.0.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|core (5.7.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|farming (5.8.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|food (1.1.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|fuels (3.0.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|genetics (5.7.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|gui (5.8.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|hives (4.1.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|lepidopterology (1.4.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|mail (3.1.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|modules (5.7.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|multiblock (3.0.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|recipes (5.4.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|storage (5.0.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * ForestryAPI|world (2.1.0) from forestry_1.12.2-5.8.2.422-patched.jar
                       * gendustryAPI (2.3.0) from gendustry-1.6.5.8-mc1.12.2.jar
                       * Guide-API|API (2.0.0) from Guide-API-1.12-2.1.8-63.jar
                       * ImmersiveEngineering|API (1.0) from ImmersiveEngineering-0.12-98-patched.jar
                       * ImmersiveEngineering|ImmersiveFluxAPI (1.0) from ImmersiveEngineering-0.12-98-patched.jar
                       * industrialforegoingapi (5) from industrialforegoing-1.12.2-1.12.13-237.jar
                       * integrateddynamics|api (0.2.0) from IntegratedDynamics-1.12.2-1.1.11-patched.jar
                       * jeresources|API (0.9.3.203) from JustEnoughResources-1.12.2-0.9.3.203-patched.jar
                       * journeymap|client-api (1.4) from journeymap-1.12.2-5.7.1.jar
                       * journeymap|client-api-display (1.4) from journeymap-1.12.2-5.7.1.jar
                       * journeymap|client-api-event (1.4) from journeymap-1.12.2-5.7.1.jar
                       * journeymap|client-api-model (1.4) from journeymap-1.12.2-5.7.1.jar
                       * journeymap|client-api-util (1.4) from journeymap-1.12.2-5.7.1.jar
                       * JustEnoughItemsAPI (4.13.0) from HadEnoughItems_1.12.2-4.25.0.jar
                       * MekanismAPI|core (9.8.1) from Mekanism-Community-Edition-1.12.2-9.12.7-Core.jar
                       * MekanismAPI|energy (9.8.1) from Mekanism-Community-Edition-1.12.2-9.12.7-Core.jar
                       * MekanismAPI|gas (9.8.1) from Mekanism-Community-Edition-1.12.2-9.12.7-Core.jar
                       * MekanismAPI|infuse (9.8.1) from Mekanism-Community-Edition-1.12.2-9.12.7-Core.jar
                       * MekanismAPI|laser (9.8.1) from Mekanism-Community-Edition-1.12.2-9.12.7-Core.jar
                       * MekanismAPI|transmitter (9.8.1) from Mekanism-Community-Edition-1.12.2-9.12.7-Core.jar
                       * MekanismAPI|util (9.0.0) from Mekanism-Community-Edition-1.12.2-9.12.7-Core.jar
                       * MouseTweaks|API (1.0) from MouseTweaks-3.1.2-mc1.12.2.jar
                       * openblocks|api (1.2) from OpenBlocks-1.12.2-1.8.1.jar
                       * opencomputersapi|component (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * opencomputersapi|core (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * opencomputersapi|driver (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * opencomputersapi|driver|item (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * opencomputersapi|event (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * opencomputersapi|filesystem (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * opencomputersapi|internal (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * opencomputersapi|machine (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * opencomputersapi|manual (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * opencomputersapi|network (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * opencomputersapi|prefab (7.0.0-alpha) from OpenComputers-MC1.12.2-1.8.2+b4abbf9-patched.jar
                       * PatchouliAPI (6) from Patchouli-1.0-23.6.jar
                       * PsiAPI (16) from Psi-r1.1-78.2.jar
                       * QuarkAPI (4) from QuarkRotN-r1.6-187-patched.jar
                       * redstonefluxapi (2.1.1) from RedstoneFlux-1.12-2.1.1.1-universal.jar
                       * ScalingHealthAPI (2) from ScalingHealth-1.12.2-1.3.42+147-patched.jar
                       * SchematicaAPI (1.1) from Schematica-1.12.2-1.8.0.169-universal.jar
                       * SchematicaAPI|Events (1.1) from Schematica-1.12.2-1.8.0.169-universal.jar
                       * sonarapi (1.0.1) from sonarcore-1.12.2-5.0.19-20.jar
                       * StorageDrawersAPI (2.1.0) from StorageDrawers-1.12.2-5.4.2.jar
                       * StorageDrawersAPI|event (2.1.0) from StorageDrawers-1.12.2-5.4.2.jar
                       * StorageDrawersAPI|registry (2.1.0) from StorageDrawers-1.12.2-5.4.2.jar
                       * StorageDrawersAPI|render (2.1.0) from StorageDrawers-1.12.2-5.4.2.jar
                       * StorageDrawersAPI|storage (2.1.0) from StorageDrawers-1.12.2-5.4.2.jar
                       * StorageDrawersAPI|storage-attribute (2.1.0) from StorageDrawers-1.12.2-5.4.2.jar
                       * SuperScript (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * SuperScript|script (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * SuperScript|script|command (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * SuperScript|script|object (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * SuperScript|util (1.8.369) from BiomeTweaker-1.12.2-3.2.369.jar
                       * tcresearchpatcherapi (1.1.0) from ThaumcraftResearchPatcher-1.12.2-1.1.3.jar
                       * Thaumcraft|API (6.0.2) from Thaumcraft-1.12.2-6.1.BETA26-patched.jar
                       * thaumicaugmentationapi (2.1.11) from ThaumicAugmentation-1.12.2-2.1.11.jar
                       * valkyrielib.api (1.12.2-2.0.10a) from valkyrielib-1.12.2-2.0.20.1.jar
                       * WailaAPI (1.3) from Hwyla-1.8.26-B41_1.12.2.jar
                       * wct|api (1.1) from WirelessCraftingTerminal-1.12.2-3.12.97.jar
                       * wft|api (1.0.4) from WirelessFluidTerminal-1.12.2-1.0.4.jar
                       * WIT-API (2) from ScalingHealth-1.12.2-1.3.42+147-patched.jar
                       * wit|api (1.0.2) from WirelessInterfaceTerminal-1.12.2-1.0.2.jar
                       * wpt|api (1.0.3) from WirelessPatternTerminal-1.12.2-1.0.3.jar
  Patchouli open book context: n/a
  Extended Crafting: Nomifactory Edition: You are using a fork of Extended Crafting created for the Nomifactory modpack.
                                          If the error above is a NoSuchFieldError or a NoSuchMethodError relating to
                                          com.blakebr0.extendedcrafting,
                                          then please report to https://github.com/Nomifactory/ExtendedCrafting/issues
                                          with this crash report.
                                          Otherwise, you can ignore this message.
  [Psi] Active spell: None
  forestry : Modules have been disabled in the config: Crate
  AE2 Integration: IC2:ON, GTCE:OFF, RC:OFF, MFR:OFF, Waila:ON, InvTweaks:ON, JEI:ON, Mekanism:ON, OpenComputers:ON, THE_ONE_PROBE:OFF, TESLA:OFF, CRAFTTWEAKER:ON
  Suspected Mods: ScalingGUIs (scalingguis), Forge Mod Loader (FML), Minecraft Forge (forge)
  Launched Version: forge-14.23.5.2860
  LWJGL: 2.9.2
  OpenGL: Apple M1 GL version 2.1 Metal - 76.3, Apple
  GL Caps: VboRegions not supported, missing: OpenGL 1.3, ARB_copy_buffer
           Using GL 1.3 multitexturing.
           Using GL 1.3 texture combiners.
           Using framebuffer objects because ARB_framebuffer_object is supported and separate blending is supported.
           Shaders are available because OpenGL 2.1 is supported.
           VBOs are available because OpenGL 1.5 is supported.
  Using VBOs: Yes
  Is Modded: Definitely; Client brand changed to 'fml,forge'
  Type: Client (map_client.txt)
  Resource Packs: 
  Current Language: English (US)
  Profiler Position: N/A (disabled)
  CPU: 8x Apple M1
`