export const BrokenSectionCrash = `---- Minecraft Crash Report ----
// Uh... Did I do that?

Time: 11/25/21 9:58 PM
Description: Manually triggered debug crash

java.lang.Throwable: null
\tat net.minecraft.client.KeyboardListener.func_204870_b(KeyboardListener.java:423) ~[?:?] {re:classloading,pl:runtimedistcleaner:A}
\tat net.minecraft.client.Minecraft.func_71407_l(Minecraft.java:1540) ~[?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.Minecraft.func_195542_b(Minecraft.java:954) ~[?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.Minecraft.func_99999_d(Minecraft.java:607) ~[?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.main.Main.main(Main.java:184) ~[minecraft-1.16.5-client.jar:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:APP:notenoughcrashes.forge.mixins.json:client.MixinMain,pl:mixin:A,pl:runtimedistcleaner:A}
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_292] {}
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_292] {}
\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_292] {}
\tat java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_292] {}
\tat net.minecraftforge.fml.loading.FMLClientLaunchProvider.lambda$launchService$0(FMLClientLaunchProvider.java:51) ~[forge-1.16.5-36.2.16-launcher.jar:36.2] {}
\tat cpw.mods.modlauncher.LaunchServiceHandlerDecorator.launch(LaunchServiceHandlerDecorator.java:37) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:54) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:72) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.Launcher.run(Launcher.java:82) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.Launcher.main(Launcher.java:66) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_292] {}
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_292] {}
\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_292] {}
\tat java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_292] {}
\tat io.github.zekerzhayard.forgewrapper.installer.Main.main(Main.java:57) [ForgeWrapper-1.5.3.jar:1.5.3] {re:classloading}
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_292] {}
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_292] {}
\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_292] {}
\tat java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_292] {}
\tat org.multimc.onesix.OneSixLauncher.launchWithMainClass(OneSixLauncher.java:210) [NewLaunch.jar:?] {re:classloading}
\tat org.multimc.onesix.OneSixLauncher.launch(OneSixLauncher.java:245) [NewLaunch.jar:?] {re:classloading}
\tat org.multimc.EntryPoint.listen(EntryPoint.java:143) [NewLaunch.jar:?] {re:classloading}
\tat org.multimc.EntryPoint.main(EntryPoint.java:34) [NewLaunch.jar:?] {re:classloading}


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Render thread
Stacktrace:
\tat net.minecraft.client.KeyboardListener.func_204870_b(KeyboardListener.java:423) ~[?:?] {re:classloading,pl:runtimedistcleaner:A}
-- Affected level --
Details:
\tAll players: 1 total; [ClientPlayerEntity['FudgeDestroyer'/252, l='ClientLevel', x=-200.50, y=70.00, z=211.50]]
\tChunk stats: Client Chunk Cache: 441, 289
\tLevel dimension: minecraft:overworld
\tLevel spawn location: World: (-192,71,209), Chunk: (at 0,4,1 in -12,13; contains blocks -192,0,208 to -177,255,223), Region: (-1,0; contains chunks -32,0 to -1,31, blocks -512,0,0 to -1,255,511)
\tLevel time: 260 game time, 260 day time
\tServer brand: forge
\tServer type: Integrated singleplayer server
Stacktrace:
\tat net.minecraft.client.world.ClientWorld.func_72914_a(ClientWorld.java:447) ~[?:?] {re:classloading,pl:runtimedistcleaner:A}
\tat net.minecraft.client.Minecraft.func_71396_d(Minecraft.java:2030) ~[?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.Minecraft.func_99999_d(Minecraft.java:623) ~[?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.main.Main.main(Main.java:184) ~[minecraft-1.16.5-client.jar:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:APP:notenoughcrashes.forge.mixins.json:client.MixinMain,pl:mixin:A,pl:runtimedistcleaner:A}
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_292] {}
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_292] {}
\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_292] {}
\tat java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_292] {}
\tat net.minecraftforge.fml.loading.FMLClientLaunchProvider.lambda$launchService$0(FMLClientLaunchProvider.java:51) ~[forge-1.16.5-36.2.16-launcher.jar:36.2] {}
\tat cpw.mods.modlauncher.LaunchServiceHandlerDecorator.launch(LaunchServiceHandlerDecorator.java:37) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:54) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:72) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.Launcher.run(Launcher.java:82) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.Launcher.main(Launcher.java:66) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_292] {}
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_292] {}
\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_292] {}
\tat java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_292] {}
\tat io.github.zekerzhayard.forgewrapper.installer.Main.main(Main.java:57) [ForgeWrapper-1.5.3.jar:1.5.3] {re:classloading}
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_292] {}
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_292] {}
\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_292] {}
\tat java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_292] {}
\tat org.multimc.onesix.OneSixLauncher.launchWithMainClass(OneSixLauncher.java:210) [NewLaunch.jar:?] {re:classloading}
\tat org.multimc.onesix.OneSixLauncher.launch(OneSixLauncher.java:245) [NewLaunch.jar:?] {re:classloading}
\tat org.multimc.EntryPoint.listen(EntryPoint.java:143) [NewLaunch.jar:?] {re:classloading}
\tat org.multimc.EntryPoint.main(EntryPoint.java:34) [NewLaunch.jar:?] {re:classloading}


-- System Details --
Details:
\tMinecraft Version: 1.16.5
\tMinecraft Version ID: 1.16.5
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 1.8.0_292, AdoptOpenJDK
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode), AdoptOpenJDK
\tMemory: 1613602464 bytes (1538 MB) / 3927965696 bytes (3746 MB) up to 8388608000 bytes (8000 MB)
\tCPUs: 16
\tJVM Flags: 3 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xms512m -Xmx9000m
\tModLauncher: 8.0.9+86+master.3cf110c
\tModLauncher launch target: fmlclient
\tModLauncher naming: srg
\tModLauncher services: 
\t\t/mixin-0.8.4.jar mixin PLUGINSERVICE 
\t\t/eventbus-4.0.0.jar eventbus PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.16-launcher.jar object_holder_definalize PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.16-launcher.jar runtime_enum_extender PLUGINSERVICE 
\t\t/accesstransformers-3.0.1.jar accesstransformer PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.16-launcher.jar capability_inject_definalize PLUGINSERVICE 
\t\t/forge-1.16.5-36.2.16-launcher.jar runtimedistcleaner PLUGINSERVICE 
\t\t/mixin-0.8.4.jar mixin TRANSFORMATIONSERVICE 
\t\t/forge-1.16.5-36.2.16-launcher.jar fml TRANSFORMATIONSERVICE 
\tFML: 36.2
\tForge: net.minecraftforge:36.2.16
\tFML Language Providers: 
\t\tjavafml@36.2
\t\tminecraft@1
\tMod List: 
\t\tforge-1.16.5-36.2.16-client.jar                   |Minecraft                     |minecraft                     |1.16.5              |DONE      |Manifest: NOSIGNATURE
\t\tnotenoughcrashes-4.1.1+1.16.5-forge.jar           |Not Enough Crashes            |notenoughcrashes              |4.1.1+1.16.5        |DONE      |Manifest: NOSIGNATURE
\t\tforge-1.16.5-36.2.16-universal.jar                |Forge                         |forge                         |36.2.16             |DONE      |Manifest: 22:af:21:d8:19:82:7f:93:94:fe:2b:ac:b7:e4:41:57:68:39:87:b1:a7:5c:c6:44:f9:25:74:21:14:f5:0d:90
\tCrash Report UUID: b55f23ee-47e3-4641-ac48-e11eb4678ba6
\tSuspected Mods: None
\tLaunched Version: MultiMC5
\tBackend library: LWJGL version 3.2.2 build 10
\tBackend API: Radeon RX 580 Series GL version 4.6.14761 Compatibility Profile Context 21.30.23.01 30.0.13023.1012, ATI Technologies Inc.
\tGL Caps: Using framebuffer using OpenGL 3.0
\tUsing VBOs: Yes
\tIs Modded: Definitely; Client brand changed to 'forge'
\tType: Client (map_client.txt)
\tGraphics mode: fancy
\tResource Packs: 
\tCurrent Language: English (US)
\tCPU: 16x AMD Ryzen 7 3700X 8-Core Processor 
\tClient Crashes Since Restart: 1
\tIntegrated Server Crashes Since Restart: 0
[21:58:33] [Render thread/ERROR] [Not Enough Crashes In Game Crashes/]: An uncaught exception occured while displaying the crash screen, making normal report instead
java.lang.ExceptionInInitializerError: null
\tat fudge.notenoughcrashes.mixinhandlers.InGameCatcher.displayCrashScreen(InGameCatcher.java:102) ~[notenoughcrashes:?] {re:mixin,re:classloading}
\tat fudge.notenoughcrashes.mixinhandlers.InGameCatcher.handleClientCrash(InGameCatcher.java:33) ~[notenoughcrashes:?] {re:mixin,re:classloading}
\tat net.minecraft.client.Minecraft.modify$zze000$atTheEndOfFirstCatchBeforePrintingCrashReport(Minecraft.java:2543) ~[?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.Minecraft.func_99999_d(Minecraft.java:626) ~[?:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:A,pl:runtimedistcleaner:A}
\tat net.minecraft.client.main.Main.main(Main.java:184) ~[minecraft-1.16.5-client.jar:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:APP:notenoughcrashes.forge.mixins.json:client.MixinMain,pl:mixin:A,pl:runtimedistcleaner:A}
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_292] {}
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_292] {}
\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_292] {}
\tat java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_292] {}
\tat net.minecraftforge.fml.loading.FMLClientLaunchProvider.lambda$launchService$0(FMLClientLaunchProvider.java:51) ~[forge-1.16.5-36.2.16-launcher.jar:36.2] {}
\tat cpw.mods.modlauncher.LaunchServiceHandlerDecorator.launch(LaunchServiceHandlerDecorator.java:37) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:54) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:72) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.Launcher.run(Launcher.java:82) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat cpw.mods.modlauncher.Launcher.main(Launcher.java:66) [modlauncher-8.0.9.jar:?] {re:classloading}
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_292] {}
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_292] {}
\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_292] {}
\tat java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_292] {}
\tat io.github.zekerzhayard.forgewrapper.installer.Main.main(Main.java:57) [ForgeWrapper-1.5.3.jar:1.5.3] {re:classloading}
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_292] {}
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_292] {}
\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_292] {}
\tat java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_292] {}
\tat org.multimc.onesix.OneSixLauncher.launchWithMainClass(OneSixLauncher.java:210) [NewLaunch.jar:?] {re:classloading}
\tat org.multimc.onesix.OneSixLauncher.launch(OneSixLauncher.java:245) [NewLaunch.jar:?] {re:classloading}
\tat org.multimc.EntryPoint.listen(EntryPoint.java:143) [NewLaunch.jar:?] {re:classloading}
\tat org.multimc.EntryPoint.main(EntryPoint.java:34) [NewLaunch.jar:?] {re:classloading}
Caused by: java.lang.RuntimeException: Can't parse resource URI
\tat fudge.notenoughcrashes.forge.platform.ForgePlatform.getResource(ForgePlatform.java:62) ~[notenoughcrashes:?] {re:mixin,re:classloading}
\tat fudge.notenoughcrashes.utils.NecLocalization.getLocalizationPath(NecLocalization.java:92) ~[notenoughcrashes:?] {re:classloading}
\tat fudge.notenoughcrashes.utils.NecLocalization.loadLanguage(NecLocalization.java:74) ~[notenoughcrashes:?] {re:classloading}
\tat fudge.notenoughcrashes.utils.NecLocalization.lambda$localize$0(NecLocalization.java:43) ~[notenoughcrashes:?] {re:classloading}
\tat java.util.HashMap.computeIfAbsent(HashMap.java:1127) ~[?:1.8.0_292] {}
\tat fudge.notenoughcrashes.utils.NecLocalization.localize(NecLocalization.java:42) ~[notenoughcrashes:?] {re:classloading}
\tat fudge.notenoughcrashes.utils.NecLocalization.localize(NecLocalization.java:32) ~[notenoughcrashes:?] {re:classloading}
\tat fudge.notenoughcrashes.utils.NecLocalization.translatedText(NecLocalization.java:49) ~[notenoughcrashes:?] {re:classloading}
\tat fudge.notenoughcrashes.gui.ProblemScreen.<clinit>(ProblemScreen.java:32) ~[notenoughcrashes:?] {re:classloading,pl:runtimedistcleaner:A}
\t... 28 more
Caused by: java.net.URISyntaxException: Illegal character in path at index 32: modjar://notenoughcrashes/assets\\notenoughcrashes\\lang\\en_us.json
\tat java.net.URI$Parser.fail(URI.java:2847) ~[?:1.8.0_292] {}
\tat java.net.URI$Parser.checkChars(URI.java:3020) ~[?:1.8.0_292] {}
\tat java.net.URI$Parser.parseHierarchical(URI.java:3104) ~[?:1.8.0_292] {}
\tat java.net.URI$Parser.parse(URI.java:3052) ~[?:1.8.0_292] {}
\tat java.net.URI.<init>(URI.java:588) ~[?:1.8.0_292] {}
\tat java.net.URL.toURI(URL.java:964) ~[?:1.8.0_292] {}
\tat fudge.notenoughcrashes.forge.platform.ForgePlatform.getResource(ForgePlatform.java:60) ~[notenoughcrashes:?] {re:mixin,re:classloading}
\tat fudge.notenoughcrashes.utils.NecLocalization.getLocalizationPath(NecLocalization.java:92) ~[notenoughcrashes:?] {re:classloading}
\tat fudge.notenoughcrashes.utils.NecLocalization.loadLanguage(NecLocalization.java:74) ~[notenoughcrashes:?] {re:classloading}
\tat fudge.notenoughcrashes.utils.NecLocalization.lambda$localize$0(NecLocalization.java:43) ~[notenoughcrashes:?] {re:classloading}
\tat java.util.HashMap.computeIfAbsent(HashMap.java:1127) ~[?:1.8.0_292] {}
\tat fudge.notenoughcrashes.utils.NecLocalization.localize(NecLocalization.java:42) ~[notenoughcrashes:?] {re:classloading}
\tat fudge.notenoughcrashes.utils.NecLocalization.localize(NecLocalization.java:32) ~[notenoughcrashes:?] {re:classloading}
\tat fudge.notenoughcrashes.utils.NecLocalization.translatedText(NecLocalization.java:49) ~[notenoughcrashes:?] {re:classloading}
\tat fudge.notenoughcrashes.gui.ProblemScreen.<clinit>(ProblemScreen.java:32) ~[notenoughcrashes:?] {re:classloading,pl:runtimedistcleaner:A}
\t... 28 more`