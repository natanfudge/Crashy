export const SeeminglyInnocentCrashTest = `---- Minecraft Crash Report ----
// I let you down. Sorry :(
 
Time: 3/13/22, 8:21 PM
Description: Rendering overlay
 
java.lang.IllegalAccessError: failed to access class net.minecraft.tags.StaticTagHelper$Wrapper from class net.minecraft.world.level.block.state.BlockBehaviour$BlockStateBase (net.minecraft.tags.StaticTagHelper$Wrapper and net.minecraft.world.level.block.state.BlockBehaviour$BlockStateBase are in module minecraft@1.18.1 of loader 'TRANSFORMER' @118ffcfd)
    at net.minecraft.world.level.block.state.BlockBehaviour$BlockStateBase.handler$zgh000$isBookshelf(BlockBehaviour.java:880) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,re:computing_frames,re:classloading,pl:mixin:APP:byg.mixins.json:common.block.MixinAbstractBlockStateBookshelf,pl:mixin:APP:snowrealmagic.mixins.json:BlockStateMixin,pl:mixin:APP:valhelsia_structures.mixins.json:BlockStateBaseMixin,pl:mixin:A}
    at net.minecraft.world.level.block.state.BlockBehaviour$BlockStateBase.m_60713_(BlockBehaviour.java) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,re:computing_frames,re:classloading,pl:mixin:APP:byg.mixins.json:common.block.MixinAbstractBlockStateBookshelf,pl:mixin:APP:snowrealmagic.mixins.json:BlockStateMixin,pl:mixin:APP:valhelsia_structures.mixins.json:BlockStateBaseMixin,pl:mixin:A}
    at net.minecraft.client.resources.model.ModelBakery.m_119259_(ModelBakery.java:287) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:snowrealmagic.mixins.json:ModelBakeryMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:178) ~[?:?] {}
    at java.util.Spliterators$ArraySpliterator.forEachRemaining(Spliterators.java:992) ~[?:?] {}
    at java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509) ~[?:?] {}
    at java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499) ~[?:?] {}
    at java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:150) ~[?:?] {}
    at java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:173) ~[?:?] {}
    at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234) ~[?:?] {}
    at java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596) ~[?:?] {}
    at net.minecraft.client.resources.model.ModelBakery.m_119279_(ModelBakery.java:420) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:snowrealmagic.mixins.json:ModelBakeryMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at java.util.LinkedHashMap.forEach(LinkedHashMap.java:721) ~[?:?] {}
    at net.minecraft.client.resources.model.ModelBakery.m_119362_(ModelBakery.java:418) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:snowrealmagic.mixins.json:ModelBakeryMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at net.minecraft.client.resources.model.ModelBakery.m_119341_(ModelBakery.java:320) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:snowrealmagic.mixins.json:ModelBakeryMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at net.minecraft.client.resources.model.ModelBakery.m_119306_(ModelBakery.java:498) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:snowrealmagic.mixins.json:ModelBakeryMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at net.minecraft.client.resources.model.ModelBakery.lambda$processLoading$8(ModelBakery.java:189) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:snowrealmagic.mixins.json:ModelBakeryMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at com.google.common.collect.ImmutableList.forEach(ImmutableList.java:422) ~[guava-31.0.1-jre.jar%2321!/:?] {re:mixin}
    at net.minecraft.client.resources.model.ModelBakery.processLoading(ModelBakery.java:188) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:snowrealmagic.mixins.json:ModelBakeryMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at net.minecraftforge.client.model.ForgeModelBakery.<init>(ForgeModelBakery.java:61) ~[forge-1.18.1-39.1.2-universal.jar%23168!/:?] {re:classloading,re:mixin}
    at net.minecraft.client.resources.model.ModelManager.m_5944_(ModelManager.java:57) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:runtimedistcleaner:A,re:classloading,pl:mixin:APP:snowrealmagic.mixins.json:ModelManagerMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at net.minecraft.client.resources.model.ModelManager.m_5944_(ModelManager.java:20) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:runtimedistcleaner:A,re:classloading,pl:mixin:APP:snowrealmagic.mixins.json:ModelManagerMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at net.minecraft.server.packs.resources.SimplePreparableReloadListener.m_10786_(SimplePreparableReloadListener.java:11) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,re:classloading}
    at java.util.concurrent.CompletableFuture$AsyncSupply.run(CompletableFuture.java:1768) ~[?:?] {}
    at java.util.concurrent.CompletableFuture$AsyncSupply.exec(CompletableFuture.java:1760) ~[?:?] {}
    at java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:373) ~[?:?] {}
    at java.util.concurrent.ForkJoinPool$WorkQueue.topLevelExec(ForkJoinPool.java:1182) ~[?:?] {}
    at java.util.concurrent.ForkJoinPool.scan(ForkJoinPool.java:1655) ~[?:?] {}
    at java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1622) ~[?:?] {}
    at java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:165) ~[?:?] {}
 
 
A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------
 
-- Head --
Thread: Render thread
Stacktrace:
    at net.minecraft.world.level.block.state.BlockBehaviour$BlockStateBase.handler$zgh000$isBookshelf(BlockBehaviour.java:880) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,re:computing_frames,re:classloading,pl:mixin:APP:byg.mixins.json:common.block.MixinAbstractBlockStateBookshelf,pl:mixin:APP:snowrealmagic.mixins.json:BlockStateMixin,pl:mixin:APP:valhelsia_structures.mixins.json:BlockStateBaseMixin,pl:mixin:A}
    at net.minecraft.world.level.block.state.BlockBehaviour$BlockStateBase.m_60713_(BlockBehaviour.java) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,re:computing_frames,re:classloading,pl:mixin:APP:byg.mixins.json:common.block.MixinAbstractBlockStateBookshelf,pl:mixin:APP:snowrealmagic.mixins.json:BlockStateMixin,pl:mixin:APP:valhelsia_structures.mixins.json:BlockStateBaseMixin,pl:mixin:A}
    at net.minecraft.client.resources.model.ModelBakery.m_119259_(ModelBakery.java:287) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:snowrealmagic.mixins.json:ModelBakeryMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:178) ~[?:?] {}
    at java.util.Spliterators$ArraySpliterator.forEachRemaining(Spliterators.java:992) ~[?:?] {}
    at java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509) ~[?:?] {}
    at java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499) ~[?:?] {}
    at java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:150) ~[?:?] {}
    at java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:173) ~[?:?] {}
    at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234) ~[?:?] {}
    at java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596) ~[?:?] {}
    at net.minecraft.client.resources.model.ModelBakery.m_119279_(ModelBakery.java:420) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:snowrealmagic.mixins.json:ModelBakeryMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at java.util.LinkedHashMap.forEach(LinkedHashMap.java:721) ~[?:?] {}
-- Overlay render details --
Details:
    Overlay name: net.minecraft.client.gui.screens.LoadingOverlay
Stacktrace:
    at net.minecraft.client.renderer.GameRenderer.m_109093_(GameRenderer.java:878) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:create.mixins.json:accessor.GameRendererAccessor,pl:mixin:A,pl:runtimedistcleaner:A}
    at net.minecraft.client.Minecraft.m_91383_(Minecraft.java:1041) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:balm.mixins.json:MinecraftMixin,pl:mixin:APP:blueprint.mixins.json:client.MinecraftMixin,pl:mixin:APP:flywheel.mixins.json:PausedPartialTickAccessor,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:APP:terrablender_forge.mixins.json:client.MixinMinecraft,pl:mixin:APP:create.mixins.json:WindowResizeMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at net.minecraft.client.Minecraft.m_91374_(Minecraft.java:661) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:balm.mixins.json:MinecraftMixin,pl:mixin:APP:blueprint.mixins.json:client.MinecraftMixin,pl:mixin:APP:flywheel.mixins.json:PausedPartialTickAccessor,pl:mixin:APP:notenoughcrashes.mixins.json:client.MixinMinecraftClient,pl:mixin:APP:terrablender_forge.mixins.json:client.MixinMinecraft,pl:mixin:APP:create.mixins.json:WindowResizeMixin,pl:mixin:A,pl:runtimedistcleaner:A}
    at net.minecraft.client.main.Main.main(Main.java:205) ~[client-1.18.1-20211210.034407-srg.jar%23164!/:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:A,pl:runtimedistcleaner:A}
    at jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:?] {}
    at jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77) ~[?:?] {}
    at jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:?] {}
    at java.lang.reflect.Method.invoke(Method.java:568) ~[?:?] {}
    at net.minecraftforge.fml.loading.targets.CommonClientLaunchHandler.lambda$launchService$0(CommonClientLaunchHandler.java:45) ~[fmlloader-1.18.1-39.1.2.jar%2323!/:?] {}
    at cpw.mods.modlauncher.LaunchServiceHandlerDecorator.launch(LaunchServiceHandlerDecorator.java:37) [modlauncher-9.1.3.jar%235!/:?] {}
    at cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:53) [modlauncher-9.1.3.jar%235!/:?] {}
    at cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:71) [modlauncher-9.1.3.jar%235!/:?] {}
    at cpw.mods.modlauncher.Launcher.run(Launcher.java:106) [modlauncher-9.1.3.jar%235!/:?] {}
    at cpw.mods.modlauncher.Launcher.main(Launcher.java:77) [modlauncher-9.1.3.jar%235!/:?] {}
    at cpw.mods.modlauncher.BootstrapLaunchConsumer.accept(BootstrapLaunchConsumer.java:26) [modlauncher-9.1.3.jar%235!/:?] {}
    at cpw.mods.modlauncher.BootstrapLaunchConsumer.accept(BootstrapLaunchConsumer.java:23) [modlauncher-9.1.3.jar%235!/:?] {}
    at cpw.mods.bootstraplauncher.BootstrapLauncher.main(BootstrapLauncher.java:149) [bootstraplauncher-1.0.0.jar:?] {}
 
 
-- Last reload --
Details:
    Reload number: 1
    Reload reason: initial
    Finished: No
    Packs: Default
 
-- System Details --
Details:
    Minecraft Version: 1.18.1
    Minecraft Version ID: 1.18.1
    Operating System: Windows 10 (amd64) version 10.0
    Java Version: 17.0.1, Eclipse Adoptium
    Java VM Version: OpenJDK 64-Bit Server VM (mixed mode, sharing), Eclipse Adoptium
    Memory: 870566152 bytes (830 MiB) / 1723858944 bytes (1644 MiB) up to 6509559808 bytes (6208 MiB)
    CPUs: 8
    Processor Vendor: GenuineIntel
    Processor Name: Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz
    Identifier: Intel64 Family 6 Model 142 Stepping 10
    Microarchitecture: Coffee Lake
    Frequency (GHz): 1.99
    Number of physical packages: 1
    Number of physical CPUs: 4
    Number of logical CPUs: 8
    Graphics card #0 name: Intel(R) UHD Graphics 620
    Graphics card #0 vendor: Intel Corporation (0x8086)
    Graphics card #0 VRAM (MB): 1024.00
    Graphics card #0 deviceId: 0x5917
    Graphics card #0 versionInfo: DriverVersion=26.20.100.7263
    Memory slot #0 capacity (MB): 16384.00
    Memory slot #0 clockSpeed (GHz): 2.40
    Memory slot #0 type: DDR4
    Virtual memory max (MB): 31212.14
    Virtual memory used (MB): 15790.71
    Swap memory total (MB): 14994.30
    Swap memory used (MB): 1350.01
    JVM Flags: 5 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xmx6208m -Xms6208m -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xms256m
    Launched Version: 1.18.1
    Backend library: LWJGL version 3.2.2 SNAPSHOT
    Backend API: Intel(R) UHD Graphics 620 GL version 3.2.0 - Build 26.20.100.7263, Intel
    Window size: 854x480
    GL Caps: Using framebuffer using OpenGL 3.2
    GL debug messages: 
    Using VBOs: Yes
    Is Modded: Definitely; Client brand changed to 'forge'
    Type: Client (map_client.txt)
    Graphics mode: fancy
    Resource Packs: 
    Current Language: English (US)
    CPU: 8x Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz
    Client Crashes Since Restart: 1
    Integrated Server Crashes Since Restart: 0
    ModLauncher: 9.1.3+9.1.3+main.9b69c82a
    ModLauncher launch target: forgeclient
    ModLauncher naming: srg
    ModLauncher services: 
         mixin PLUGINSERVICE 
         eventbus PLUGINSERVICE 
         object_holder_definalize PLUGINSERVICE 
         runtime_enum_extender PLUGINSERVICE 
         capability_token_subclass PLUGINSERVICE 
         accesstransformer PLUGINSERVICE 
         runtimedistcleaner PLUGINSERVICE 
         mixin TRANSFORMATIONSERVICE 
         fml TRANSFORMATIONSERVICE 
    FML Language Providers: 
        minecraft@1.0
        javafml@null
    Mod List: 
        client-1.18.1-20211210.034407-srg.jar             |Minecraft                     |minecraft                     |1.18.1              |NONE      |Manifest: a1:d4:5e:04:4f:d3:d6:e0:7b:37:97:cf:77:b0:de:ad:4a:47:ce:8c:96:49:5f:0a:cf:8c:ae:b2:6d:4b:8a:3f
        forge-1.18.1-39.1.2-universal.jar                 |Forge                         |forge                         |39.1.2              |NONE      |Manifest: 84:ce:76:e8:45:35:e4:0e:63:86:df:47:59:80:0f:67:6c:c1:5f:6e:5f:4d:b3:54:47:1a:9f:7f:ed:5e:f2:90
    Suspected Mods: Forge (forge), Minecraft (minecraft)`