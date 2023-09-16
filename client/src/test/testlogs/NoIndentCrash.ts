export const NoIndentCrash = `---- Minecraft Crash Report ----
// Surprise! Haha. Well, this is awkward.

Time: 2023-05-23 14:08:38
Description: Rendering overlay

net.minecraftforge.fml.ModLoadingException: ConnectedTexturesMod (ctm) encountered an error during the done event phase
§7java.lang.NullPointerException: Cannot invoke "net.minecraft.client.resources.model.BakedModel.m_7521_()" because "this.originalModel" is null
at net.minecraftforge.fml.javafmlmod.FMLModContainer.acceptEvent(FMLModContainer.java:111) ~[javafmllanguage-1.19.2-43.2.11.jar%23207!/:?] {}
at net.minecraftforge.fml.ModLoader.lambda$postEvent$34(ModLoader.java:306) ~[fmlcore-1.19.2-43.2.11.jar%23206!/:?] {}
at java.lang.Iterable.forEach(Iterable.java:75) ~[?:?] {re:mixin}
at net.minecraftforge.fml.ModList.forEachModInOrder(ModList.java:225) ~[fmlcore-1.19.2-43.2.11.jar%23206!/:?] {}
at net.minecraftforge.fml.ModLoader.postEvent(ModLoader.java:306) ~[fmlcore-1.19.2-43.2.11.jar%23206!/:?] {}
at net.minecraftforge.client.ForgeHooksClient.onModelBake(ForgeHooksClient.java:485) ~[forge-1.19.2-43.2.11-universal.jar%23210!/:?] {re:mixin,re:classloading}
at net.minecraft.client.resources.model.ModelManager.m_5787_(ModelManager.java:75) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,pl:runtimedistcleaner:A}
at net.minecraft.client.resources.model.ModelManager.m_5787_(ModelManager.java:20) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,pl:runtimedistcleaner:A}
at net.minecraft.server.packs.resources.SimplePreparableReloadListener.m_10789_(SimplePreparableReloadListener.java:13) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,re:mixin}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:718) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at com.mojang.blaze3d.systems.RenderSystem.m_69884_(RenderSystem.java:211) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,re:classloading,pl:mixin:APP:flywheel.mixins.json:RenderTexturesMixin,pl:mixin:A}
at com.mojang.blaze3d.systems.RenderSystem.m_69495_(RenderSystem.java:198) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,re:classloading,pl:mixin:APP:flywheel.mixins.json:RenderTexturesMixin,pl:mixin:A}
at com.mojang.blaze3d.platform.Window.m_85435_(Window.java:337) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,pl:runtimedistcleaner:A}
at net.minecraft.client.Minecraft.m_91383_(Minecraft.java:1143) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:flywheel.mixins.json:PausedPartialTickAccessor,pl:mixin:APP:create.mixins.json:WindowResizeMixin,pl:mixin:A,pl:runtimedistcleaner:A}
at net.minecraft.client.Minecraft.m_91374_(Minecraft.java:700) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:flywheel.mixins.json:PausedPartialTickAccessor,pl:mixin:APP:create.mixins.json:WindowResizeMixin,pl:mixin:A,pl:runtimedistcleaner:A}
at net.minecraft.client.main.Main.m_239872_(Main.java:212) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:A,pl:runtimedistcleaner:A}
at net.minecraft.client.main.Main.main(Main.java:51) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:A,pl:runtimedistcleaner:A}
at jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:?] {}
at jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77) ~[?:?] {}
at jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:?] {}
at java.lang.reflect.Method.invoke(Method.java:568) ~[?:?] {}
at net.minecraftforge.fml.loading.targets.CommonClientLaunchHandler.lambda$launchService$0(CommonClientLaunchHandler.java:27) ~[fmlloader-1.19.2-43.2.11.jar%23101!/:?] {}
at cpw.mods.modlauncher.LaunchServiceHandlerDecorator.launch(LaunchServiceHandlerDecorator.java:30) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:53) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:71) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.Launcher.run(Launcher.java:106) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.Launcher.main(Launcher.java:77) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.BootstrapLaunchConsumer.accept(BootstrapLaunchConsumer.java:26) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.BootstrapLaunchConsumer.accept(BootstrapLaunchConsumer.java:23) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.bootstraplauncher.BootstrapLauncher.main(BootstrapLauncher.java:141) [bootstraplauncher-1.1.2.jar:?] {}
Caused by: java.lang.NullPointerException: Cannot invoke "net.minecraft.client.resources.model.BakedModel.m_7521_()" because "this.originalModel" is null
at net.minecraftforge.client.model.BakedModelWrapper.m_7521_(BakedModelWrapper.java:81) ~[forge-1.19.2-43.2.11-universal.jar%23210!/:?] {re:classloading}
at team.chisel.ctm.client.util.TextureMetadataHandler.onModelBake(TextureMetadataHandler.java:120) ~[CTM-1.19.2-1.1.6+8.jar%23189!/:1.19.2-1.1.6+8] {re:classloading}
at team.chisel.ctm.client.util.__TextureMetadataHandler_onModelBake_BakingCompleted.invoke(.dynamic) ~[CTM-1.19.2-1.1.6+8.jar%23189!/:1.19.2-1.1.6+8] {re:classloading,pl:eventbus:B}
at net.minecraftforge.eventbus.ASMEventHandler.invoke(ASMEventHandler.java:73) ~[eventbus-6.0.3.jar%2385!/:?] {}
at net.minecraftforge.eventbus.EventBus.post(EventBus.java:315) ~[eventbus-6.0.3.jar%2385!/:?] {}
at net.minecraftforge.eventbus.EventBus.post(EventBus.java:296) ~[eventbus-6.0.3.jar%2385!/:?] {}
at net.minecraftforge.fml.javafmlmod.FMLModContainer.acceptEvent(FMLModContainer.java:107) ~[javafmllanguage-1.19.2-43.2.11.jar%23207!/:?] {}
... 84 more

A detailed walkthrough of the error, its code path and all known details is as follows:
-- Head --
Thread: Render thread
Stacktrace:
at net.minecraftforge.fml.javafmlmod.FMLModContainer.acceptEvent(FMLModContainer.java:111) ~[javafmllanguage-1.19.2-43.2.11.jar%23207!/:?] {}
at net.minecraftforge.fml.ModLoader.lambda$postEvent$34(ModLoader.java:306) ~[fmlcore-1.19.2-43.2.11.jar%23206!/:?] {}
at java.lang.Iterable.forEach(Iterable.java:75) ~[?:?] {re:mixin}
at net.minecraftforge.fml.ModList.forEachModInOrder(ModList.java:225) ~[fmlcore-1.19.2-43.2.11.jar%23206!/:?] {}
at net.minecraftforge.fml.ModLoader.postEvent(ModLoader.java:306) ~[fmlcore-1.19.2-43.2.11.jar%23206!/:?] {}
at net.minecraftforge.client.ForgeHooksClient.onModelBake(ForgeHooksClient.java:485) ~[forge-1.19.2-43.2.11-universal.jar%23210!/:?] {re:mixin,re:classloading}
at net.minecraft.client.resources.model.ModelManager.m_5787_(ModelManager.java:75) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,pl:runtimedistcleaner:A}
at net.minecraft.client.resources.model.ModelManager.m_5787_(ModelManager.java:20) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,pl:runtimedistcleaner:A}
at net.minecraft.server.packs.resources.SimplePreparableReloadListener.m_10789_(SimplePreparableReloadListener.java:13) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,re:mixin}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:718) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_143940_(SimpleReloadInstance.java:69) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at net.minecraft.util.thread.BlockableEventLoop.execute(BlockableEventLoop.java:103) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,re:computing_frames,pl:accesstransformer:B,re:classloading,pl:accesstransformer:B}
at net.minecraft.server.packs.resources.SimpleReloadInstance.m_10834_(SimpleReloadInstance.java:68) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading}
at java.util.concurrent.CompletableFuture$UniCompletion.claim(CompletableFuture.java:572) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:714) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:510) ~[?:?] {}
at java.util.concurrent.CompletableFuture.postFire(CompletableFuture.java:614) ~[?:?] {}
at java.util.concurrent.CompletableFuture$UniAccept.tryFire(CompletableFuture.java:726) ~[?:?] {}
at java.util.concurrent.CompletableFuture$Completion.run(CompletableFuture.java:482) ~[?:?] {}
at com.mojang.blaze3d.systems.RenderSystem.m_69884_(RenderSystem.java:211) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,re:classloading,pl:mixin:APP:flywheel.mixins.json:RenderTexturesMixin,pl:mixin:A}
at com.mojang.blaze3d.systems.RenderSystem.m_69495_(RenderSystem.java:198) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,re:classloading,pl:mixin:APP:flywheel.mixins.json:RenderTexturesMixin,pl:mixin:A}
-- Overlay render details --
Details:
Overlay name: net.minecraft.client.gui.screens.LoadingOverlay
Stacktrace:
at net.minecraft.client.renderer.GameRenderer.m_109093_(GameRenderer.java:888) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:create.mixins.json:GameRendererMixin,pl:mixin:APP:create.mixins.json:accessor.GameRendererAccessor,pl:mixin:A,pl:runtimedistcleaner:A}
at net.minecraft.client.Minecraft.m_91383_(Minecraft.java:1115) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:flywheel.mixins.json:PausedPartialTickAccessor,pl:mixin:APP:create.mixins.json:WindowResizeMixin,pl:mixin:A,pl:runtimedistcleaner:A}
at net.minecraft.client.Minecraft.m_91374_(Minecraft.java:700) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:mixin,pl:accesstransformer:B,pl:runtimedistcleaner:A,re:classloading,pl:accesstransformer:B,pl:mixin:APP:flywheel.mixins.json:PausedPartialTickAccessor,pl:mixin:APP:create.mixins.json:WindowResizeMixin,pl:mixin:A,pl:runtimedistcleaner:A}
at net.minecraft.client.main.Main.m_239872_(Main.java:212) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:A,pl:runtimedistcleaner:A}
at net.minecraft.client.main.Main.main(Main.java:51) ~[client-1.19.2-20220805.130853-srg.jar%23205!/:?] {re:classloading,re:mixin,pl:runtimedistcleaner:A,pl:mixin:A,pl:runtimedistcleaner:A}
at jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:?] {}
at jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77) ~[?:?] {}
at jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:?] {}
at java.lang.reflect.Method.invoke(Method.java:568) ~[?:?] {}
at net.minecraftforge.fml.loading.targets.CommonClientLaunchHandler.lambda$launchService$0(CommonClientLaunchHandler.java:27) ~[fmlloader-1.19.2-43.2.11.jar%23101!/:?] {}
at cpw.mods.modlauncher.LaunchServiceHandlerDecorator.launch(LaunchServiceHandlerDecorator.java:30) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:53) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.LaunchServiceHandler.launch(LaunchServiceHandler.java:71) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.Launcher.run(Launcher.java:106) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.Launcher.main(Launcher.java:77) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.BootstrapLaunchConsumer.accept(BootstrapLaunchConsumer.java:26) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.modlauncher.BootstrapLaunchConsumer.accept(BootstrapLaunchConsumer.java:23) [modlauncher-10.0.8.jar%2388!/:?] {}
at cpw.mods.bootstraplauncher.BootstrapLauncher.main(BootstrapLauncher.java:141) [bootstraplauncher-1.1.2.jar:?] {}

-- Last reload --
Details:
Reload number: 1
Reload reason: initial
Finished: No
Packs: Default, Mod Resources

-- System Details --
Details:
Minecraft Version: 1.19.2
Minecraft Version ID: 1.19.2
Operating System: Windows 10 (amd64) version 10.0
Java Version: 17.0.3, Microsoft
Java VM Version: OpenJDK 64-Bit Server VM (mixed mode), Microsoft
Memory: 2313554984 bytes (2206 MiB) / 4060086272 bytes (3872 MiB) up to 8489271296 bytes (8096 MiB)
CPUs: 4
Processor Vendor: GenuineIntel
Processor Name: Intel(R) Core(TM) i5-4310U CPU @ 2.00GHz
Identifier: Intel64 Family 6 Model 69 Stepping 1
Microarchitecture: Haswell (Client)
Frequency (GHz): 2.59
Number of physical packages: 1
Number of physical CPUs: 2
Number of logical CPUs: 4
Graphics card #0 name: Intel(R) HD Graphics Family
Graphics card #0 vendor: Intel Corporation (0x8086)
Graphics card #0 VRAM (MB): 1024.00
Graphics card #0 deviceId: 0x0a16
Graphics card #0 versionInfo: DriverVersion=20.19.15.5126
Memory slot #0 capacity (MB): 8192.00
Memory slot #0 clockSpeed (GHz): 1.60
Memory slot #0 type: DDR3
Virtual memory max (MB): 20361.11
Virtual memory used (MB): 11639.63
Swap memory total (MB): 12288.00
Swap memory used (MB): 625.03
JVM Flags: 9 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xss1M -Xmx8072M -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M
Launched Version: MC Create Only!!!
Backend library: LWJGL version 3.3.1 build 7
Backend API: Intel(R) HD Graphics 4400 GL version 3.2.0 - Build 20.19.15.5126, Intel
Window size: 925x530
GL Caps: Using framebuffer using OpenGL 3.2
GL debug messages:
Using VBOs: Yes
Is Modded: Definitely; Client brand changed to 'forge'
Type: Client (map_client.txt)
Graphics mode: fancy
Resource Packs:
Current Language: English (US)
CPU: 4x Intel(R) Core(TM) i5-4310U CPU @ 2.00GHz
ModLauncher: 10.0.8+10.0.8+main.0ef7e830
ModLauncher launch target: forgeclient
ModLauncher naming: srg
ModLauncher services:
mixin-0.8.5.jar mixin PLUGINSERVICE
eventbus-6.0.3.jar eventbus PLUGINSERVICE
fmlloader-1.19.2-43.2.11.jar slf4jfixer PLUGINSERVICE
fmlloader-1.19.2-43.2.11.jar object_holder_definalize PLUGINSERVICE
fmlloader-1.19.2-43.2.11.jar runtime_enum_extender PLUGINSERVICE
fmlloader-1.19.2-43.2.11.jar capability_token_subclass PLUGINSERVICE
accesstransformers-8.0.4.jar accesstransformer PLUGINSERVICE
fmlloader-1.19.2-43.2.11.jar runtimedistcleaner PLUGINSERVICE
modlauncher-10.0.8.jar mixin TRANSFORMATIONSERVICE
modlauncher-10.0.8.jar fml TRANSFORMATIONSERVICE
FML Language Providers:
minecraft@1.0
javafml@null
kotlinforforge@3.12.0
lowcodefml@null
Mod List:
client-1.19.2-20220805.130853-srg.jar |Minecraft |minecraft |1.19.2 |DONE |Manifest: a1:d4:5e:04:4f:d3:d6:e0:7b:37:97:cf:77:b0🇩🇪ad:4a:47:ce:8c:96:49:5f:0a:cf:8c:ae:b2:6d:4b:8a:3f
FarmersDelight-1.19-1.2.1.jar |Farmer's Delight |farmersdelight |1.19-1.2.1 |DONE |Manifest: NOSIGNATURE
createbigcannons-1.19.2-beta-0.5.b.jar |Create Big Cannons |createbigcannons |1.19.2-beta-0.5.b |DONE |Manifest: NOSIGNATURE
create_misc_and_things_1.19.2_2.0.jar |create: things and misc |create_things_and_misc |1.0.0 |DONE |Manifest: NOSIGNATURE
kffmod-3.12.0.jar |Kotlin For Forge |kotlinforforge |3.12.0 |DONE |Manifest: NOSIGNATURE
flywheel-forge-1.19.2-0.6.8.a.jar |Flywheel |flywheel |0.6.8.a |DONE |Manifest: NOSIGNATURE
alloyed-1.19.2-v1.5.jar |Create: Alloyed |alloyed |1.19.2 |DONE |Manifest: NOSIGNATURE
create-1.19.2-0.5.0.i.jar |Create |create |0.5.0.i |DONE |Manifest: NOSIGNATURE
glassential-forge-1.19-1.2.4.jar |Glassential |glassential |1.19-1.2.4 |DONE |Manifest: NOSIGNATURE
create-stuff-additions1.19.2_v2.0.2c.jar |Create Stuff & Additions |create_sa |2.0.2. |DONE |Manifest: NOSIGNATURE
CTM-1.19.2-1.1.6+8.jar |ConnectedTexturesMod |ctm |1.19.2-1.1.6+8 |DONE |Manifest: NOSIGNATURE
create_central_kitchen-1.19.2-for-create-0.5.0.i-1|Create: Central Kitchen |create_central_kitchen |1.3.5 |DONE |Manifest: NOSIGNATURE
mixinextras-forge-0.2.0-beta.6.jar |MixinExtras |mixinextras |0.2.0-beta.6 |DONE |Manifest: NOSIGNATURE
create_dragon_lib-1.19.2-1.1.2.jar |Create: Dragon Lib |create_dragon_lib |1.1.2 |DONE |Manifest: NOSIGNATURE
Steam_Rails-1.2.6+forge-mc1.19.2.jar |Create: Steam 'n Rails |railways |1.2.6+forge-mc1.19.2|DONE |Manifest: NOSIGNATURE
forge-1.19.2-43.2.11-universal.jar |Forge |forge |43.2.11 |DONE |Manifest: 84:ce:76:e8:45:35:e4:0e:63:86:df:47:59:80:0f:67:6c:c1:5f:6e:5f:4d:b3:54:47:1a:9f:7f:ed:5e:f2:90
cofh_core-1.19.2-10.2.1.40.jar |CoFH Core |cofh_core |10.2.1 |DONE |Manifest: 75:0b:cc:9b:64:2e:9b:c4:41:d1:95:00:71:ee:87:1a:b3:5e:4b:da:8e:e8:39:00:fd:5d:e5:9c:40:42:33:09
thermal_core-1.19.2-10.2.0.5.jar |Thermal Series |thermal |10.2.0.5 |DONE |Manifest: 75:0b:cc:9b:64:2e:9b:c4:41:d1:95:00:71:ee:87:1a:b3:5e:4b:da:8e:e8:39:00:fd:5d:e5:9c:40:42:33:09
thermal_innovation-1.19.2-10.2.0.18.jar |Thermal Innovation |thermal_innovation |10.2.0.18 |DONE |Manifest: 75:0b:cc:9b:64:2e:9b:c4:41:d1:95:00:71:ee:87:1a:b3:5e:4b:da:8e:e8:39:00:fd:5d:e5:9c:40:42:33:09
thermal_cultivation-1.19.2-10.2.0.17.jar |Thermal Cultivation |thermal_cultivation |10.2.0.17 |DONE |Manifest: 75:0b:cc:9b:64:2e:9b:c4:41:d1:95:00:71:ee:87:1a:b3:5e:4b:da:8e:e8:39:00:fd:5d:e5:9c:40:42:33:09
thermal_foundation-1.19.2-10.2.0.47.jar |Thermal Foundation |thermal_foundation |10.2.0.47 |DONE |Manifest: NOSIGNATURE
thermal_expansion-1.19.2-10.2.0.21.jar |Thermal Expansion |thermal_expansion |10.2.0.21 |DONE |Manifest: 75:0b:cc:9b:64:2e:9b:c4:41:d1:95:00:71:ee:87:1a:b3:5e:4b:da:8e:e8:39:00:fd:5d:e5:9c:40:42:33:09
thermal_locomotion-1.19.2-10.2.0.14.jar |Thermal Locomotion |thermal_locomotion |10.2.0.14 |DONE |Manifest: 75:0b:cc:9b:64:2e:9b:c4:41:d1:95:00:71:ee:87:1a:b3:5e:4b:da:8e:e8:39:00:fd:5d:e5:9c:40:42:33:09
thermal_integration-1.19.2-10.2.0.17.jar |Thermal Integration |thermal_integration |10.2.0.17 |DONE |Manifest: 75:0b:cc:9b:64:2e:9b:c4:41:d1:95:00:71:ee:87:1a:b3:5e:4b:da:8e:e8:39:00:fd:5d:e5:9c:40:42:33:09
CodeChickenLib-1.19.2-4.3.1.481-universal.jar |CodeChicken Lib |codechickenlib |4.3.1.481 |DONE |Manifest: 31:e6:db:63:47:4a:6e:e0:0a:2c:11:d1:76:db:4e:82:ff:56:2d:29:93:d2:e5:02:bd:d3:bd:9d:27:47:a5:71
tl_skin_cape_forge_1.19_1.19.2-1.30.jar |TLSkinCape |tlskincape |1.30 |DONE |Manifest: ef:fe:e7:59:91:bb:3a:06:c1:94:f4:f3:9c:3e:26:69:47:fa:2e:c5:53:d3:38:21:65:cc:04:75:e7:61:19:40
geckolib-forge-1.19-3.1.40.jar |GeckoLib |geckolib3 |3.1.40 |DONE |Manifest: NOSIGNATURE
createteleporters1.0.jar |Create Teleporters |createteleporters |0.6.1 |DONE |Manifest: NOSIGNATURE
create_enchantment_industry-1.19.2-for-create-0.5.|Create Enchantment Industry |create_enchantment_industry |1.2.0 |DONE |Manifest: NOSIGNATURE
thermal_dynamics-1.19.2-10.2.1b.14.jar |Thermal Dynamics |thermal_dynamics |10.2.1b |DONE |Manifest: 75:0b:cc:9b:64:2e:9b:c4:41:d1:95:00:71:ee:87:1a:b3:5e:4b:da:8e:e8:39:00:fd:5d:e5:9c:40:42:33:09
sliceanddice-forge-2.1.1-forge.jar |Create Slice & Dice |sliceanddice |2.1.1 |DONE |Manifest: NOSIGNATURE
createaddition-1.19.2-20230507a.jar |Create Crafts & Additions |createaddition |1.19.2-20230507a |DONE |Manifest: NOSIGNATURE
Flywheel Backend: GL33 Instanced Arrays
Crash Report UUID: 3b98c108-d765-4aa1-bf1f-608f9e1c0cc1
FML: 43.2
Forge: net.minecraftforge:43.2.11`