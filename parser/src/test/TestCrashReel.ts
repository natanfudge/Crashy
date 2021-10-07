export const TestCrashReel = `---- Minecraft Crash Report ----
// You're mean.

Time: 10/7/21 8:45 PM
Description: Ticking memory connection

java.lang.NullPointerException: Ticking memory connection
\tat java.lang.invoke.MethodHandle.invokeWithArguments(MethodHandle.java:625) ~[?:1.8.0_51] {}
\tat me.shedaniel.architectury.event.EventFactory.invokeMethod(EventFactory.java:71) ~[?:?] {re:classloading}
\tat me.shedaniel.architectury.event.EventFactory.access$000(EventFactory.java:42) ~[?:?] {re:classloading}
\tat me.shedaniel.architectury.event.EventFactory$1.handleInvocation(EventFactory.java:80) ~[?:?] {re:classloading}
\tat com.google.common.reflect.AbstractInvocationHandler.invoke(AbstractInvocationHandler.java:84) ~[guava-21.0.jar:?] {}
\tat com.sun.proxy.$Proxy93.join(Unknown Source) ~[?:?] {}
\tat me.shedaniel.architectury.event.forge.EventHandlerImplCommon.event(EventHandlerImplCommon.java:110) ~[?:?] {re:classloading}
\tat net.minecraftforge.eventbus.ASMEventHandler_638_EventHandlerImplCommon_event_PlayerLoggedInEvent.invoke(.dynamic) ~[?:?] {}
\tat net.minecraftforge.eventbus.ASMEventHandler.invoke(ASMEventHandler.java:85) ~[eventbus-4.0.0.jar:?] {}
\tat net.minecraftforge.eventbus.EventBus$$Lambda$2564/2052461152.invoke(Unknown Source) ~[?:?] {}
\tat net.minecraftforge.eventbus.EventBus.post(EventBus.java:302) ~[eventbus-4.0.0.jar:?] {}
\tat net.minecraftforge.eventbus.EventBus.post(EventBus.java:283) ~[eventbus-4.0.0.jar:?] {}
\tat net.minecraftforge.fml.hooks.BasicEventHooks.firePlayerLoggedIn(BasicEventHooks.java:44) ~[?:?] {re:classloading}
\tat net.minecraft.server.management.PlayerList.func_72355_a(PlayerList.java:231) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:libx.mixins.json:MixinPlayerList,pl:mixin:APP:kubejs-common.mixins.json:PlayerListMixin,pl:mixin:A}
\tat net.minecraft.network.login.ServerLoginNetHandler.func_147326_c(ServerLoginNetHandler.java:118) ~[?:?] {re:classloading}
\tat net.minecraft.network.login.ServerLoginNetHandler.func_73660_a(ServerLoginNetHandler.java:65) ~[?:?] {re:classloading}
\tat net.minecraft.network.NetworkManager.func_74428_b(NetworkManager.java:222) ~[?:?] {re:classloading,re:mixin}
\tat net.minecraft.network.NetworkSystem.func_151269_c(NetworkSystem.java:134) ~[?:?] {re:classloading}
\tat net.minecraft.server.MinecraftServer.func_71190_q(MinecraftServer.java:865) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:structure_gel.mixins.json:MinecraftServerMixin,pl:mixin:APP:kubejs-common.mixins.json:MinecraftServerMixin,pl:mixin:APP:jaopca.mixins.json:MinecraftServerMixin,pl:mixin:A}
\tat net.minecraft.server.MinecraftServer.func_71217_p(MinecraftServer.java:787) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:structure_gel.mixins.json:MinecraftServerMixin,pl:mixin:APP:kubejs-common.mixins.json:MinecraftServerMixin,pl:mixin:APP:jaopca.mixins.json:MinecraftServerMixin,pl:mixin:A}
\tat net.minecraft.server.integrated.IntegratedServer.func_71217_p(IntegratedServer.java:78) ~[?:?] {re:mixin,pl:runtimedistcleaner:A,re:classloading,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinIntegratedServer,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.server.MinecraftServer.func_240802_v_(MinecraftServer.java:642) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:structure_gel.mixins.json:MinecraftServerMixin,pl:mixin:APP:kubejs-common.mixins.json:MinecraftServerMixin,pl:mixin:APP:jaopca.mixins.json:MinecraftServerMixin,pl:mixin:A}
\tat net.minecraft.server.MinecraftServer.func_240783_a_(MinecraftServer.java:232) ~[?:?] {re:mixin,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B,pl:mixin:APP:structure_gel.mixins.json:MinecraftServerMixin,pl:mixin:APP:kubejs-common.mixins.json:MinecraftServerMixin,pl:mixin:APP:jaopca.mixins.json:MinecraftServerMixin,pl:mixin:A}
\tat net.minecraft.server.MinecraftServer$$Lambda$24637/1252351914.run(Unknown Source) ~[?:?] {}
\tat java.lang.Thread.run(Thread.java:745) ~[?:1.8.0_51] {}


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- System Details --
Details:
\tMinecraft Version: 1.16.5
\tMinecraft Version ID: 1.16.5
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 1.8.0_51, Oracle Corporation
\tJava VM Version: Java HotSpot(TM) 64-Bit Server VM (mixed mode), Oracle Corporation
\tMemory: 2052833000 bytes (1957 MB) / 4166516736 bytes (3973 MB) up to 7635730432 bytes (7282 MB)
\tCPUs: 4
\tJVM Flags: 5 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xss1M -Xmx8192m -Xms256m -XX:PermSize=256m
\tModLauncher: 8.0.9+86+master.3cf110c
\tModLauncher launch target: fmlclient
\tModLauncher naming: srg
\tModLauncher services: 
\t\t/mixin-0.8.2.jar mixin PLUGINSERVICE 
\t\t/eventbus-4.0.0.jar eventbus PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.2.jar object_holder_definalize PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.2.jar runtime_enum_extender PLUGINSERVICE 
\t\t/accesstransformers-3.0.1.jar accesstransformer PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.2.jar capability_inject_definalize PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.2.jar runtimedistcleaner PLUGINSERVICE 
\t\t/mixin-0.8.2.jar mixin TRANSFORMATIONSERVICE 
\t\t/forge-1.16.5-36.2.2.jar fml TRANSFORMATIONSERVICE 
\tFML: 36.2
\tForge: net.minecraftforge:36.2.2
\tFML Language Providers: 
\t\tjavafml@36.2
\t\tminecraft@1
\tMod List: 
\t\trsrequestify-1.16.5-2.1.3.jar                     |RSRequestify                  |rsrequestify                  |2.1.3               |DONE      |Manifest: NOSIGNATURE
\t\tCyclopsCore-1.16.5-1.11.9.jar                     |Cyclops Core                  |cyclopscore                   |1.11.9              |DONE      |Manifest: NOSIGNATURE
\t\tnotenoughcrashes-3.2.0-forge.jar                  |Not Enough Crashes            |notenoughcrashes              |3.2.0               |DONE      |Manifest: NOSIGNATURE
\t\tDungeonsMod-1.16.3-1.4.40.jar                     |Dungeons Mod                  |dungeonsmod                   |1.16.3-1.4.40       |DONE      |Manifest: NOSIGNATURE
\t\tHats-1.16.5-10.3.1.jar                            |Hats                          |hats                          |10.3.1              |DONE      |Manifest: NOSIGNATURE
\t\tPiratesAndLootersMotionUpdate.jar                 |PiratesAndLootersReborn       |piratesandlootersreborn       |1.0.0               |DONE      |Manifest: NOSIGNATURE
\t\tExtendedCrafting-1.16.5-3.1.7.jar                 |Extended Crafting             |extendedcrafting              |3.1.7               |DONE      |Manifest: NOSIGNATURE
\t\tincontrol-1.16-5.2.1.jar                          |InControl                     |incontrol                     |1.16-5.2.1          |DONE      |Manifest: NOSIGNATURE
\t\tUppers-0.3.2.jar                                  |Uppers                        |uppers                        |0.3.2               |DONE      |Manifest: NOSIGNATURE
\t\tmcw-windows-2.0.0-mc1.16.5.jar                    |Macaw's Windows               |mcwwindows                    |2.0.0               |DONE      |Manifest: NOSIGNATURE
\t\twoodenhopper-1.16.5-1.2.0.0.jar                   |Wooden Hopper                 |woodenhopper                  |1.16.5-1.2.0.0      |DONE      |Manifest: NOSIGNATURE
\t\tmodnametooltip_1.16.2-1.15.0.jar                  |Mod Name Tooltip              |modnametooltip                |1.15.0              |DONE      |Manifest: NOSIGNATURE
\t\tChickenDropFeathers-1.0-forge-1.16.5-36.0.0.jar   |ChickenDropFeathers           |chickendropfeathersmod        |1.0                 |DONE      |Manifest: NOSIGNATURE
\t\trsgauges-1.16.4-1.2.11.jar                        |Gauges and Switches           |rsgauges                      |1.2.11              |DONE      |Manifest: bf:30:76:97:e4:58:41:61:2a:f4:30:d3:8f:4c:e3:71:1d:14:c4:a1:4e:85:36:e3:1d:aa:2f:cb:22:b0:04:9b
\t\tchiseled0.4.3.jar                                 |Chiseled                      |chiseled                      |0.2.2               |DONE      |Manifest: NOSIGNATURE
\t\tIronJetpacks-1.16.5-4.2.1.jar                     |Iron Jetpacks                 |ironjetpacks                  |4.2.1               |DONE      |Manifest: NOSIGNATURE
\t\tglassential-forge-1.16.5-1.1.7.jar                |Glassential                   |glassential                   |1.1.7               |DONE      |Manifest: NOSIGNATURE
\t\tCTM-MC1.16.1-1.1.2.6.jar                          |ConnectedTexturesMod          |ctm                           |MC1.16.1-1.1.2.6    |DONE      |Manifest: NOSIGNATURE
\t\tCookingForBlockheads_1.16.5-9.3.4.jar             |Cooking for Blockheads        |cookingforblockheads          |9.3.4               |DONE      |Manifest: NOSIGNATURE
\t\tControlling-7.0.0.24.jar                          |Controlling                   |controlling                   |7.0.0.24            |DONE      |Manifest: NOSIGNATURE
\t\tPlacebo-1.16.5-4.6.0.jar                          |Placebo                       |placebo                       |4.6.0               |DONE      |Manifest: NOSIGNATURE
\t\tculinaryconstruct-forge-1.16.5-4.0.0.6.jar        |Culinary Construct            |culinaryconstruct             |1.16.5-4.0.0.6      |DONE      |Manifest: NOSIGNATURE
\t\tShrink-1.16.5-1.1.5.jar                           |Shrink                        |shrink                        |1.1.5               |DONE      |Manifest: NOSIGNATURE
\t\tBookshelf-Forge-1.16.5-10.2.27.jar                |Bookshelf                     |bookshelf                     |10.2.27             |DONE      |Manifest: eb:c4:b1:67:8b:f9:0c:db:dc:4f:01:b1:8e:61:64:39:4c:10:85:0b:a6:c4:c7:48:f0:fa:95:f2:cb:08:3a:e5
\t\tsophisticatedbackpacks-1.16.5-3.2.12.337.jar      |Sophisticated Backpacks       |sophisticatedbackpacks        |1.16.5-3.2.12.337   |DONE      |Manifest: NOSIGNATURE
\t\tExCompressum_1.16.5-4.0.4.jar                     |Ex Compressum                 |excompressum                  |4.0.4               |DONE      |Manifest: NOSIGNATURE
\t\tbuildinggadgets-1.16.5-3.8.0.jar                  |Building Gadgets              |buildinggadgets               |3.8.0               |DONE      |Manifest: NOSIGNATURE
\t\tsimpleplanes-1.16.5-4.6.0.jar                     |Simple Planes                 |simpleplanes                  |1.16.5-4.6.0        |DONE      |Manifest: NOSIGNATURE
\t\tmcw-doors-1.0.3-mc1.16.5.jar                      |Macaw's Doors                 |mcwdoors                      |1.0.3               |DONE      |Manifest: NOSIGNATURE
\t\tMorpheus-1.16.5-4.2.70.jar                        |Morpheus                      |morpheus                      |4.2.70              |DONE      |Manifest: NOSIGNATURE
\t\tTwerkItMeal-1.3.9.jar                             |TwerkItMeal                   |twerkitmeal                   |1.3.9               |DONE      |Manifest: NOSIGNATURE
\t\tMekanismGenerators-1.16.5-10.0.21.448.jar         |Mekanism: Generators          |mekanismgenerators            |10.0.21             |DONE      |Manifest: NOSIGNATURE
\t\tWaterStrainer-1.16.3-10.0.0.jar                   |Water Strainer                |waterstrainer                 |1.16.3-10.0.0       |DONE      |Manifest: NOSIGNATURE
\t\tJustEnoughResources-1.16.5-0.12.1.128.jar         |Just Enough Resources         |jeresources                   |0.12.1.128          |DONE      |Manifest: NOSIGNATURE
\t\tXNetGases-1.16.5-2.3.7.jar                        |XNet Gases                    |xnetgases                     |2.3.7               |DONE      |Manifest: NOSIGNATURE
\t\ttwilightforest-1.16.5-4.0.490-universal.jar       |The Twilight Forest           |twilightforest                |NONE                |DONE      |Manifest: NOSIGNATURE
\t\tmob_grinding_utils-1.16.5-0.4.28.jar              |Mob Grinding Utils            |mob_grinding_utils            |1.16.5-0.4.28       |DONE      |Manifest: NOSIGNATURE
\t\tcobblegenrandomizer-1.16-5.1.2.jar                |CobbleGenRandomizer           |cobblegenrandomizer           |1.16-5.1.2          |DONE      |Manifest: NOSIGNATURE
\t\trefinedstorage-1.9.15.jar                         |Refined Storage               |refinedstorage                |1.9.15              |DONE      |Manifest: NOSIGNATURE
\t\tkonkrete_1.3.0_MC_1.16.2-1.16.5.jar               |Konkrete                      |konkrete                      |1.3.0               |DONE      |Manifest: NOSIGNATURE
\t\tRSInfinityBooster-1.16.5-1.0+6.jar                |RSInfinityBooster             |rsinfinitybooster             |1.16.5-1.0+6        |DONE      |Manifest: NOSIGNATURE
\t\tstructure_gel-1.16.5-1.7.7.jar                    |Structure Gel API             |structure_gel                 |1.7.7               |DONE      |Manifest: NOSIGNATURE
\t\tmcw-bridges-1.0.6-mc1.16.5.jar                    |Macaw's Bridges               |mcwbridges                    |1.0.6               |DONE      |Manifest: NOSIGNATURE
\t\tindustrial-foregoing-1.16.5-3.2.14.6-14.jar       |Industrial Foregoing          |industrialforegoing           |3.2.14.6            |DONE      |Manifest: NOSIGNATURE
\t\tFarmersDelight-1.16.3-0.4.1.jar                   |Farmer's Delight              |farmersdelight                |1.16.3-0.4.1        |DONE      |Manifest: NOSIGNATURE
\t\ttorchmaster-2.3.8.jar                             |Torchmaster                   |torchmaster                   |2.3.8               |DONE      |Manifest: NOSIGNATURE
\t\tTipTheScales-1.16.5-3.0.0.15.jar                  |TipTheScales                  |tipthescales                  |3.0.0.15            |DONE      |Manifest: NOSIGNATURE
\t\tDustrialDecor-1.2.9.jar                           |'Dustrial Decor               |dustrial_decor                |1.2.8               |DONE      |Manifest: NOSIGNATURE
\t\tcrashutilities-3.12.jar                           |Crash Utilities               |crashutilities                |3.12                |DONE      |Manifest: NOSIGNATURE
\t\tMekanismAdditions-1.16.5-10.0.21.448.jar          |Mekanism: Additions           |mekanismadditions             |10.0.21             |DONE      |Manifest: NOSIGNATURE
\t\tvalkyrielib-1.16.5-3.0.8.0.jar                    |ValkyrieLib                   |valkyrielib                   |1.16.5-3.0.8.0      |DONE      |Manifest: NOSIGNATURE
\t\tdungeons_plus-1.16.5-1.1.5.jar                    |Dungeons Plus                 |dungeons_plus                 |1.1.5               |DONE      |Manifest: NOSIGNATURE
\t\tmcw-trapdoors-1.0.2-mc1.16.5.jar                  |Macaw's Trapdoors             |mcwtrpdoors                   |1.0.2               |DONE      |Manifest: NOSIGNATURE
\t\tmcw-fences-1.0.1-mc1.16.5.jar                     |Macaw's Fences and Walls      |mcwfences                     |1.0.1               |DONE      |Manifest: NOSIGNATURE
\t\tAdvancedRocketry-1.16.5-2.0.0-12-universal.jar    |Advanced Rocketry             |advancedrocketry              |1.16.5-2.0.0-12     |DONE      |Manifest: NOSIGNATURE
\t\tsupermartijn642corelib-1.0.12-mc1.16.5.jar        |SuperMartijn642's Core Lib    |supermartijn642corelib        |1.0.12              |DONE      |Manifest: NOSIGNATURE
\t\tsimplylight-1.16.4-1.2.0-build.11.jar             |Simply Light                  |simplylight                   |1.16.4-1.2.0-build.1|DONE      |Manifest: NOSIGNATURE
\t\tfairylights-4.0.5-1.16.5.jar                      |Fairy Lights                  |fairylights                   |4.0.5               |DONE      |Manifest: NOSIGNATURE
\t\tcurios-forge-1.16.5-4.0.5.3.jar                   |Curios API                    |curios                        |1.16.5-4.0.5.3      |DONE      |Manifest: NOSIGNATURE
\t\tPatchouli-1.16.4-53.2.jar                         |Patchouli                     |patchouli                     |1.16.4-53.2         |DONE      |Manifest: NOSIGNATURE
\t\tOreExcavation-1.8.157.jar                         |Ore Excavation                |oreexcavation                 |1.8.157             |DONE      |Manifest: e7:68:1c:0d:b9:7e:cf:f8:f3:40:9c:84:c5:39:d7:a4:59:78:b0:6b:c3:fd:b7:4f:69:18:a3:88:e3:76:8c:3f
\t\tblockcarpentry-1.16-0.4.0.jar                     |BlockCarpentry                |blockcarpentry                |1.16-0.4.0          |DONE      |Manifest: NOSIGNATURE
\t\tBetterDiving-1.16.5-1.3.2.jar                     |Better Diving                 |better_diving                 |1.3.2               |DONE      |Manifest: NOSIGNATURE
\t\tMysticalCustomization-1.16.4-2.1.5.jar            |Mystical Customization        |mysticalcustomization         |2.1.5               |DONE      |Manifest: NOSIGNATURE
\t\televatorid-1.16.5-1.7.13.jar                      |Elevator Mod                  |elevatorid                    |1.16.5-1.7.13       |DONE      |Manifest: NOSIGNATURE
\t\tGunpowderLib-1.16.5-1.2.2.jar                     |GunpowderLib                  |gunpowderlib                  |1.16.5-1.2.2        |DONE      |Manifest: 2e:cb:db:61:22:2a:6d:79:f4:22:31:8c:34:9b:cf:9f:91:ea:95:c4:bf:bb:8a:de:6e:10:c3:f0:b1:c6:ae:20
\t\tSimpleSponge-1.16.5-5.0.1.jar                     |Simple Sponge                 |simplesponge                  |5.0.1               |DONE      |Manifest: 2e:cb:db:61:22:2a:6d:79:f4:22:31:8c:34:9b:cf:9f:91:ea:95:c4:bf:bb:8a:de:6e:10:c3:f0:b1:c6:ae:20
\t\tftb-ultimine-forge-1605.3.0-build.25.jar          |FTB Ultimine                  |ftbultimine                   |1605.3.0-build.25   |DONE      |Manifest: NOSIGNATURE
\t\ttombstone-1.16.5-6.5.3.jar                        |Corail Tombstone              |tombstone                     |6.5.3               |DONE      |Manifest: NOSIGNATURE
\t\tobfuscate-0.6.2-1.16.3.jar                        |Obfuscate                     |obfuscate                     |0.6.2               |DONE      |Manifest: e1:59:1a:56:ec:97:b3:d0:b3:4b:25:06:1f:83:b0:f4:fd:0c:24:e3:6d:ea:94:b1:9f:22:b0:38:13:60:88:ea
\t\tExtraStorage-1.16.5-1.5.0.jar                     |Extra Storage                 |extrastorage                  |1.5.0               |DONE      |Manifest: NOSIGNATURE
\t\tconstructionwand-1.16.5-2.2.jar                   |Construction Wand             |constructionwand              |1.16.5-2.2          |DONE      |Manifest: NOSIGNATURE
\t\tmcw-roofs-2.0.1-mc1.16.5-4.jar                    |Macaw's Roofs                 |mcwroofs                      |2.0.1               |DONE      |Manifest: NOSIGNATURE
\t\tLibVulpes-1.16.5-1.0.2-25-universal.jar           |Lib Vulpes                    |libvulpes                     |1.16.5-1.0.2-25     |DONE      |Manifest: NOSIGNATURE
\t\tarchitectury-1.23.33-forge.jar                    |Architectury                  |architectury                  |1.23.33             |DONE      |Manifest: NOSIGNATURE
\t\tmoreoverlays-1.18.15-mc1.16.5.jar                 |More Overlays Updated         |moreoverlays                  |1.18.15-mc1.16.5    |DONE      |Manifest: NOSIGNATURE
\t\tmcw-furniture-2.0.1-mc1.16.5.jar                  |Macaw's Furniture             |mcwfurnitures                 |2.0.1               |DONE      |Manifest: NOSIGNATURE
\t\tcompactcrafting-1.0.0-beta.3.jar                  |Compact Crafting              |compactcrafting               |1.0.0-beta.3        |DONE      |Manifest: NOSIGNATURE
\t\tcloth-config-4.11.26-forge.jar                    |Cloth Config v4 API           |cloth-config                  |4.11.26             |DONE      |Manifest: NOSIGNATURE
\t\ttrashcans-1.0.10-mc1.16.5.jar                     |Trash Cans                    |trashcans                     |1.0.10              |DONE      |Manifest: NOSIGNATURE
\t\twoodenshears-1.16.5-1.1.0.0.jar                   |Wooden Shears                 |woodenshears                  |1.16.5-1.1.0.0      |DONE      |Manifest: NOSIGNATURE
\t\tbwncr-1.16.5-3.10.16.jar                          |Bad Wither No Cookie Reloaded |bwncr                         |1.16.5-3.10.16      |DONE      |Manifest: NOSIGNATURE
\t\tFastLeafDecay-v25.jar                             |FastLeafDecay                 |fastleafdecay                 |v25                 |DONE      |Manifest: NOSIGNATURE
\t\tCodeChickenLib-1.16.5-4.0.3.434-universal.jar     |CodeChicken Lib               |codechickenlib                |4.0.3.434           |DONE      |Manifest: 31:e6:db:63:47:4a:6e:e0:0a:2c:11:d1:76:db:4e:82:ff:56:2d:29:93:d2:e5:02:bd:d3:bd:9d:27:47:a5:71
\t\tsolarcooker-1.16.5-1.0.0.2.jar                    |Solar Cooker                  |solarcooker                   |1.16.5-1.0.0.2      |DONE      |Manifest: NOSIGNATURE
\t\tBetterAdvancements-1.16.5-0.1.0.108.jar           |Better Advancements           |betteradvancements            |0.1.0.108           |DONE      |Manifest: NOSIGNATURE
\t\trhino-forge-1605.1.4-build.59.jar                 |Rhino                         |rhino                         |1605.1.4-build.59   |DONE      |Manifest: NOSIGNATURE
\t\tCucumber-1.16.4-4.1.10.jar                        |Cucumber Library              |cucumber                      |4.1.10              |DONE      |Manifest: NOSIGNATURE
\t\tjmi-1.16.5-0.2-18.jar                             |JourneyMap Integration        |jmi                           |1.16.5-0.2-18       |DONE      |Manifest: NOSIGNATURE
\t\tInventorySpam-1.16.5-1.3.2.jar                    |Inventory Spam                |inventoryspam                 |1.3.2               |DONE      |Manifest: NOSIGNATURE
\t\tftb-library-forge-1605.3.3-build.74.jar           |FTB Library                   |ftblibrary                    |1605.3.3-build.74   |DONE      |Manifest: NOSIGNATURE
\t\tftb-teams-forge-1605.2.2-build.32.jar             |FTB Teams                     |ftbteams                      |1605.2.2-build.32   |DONE      |Manifest: NOSIGNATURE
\t\tftb-ranks-1605.1.4-build.12-forge.jar             |FTB Ranks                     |ftbranks                      |1605.1.4-build.12   |DONE      |Manifest: NOSIGNATURE
\t\tsnad-1.0.9-forge.jar                              |Snad                          |snad                          |1.0.9               |DONE      |Manifest: NOSIGNATURE
\t\tBountiful Baubles FORGE-1.16.3-0.0.2.jar          |Bountiful Baubles             |bountifulbaubles              |NONE                |DONE      |Manifest: NOSIGNATURE
\t\tOldJavaWarning-1.16.5-7.0.1.jar                   |OldJavaWarning                |oldjavawarning                |7.0.1               |DONE      |Manifest: NOSIGNATURE
\t\txlpackets-1.1.jar                                 |XL Packets                    |xlpackets                     |1.1                 |DONE      |Manifest: NOSIGNATURE
\t\tjei-1.16.5-7.7.1.116.jar                          |Just Enough Items             |jei                           |7.7.1.116           |DONE      |Manifest: NOSIGNATURE
\t\tJustEnoughCalculation-1.16.5-3.8.5.jar            |Just Enough Calculation       |jecalculation                 |3.8.5               |DONE      |Manifest: NOSIGNATURE
\t\titem-filters-forge-1605.2.5-build.9.jar           |Item Filters                  |itemfilters                   |1605.2.5-build.9    |DONE      |Manifest: NOSIGNATURE
\t\tAttributeFix-1.16.5-10.1.2.jar                    |AttributeFix                  |attributefix                  |10.1.2              |DONE      |Manifest: eb:c4:b1:67:8b:f9:0c:db:dc:4f:01:b1:8e:61:64:39:4c:10:85:0b:a6:c4:c7:48:f0:fa:95:f2:cb:08:3a:e5
\t\tabnormals_core-1.16.5-3.3.0.jar                   |Abnormals Core                |abnormals_core                |3.3.0               |DONE      |Manifest: NOSIGNATURE
\t\tTiny-Coal-1.16.4-1.0.0.jar                        |Tiny Coal                     |tinycoal                      |1.0.0               |DONE      |Manifest: NOSIGNATURE
\t\tMekanism-1.16.5-10.0.21.448.jar                   |Mekanism                      |mekanism                      |10.0.21             |DONE      |Manifest: NOSIGNATURE
\t\treap-1.16.5-1.0.1.jar                             |Reap Mod                      |reap                          |1.16.5-1.0.1        |DONE      |Manifest: NOSIGNATURE
\t\tinvtweaks-1.16.4-1.0.1.jar                        |Inventory Tweaks Renewed      |invtweaks                     |1.16.4-1.0.1        |DONE      |Manifest: NOSIGNATURE
\t\tSpace-Bosstools-1.16.5-5.4.jar                    |Space-BossTools               |boss_tools                    |5.4                 |DONE      |Manifest: NOSIGNATURE
\t\tmcw-paintings-1.0.2-mc1.16.5.jar                  |Macaw's Paintings             |mcwpaintings                  |1.0.2               |DONE      |Manifest: NOSIGNATURE
\t\tClumps-6.0.0.25.jar                               |Clumps                        |clumps                        |6.0.0.25            |DONE      |Manifest: NOSIGNATURE
\t\tshutupexperimentalsettings-1.0.3.jar              |Shutup Experimental Settings! |shutupexperimentalsettings    |1.0.3               |DONE      |Manifest: NOSIGNATURE
\t\tjourneymap-1.16.5-5.7.3.jar                       |Journeymap                    |journeymap                    |5.7.3               |DONE      |Manifest: NOSIGNATURE
\t\tframedcompactdrawers-1.16-2.2.0.jar               |Framed Compacting Drawers     |framedcompactdrawers          |1.16-2.2.0          |DONE      |Manifest: NOSIGNATURE
\t\tLibX-1.16.3-1.0.76.jar                            |LibX                          |libx                          |1.16.3-1.0.76       |DONE      |Manifest: NOSIGNATURE
\t\tcompactmachines-4.0.0-beta.2.jar                  |Compact Machines 4            |compactmachines               |4.0.0-beta.2        |DONE      |Manifest: NOSIGNATURE
\t\tangelblock-3.0.jar                                |Angel Block                   |angelblock                    |3.0                 |DONE      |Manifest: NOSIGNATURE
\t\tBotanyPots-1.16.5-7.0.17.jar                      |BotanyPots                    |botanypots                    |7.0.17              |DONE      |Manifest: eb:c4:b1:67:8b:f9:0c:db:dc:4f:01:b1:8e:61:64:39:4c:10:85:0b:a6:c4:c7:48:f0:fa:95:f2:cb:08:3a:e5
\t\tcharginggadgets-1.3.0.jar                         |Charging Gadgets              |charginggadgets               |1.3.0               |DONE      |Manifest: NOSIGNATURE
\t\tmcjtylib-1.16-5.0.22.jar                          |McJtyLib                      |mcjtylib                      |1.16-5.0.22         |DONE      |Manifest: NOSIGNATURE
\t\trftoolsbase-1.16-2.0.11.jar                       |RFToolsBase                   |rftoolsbase                   |1.16-2.0.11         |DONE      |Manifest: NOSIGNATURE
\t\txnet-1.16-3.0.13.jar                              |XNet                          |xnet                          |1.16-3.0.13         |DONE      |Manifest: NOSIGNATURE
\t\tpedestals-0.8s_hotfix_5.jar                       |Pedestals                     |pedestals                     |0.8s_hotfix_5       |DONE      |Manifest: NOSIGNATURE
\t\tInteractio-1.16.4-3.1.1.jar                       |Interactio                    |interactio                    |1.16.4-3.1.1        |DONE      |Manifest: NOSIGNATURE
\t\tToast-Control-1.16.4-4.3.1.jar                    |Toast Control                 |toastcontrol                  |4.3.1               |DONE      |Manifest: NOSIGNATURE
\t\tiChunUtil-1.16.5-10.4.1.jar                       |iChunUtil                     |ichunutil                     |10.4.1              |DONE      |Manifest: NOSIGNATURE
\t\tEnderStorage-1.16.5-2.8.0.168-universal.jar       |EnderStorage                  |enderstorage                  |2.8.0.168           |DONE      |Manifest: 31:e6:db:63:47:4a:6e:e0:0a:2c:11:d1:76:db:4e:82:ff:56:2d:29:93:d2:e5:02:bd:d3:bd:9d:27:47:a5:71
\t\tftb-chunks-forge-1605.3.2-build.57.jar            |FTB Chunks                    |ftbchunks                     |1605.3.2-build.57   |DONE      |Manifest: NOSIGNATURE
\t\tkubejs-forge-1605.3.18-build.125.jar              |KubeJS                        |kubejs                        |1605.3.18-build.125 |DONE      |Manifest: NOSIGNATURE
\t\tkubejs-mekanism-1605.1.2-build.2.jar              |KubeJS Mekanism               |kubejs_mekanism               |1605.1.2-build.2    |DONE      |Manifest: NOSIGNATURE
\t\tforge-1.16.5-36.2.2-universal.jar                 |Forge                         |forge                         |36.2.2              |DONE      |Manifest: 22:af:21:d8:19:82:7f:93:94:fe:2b:ac:b7:e4:41:57:68:39:87:b1:a7:5c:c6:44:f9:25:74:21:14:f5:0d:90
\t\tMysticalAgriculture-1.16.5-4.2.3.jar              |Mystical Agriculture          |mysticalagriculture           |4.2.3               |DONE      |Manifest: NOSIGNATURE
\t\tMysticalAgradditions-1.16.5-4.2.1.jar             |Mystical Agradditions         |mysticalagradditions          |4.2.1               |DONE      |Manifest: NOSIGNATURE
\t\tmatc-1.1.2.jar                                    |Mystical Agriculture Tiered Cr|matc                          |1.1.2               |DONE      |Manifest: NOSIGNATURE
\t\tironchest-1.16.5-11.2.13.jar                      |Iron Chests                   |ironchest                     |1.16.5-11.2.13      |DONE      |Manifest: NOSIGNATURE
\t\tCraftingTweaks_1.16.5-12.2.1.jar                  |Crafting Tweaks               |craftingtweaks                |12.2.1              |DONE      |Manifest: NOSIGNATURE
\t\tZeroCore2-1.16.5-2.1.3.jar                        |Zero CORE 2                   |zerocore                      |1.16.5-2.1.3        |DONE      |Manifest: NOSIGNATURE
\t\tExtremeReactors2-1.16.5-2.0.27.jar                |Extreme Reactors              |bigreactors                   |1.16.5-2.0.27       |DONE      |Manifest: NOSIGNATURE
\t\tforge-1.16.5-36.2.2-client.jar                    |Minecraft                     |minecraft                     |1.16.5              |DONE      |Manifest: NOSIGNATURE
\t\tupgrade_aquatic-1.16.5-3.1.0.jar                  |Upgrade Aquatic               |upgrade_aquatic               |3.1.0               |DONE      |Manifest: NOSIGNATURE
\t\tcofh_core-1.16.4-1.2.0.jar                        |CoFH Core                     |cofh_core                     |1.2.0               |DONE      |Manifest: NOSIGNATURE
\t\tthermal_foundation-1.16.4-1.2.0.jar               |Thermal Series                |thermal                       |1.2.0               |DONE      |Manifest: NOSIGNATURE
\t\tthermal_expansion-1.16.4-1.2.0.jar                |Thermal Expansion             |thermal_expansion             |1.2.0               |DONE      |Manifest: NOSIGNATURE
\t\tkubejs-thermal-1605.1.1.6.jar                     |KubeJS Thermal                |kubejs_thermal                |1605.1.1.6          |DONE      |Manifest: NOSIGNATURE
\t\texnihilothermal-1.16-1.0.0.0.jar                  |Ex Nihilo: Sequentia - Thermal|exnihilothermal               |1.16-1.0.0.0        |DONE      |Manifest: NOSIGNATURE
\t\tTConstruct-1.16.5-3.1.1.252.jar                   |Tinkers' Construct            |tconstruct                    |3.1.1.252           |DONE      |Manifest: NOSIGNATURE
\t\trftoolsutility-1.16-3.1.2.jar                     |RFToolsUtility                |rftoolsutility                |1.16-3.1.2          |DONE      |Manifest: NOSIGNATURE
\t\tFlopper-1.16.5-1.1.0.jar                          |Flopper                       |flopper                       |1.1.0               |DONE      |Manifest: NOSIGNATURE
\t\ttheoneprobe-1.16-3.1.4.jar                        |The One Probe                 |theoneprobe                   |1.16-3.1.4          |DONE      |Manifest: NOSIGNATURE
\t\tMouseTweaks-2.14-mc1.16.2.jar                     |Mouse Tweaks                  |mousetweaks                   |2.14                |DONE      |Manifest: NOSIGNATURE
\t\ttitanium-1.16.5-3.2.8.4-10.jar                    |Titanium                      |titanium                      |3.2.8.4             |DONE      |Manifest: NOSIGNATURE
\t\tftb-quests-forge-1605.3.5-build.64.jar            |FTB Quests                    |ftbquests                     |1605.3.5-build.64   |DONE      |Manifest: NOSIGNATURE
\t\tceramicbucket-1.16.5-2.7.0.1.jar                  |Ceramic Bucket                |ceramicbucket                 |1.16.5-2.7.0.1      |DONE      |Manifest: NOSIGNATURE
\t\tskyblockbuilder-1.16.4-1.5.4.jar                  |Skyblock Builder              |skyblockbuilder               |1.5.4               |DONE      |Manifest: NOSIGNATURE
\t\tsimple-rpc-1.16.5-2.4.jar                         |Simple RPC                    |simple-rpc                    |1.16.5-version      |DONE      |Manifest: NOSIGNATURE
\t\texnihilomekanism-1.16-1.0.0.1.jar                 |Ex Nihilo: Sequentia - Mekanis|exnihilomekanism              |1.16-1.0.0.1        |DONE      |Manifest: NOSIGNATURE
\t\tceramicshears-1.16.5-1.5.0.0.jar                  |Ceramic Shears                |ceramicshears                 |1.16.5-1.5.0.0      |DONE      |Manifest: NOSIGNATURE
\t\tdefaultworldtype-1.16.3-2.0.3.jar                 |Default World Type            |defaultworldtype              |2.0.3               |DONE      |Manifest: NOSIGNATURE
\t\trftoolsbuilder-1.16-3.1.2.jar                     |RFToolsBuilder                |rftoolsbuilder                |1.16-3.1.2          |DONE      |Manifest: NOSIGNATURE
\t\tpipez-1.16.5-1.2.7.jar                            |Pipez                         |pipez                         |1.16.5-1.2.7        |DONE      |Manifest: NOSIGNATURE
\t\tMantle-1.16.5-1.6.115.jar                         |Mantle                        |mantle                        |1.6.115             |DONE      |Manifest: NOSIGNATURE
\t\tJAOPCA-1.16.5-3.4.0.8.jar                         |JAOPCA                        |jaopca                        |3.4.0.8             |DONE      |Manifest: NOSIGNATURE
\t\tftb-backups-2.1.1.6.jar                           |FTB Backups                   |ftbbackups                    |2.1.1.6             |DONE      |Manifest: NOSIGNATURE
\t\tbaubleyheartcanisters-1.16.5-1.1.11.jar           |Baubley Heart Canisters       |bhc                           |1.16.5-1.1.11       |DONE      |Manifest: NOSIGNATURE
\t\toauth-1.06.1-1.16.jar                             |OAuth                         |oauth                         |1.0                 |DONE      |Manifest: NOSIGNATURE
\t\tpolymorph-forge-1.16.5-0.25.jar                   |Polymorph                     |polymorph                     |1.16.5-0.25         |DONE      |Manifest: NOSIGNATURE
\t\tAutoRegLib-1.6-49.jar                             |AutoRegLib                    |autoreglib                    |1.6-49              |DONE      |Manifest: NOSIGNATURE
\t\tAkashicTome-1.4-16.jar                            |Akashic Tome                  |akashictome                   |1.4-16              |DONE      |Manifest: NOSIGNATURE
\t\tQuark-r2.4-316.jar                                |Quark                         |quark                         |r2.4-316            |DONE      |Manifest: NOSIGNATURE
\t\tStorageDrawers-1.16.3-8.3.0.jar                   |Storage Drawers               |storagedrawers                |8.3.0               |DONE      |Manifest: NOSIGNATURE
\t\tFluxNetworks-1.16.5-6.1.7.12.jar                  |Flux Networks                 |fluxnetworks                  |6.1.7.12            |DONE      |Manifest: NOSIGNATURE
\t\tfactory-forge-1.16.5-1.3.1.jar                    |Factory Mod                   |factory                       |1.16.5-1.3.1        |DONE      |Manifest: NOSIGNATURE
\t\tcagedmobs-1.16.5-1.3.5.jar                        |Caged Mobs                    |cagedmobs                     |1.16.5-1.3.5        |DONE      |Manifest: NOSIGNATURE
\t\tfancymenu_2.3.3_MC_1.16.2-1.16.5.jar              |FancyMenu                     |fancymenu                     |2.3.3               |DONE      |Manifest: NOSIGNATURE
\t\tRSLargePatterns-1.16.5-2.1.0.3.jar                |Refined Storage Large Patterns|rslargepatterns               |2.1.0.3             |DONE      |Manifest: NOSIGNATURE
\t\tappleskin-forge-mc1.16.x-2.1.0.jar                |AppleSkin                     |appleskin                     |mc1.16.4-2.1.0      |DONE      |Manifest: NOSIGNATURE
\t\tferritecore-2.0.7-forge.jar                       |Ferrite Core                  |ferritecore                   |2.0.7               |DONE      |Manifest: 41:ce:50:66:d1:a0:05:ce:a1:0e:02:85:9b:46:64:e0:bf:2e:cf:60:30:9a:fe:0c:27:e0:63:66:9a:84:ce:8a
\t\tChisel-MC1.16.5-2.0.1-alpha.4.jar                 |Chisel                        |chisel                        |MC1.16.5-2.0.1-alpha|DONE      |Manifest: NOSIGNATURE
\t\tmoredragoneggs-1.4.jar                            |More Dragon Eggs              |moredragoneggs                |1.4                 |DONE      |Manifest: NOSIGNATURE
\t\trefinedstorageaddons-0.7.3.jar                    |Refined Storage Addons        |refinedstorageaddons          |0.7.3               |DONE      |Manifest: NOSIGNATURE
\t\texnihilosequentia-1.16-20210628182320.jar         |Ex Nihilo: Sequentia          |exnihilosequentia             |1.16-20210628182320 |DONE      |Manifest: NOSIGNATURE
\t\textremeSoundMuffler-3.15_1.16.5.jar               |Extreme Sound Muffler         |extremesoundmuffler           |3.15_forge-1.16.5   |DONE      |Manifest: NOSIGNATURE
\t\tCosmeticArmorReworked-1.16.5-v4.jar               |CosmeticArmorReworked         |cosmeticarmorreworked         |1.16.5-v4           |DONE      |Manifest: 5e:ed:25:99:e4:44:14:c0:dd:89:c1:a9:4c:10:b5:0d:e4:b1:52:50:45:82:13:d8:d0:32:89:67:56:57:01:53
\t\toverloadedarmorbar-5.1.0.jar                      |Overloaded Armor Bar          |overloadedarmorbar            |5.1.0               |DONE      |Manifest: NOSIGNATURE
\t\tchiselsandbits-0.3.4-RELEASE.jar                  |Chisels & bits                |chiselsandbits                |NONE                |DONE      |Manifest: NOSIGNATURE
\t\tMorph-o-Tool-1.4-27.jar                           |Morph-o-Tool                  |morphtool                     |1.4-27              |DONE      |Manifest: NOSIGNATURE
\t\tmorered-1.16.5-2.1.1.0.jar                        |More Red                      |morered                       |2.1.1.0             |DONE      |Manifest: NOSIGNATURE
\tCrash Report UUID: facd586a-6d32-428a-b558-d89bf09af075
\tPatchouli open book context: n/a
\tSuspected Mods: Unknown
\tPlayer Count: 1 / 8; [ServerPlayerEntity['ZaNo_Moon'/574, l='ServerLevel[Yeet]', x=8.50, y=65.00, z=8.50]]
\tData Packs: vanilla, mod:rsrequestify (incompatible), mod:cyclopscore, mod:notenoughcrashes, mod:dungeonsmod (incompatible), mod:hats, mod:piratesandlootersreborn, mod:extendedcrafting, mod:incontrol (incompatible), mod:uppers (incompatible), mod:mcwwindows, mod:woodenhopper, mod:modnametooltip, mod:chickendropfeathersmod, mod:rsgauges, mod:chiseled, mod:ironjetpacks, mod:glassential (incompatible), mod:ctm (incompatible), mod:cookingforblockheads (incompatible), mod:controlling, mod:placebo (incompatible), mod:culinaryconstruct (incompatible), mod:shrink (incompatible), mod:bookshelf, mod:sophisticatedbackpacks, mod:excompressum (incompatible), mod:buildinggadgets, mod:simpleplanes, mod:mcwdoors, mod:morpheus (incompatible), mod:twerkitmeal, mod:mekanismgenerators, mod:waterstrainer, mod:jeresources, mod:xnetgases, mod:twilightforest, mod:mob_grinding_utils, mod:cobblegenrandomizer, mod:refinedstorage, mod:konkrete, mod:rsinfinitybooster, mod:structure_gel, mod:mcwbridges (incompatible), mod:industrialforegoing (incompatible), mod:farmersdelight, mod:torchmaster (incompatible), mod:tipthescales, mod:dustrial_decor (incompatible), mod:crashutilities (incompatible), mod:mekanismadditions, mod:valkyrielib, mod:dungeons_plus, mod:mcwtrpdoors (incompatible), mod:mcwfences, mod:advancedrocketry, mod:supermartijn642corelib, mod:simplylight, mod:fairylights, mod:curios, mod:patchouli (incompatible), mod:oreexcavation, mod:blockcarpentry (incompatible), mod:better_diving, mod:mysticalcustomization (incompatible), mod:elevatorid, mod:gunpowderlib, mod:simplesponge, mod:ftbultimine (incompatible), mod:tombstone, mod:obfuscate (incompatible), mod:extrastorage, mod:constructionwand (incompatible), mod:mcwroofs, mod:libvulpes, mod:architectury, mod:moreoverlays, mod:mcwfurnitures, mod:compactcrafting (incompatible), mod:cloth-config (incompatible), mod:trashcans, mod:woodenshears, mod:bwncr, mod:fastleafdecay (incompatible), mod:codechickenlib (incompatible), mod:solarcooker, mod:betteradvancements, mod:rhino, mod:cucumber, mod:jmi, mod:inventoryspam (incompatible), mod:ftblibrary, mod:ftbteams, mod:ftbranks, mod:snad, mod:bountifulbaubles (incompatible), mod:oldjavawarning, mod:xlpackets, mod:jei, mod:jecalculation (incompatible), mod:itemfilters, mod:attributefix, mod:abnormals_core, mod:tinycoal (incompatible), mod:mekanism, mod:reap, mod:invtweaks (incompatible), mod:boss_tools, mod:mcwpaintings (incompatible), mod:clumps, mod:shutupexperimentalsettings (incompatible), mod:journeymap (incompatible), mod:framedcompactdrawers (incompatible), mod:libx, mod:compactmachines, mod:angelblock (incompatible), mod:botanypots, mod:charginggadgets, mod:mcjtylib, mod:rftoolsbase, mod:xnet, mod:pedestals (incompatible), mod:interactio, mod:toastcontrol (incompatible), mod:ichunutil, mod:enderstorage (incompatible), mod:ftbchunks, mod:kubejs, mod:kubejs_mekanism, mod:forge, mod:mysticalagriculture, mod:mysticalagradditions, mod:matc, mod:ironchest, mod:craftingtweaks (incompatible), mod:zerocore, mod:bigreactors, mod:upgrade_aquatic, mod:cofh_core (incompatible), mod:thermal (incompatible), mod:thermal_expansion (incompatible), mod:kubejs_thermal, mod:exnihilothermal, mod:tconstruct, mod:rftoolsutility, mod:flopper, mod:theoneprobe, mod:mousetweaks, mod:titanium (incompatible), mod:ftbquests, mod:ceramicbucket, mod:skyblockbuilder, mod:simple-rpc, mod:exnihilomekanism, mod:ceramicshears, mod:defaultworldtype, mod:rftoolsbuilder, mod:pipez, mod:mantle (incompatible), mod:jaopca (incompatible), mod:ftbbackups (incompatible), mod:bhc (incompatible), mod:oauth, mod:polymorph, mod:autoreglib (incompatible), mod:akashictome, mod:quark (incompatible), mod:storagedrawers (incompatible), mod:fluxnetworks, mod:factory (incompatible), mod:cagedmobs, mod:fancymenu (incompatible), mod:rslargepatterns (incompatible), mod:appleskin, mod:ferritecore (incompatible), mod:chisel (incompatible), mod:moredragoneggs (incompatible), mod:refinedstorageaddons, mod:exnihilosequentia (incompatible), mod:extremesoundmuffler, mod:cosmeticarmorreworked (incompatible), mod:overloadedarmorbar (incompatible), mod:chiselsandbits (incompatible), mod:morphtool (incompatible), mod:morered, inmemory:jaopca (incompatible)
\tType: Integrated Server (map_client.txt)
\tIs Modded: Definitely; Client brand changed to 'forge'
\tClient Crashes Since Restart: 0
\tIntegrated Server Crashes Since Restart: 3`