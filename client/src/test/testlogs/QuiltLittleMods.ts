export const TestQuiltLittleModsLog = `---- Crashed! ----
Date/Time: 2023/05/14 08:25:36.8724

-- Crash --

org.quiltmc.loader.impl.FormattedException: java.lang.BootstrapMethodError: java.lang.RuntimeException: Mixin transformation of net.minecraft.server.MinecraftServer failed
\tat org.quiltmc.loader.impl.game.minecraft.MinecraftGameProvider.launch(MinecraftGameProvider.java:529)
\tat org.quiltmc.loader.impl.launch.knot.Knot.launch(Knot.java:82)
\tat org.quiltmc.loader.impl.launch.knot.KnotClient.main(KnotClient.java:28)
Caused by: java.lang.BootstrapMethodError: java.lang.RuntimeException: Mixin transformation of net.minecraft.server.MinecraftServer failed
\tat org.quiltmc.qsl.resource.loader.api.ResourceLoaderEvents.lambda$static$1(ResourceLoaderEvents.java:42)
\tat org.quiltmc.qsl.base.api.event.Event.update(Event.java:374)
\tat org.quiltmc.qsl.base.api.event.Event.<init>(Event.java:247)
\tat org.quiltmc.qsl.base.api.event.Event.create(Event.java:134)
\tat org.quiltmc.qsl.resource.loader.api.ResourceLoaderEvents.<clinit>(ResourceLoaderEvents.java:41)
\tat org.quiltmc.qsl.worldgen.surface_rule.impl.VanillaSurfaceRuleTracker.<init>(VanillaSurfaceRuleTracker.java:54)
\tat org.quiltmc.qsl.worldgen.surface_rule.impl.VanillaSurfaceRuleTracker.<clinit>(VanillaSurfaceRuleTracker.java:37)
\tat net.minecraft.class_6725.handler$epo000$quilt_surface_rule$quilt$injectOverworldRules(class_6725.java:543)
\tat net.minecraft.class_6725.method_39922(class_6725.java:268)
\tat net.minecraft.class_6725.method_39134(class_6725.java:65)
\tat net.minecraft.class_5284.method_30643(class_5284.java:129)
\tat net.minecraft.class_5284.method_31111(class_5284.java:82)
\tat net.minecraft.class_5458.method_44104(class_5458.java:98)
\tat net.minecraft.class_5458.method_30566(class_5458.java:105)
\tat java.base/java.util.LinkedHashMap.forEach(LinkedHashMap.java:721)
\tat net.minecraft.class_5458.<clinit>(class_5458.java:104)
\tat net.minecraft.class_2378.<clinit>(class_2378.java:326)
\tat net.minecraft.class_2966.method_12851(class_2966.java:50)
\tat net.minecraft.client.main.Main.method_44604(Main.java:161)
\tat net.minecraft.client.main.Main.main(Main.java:51)
\tat java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:104)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:577)
\tat org.quiltmc.loader.impl.game.minecraft.MinecraftGameProvider.launch(MinecraftGameProvider.java:527)
\t... 2 more
Caused by: java.lang.RuntimeException: Mixin transformation of net.minecraft.server.MinecraftServer failed
\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:458)
\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.tryLoadClass(KnotClassDelegate.java:244)
\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.loadClassOnly(KnotClassDelegate.java:164)
\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.loadClass(KnotClassDelegate.java:150)
\tat org.quiltmc.loader.impl.launch.knot.KnotClassLoader.loadClass(KnotClassLoader.java:228)
\tat java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:521)
\t... 25 more
Caused by: org.spongepowered.asm.mixin.transformer.throwables.MixinTransformerError: An unexpected critical error was encountered
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:392)
\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClass(MixinTransformer.java:234)
\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClassBytes(MixinTransformer.java:202)
\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:453)
\t... 30 more
Caused by: org.spongepowered.asm.mixin.injection.throwables.InjectionError: Critical injection failure: Redirector yeetUpdateSuppressionCrash_implOnTickWorlds(Lnet/minecraft/class_3218;Ljava/util/function/BooleanSupplier;)V in #carpet-tis-addition:carpet-tis-addition.mixins.json:rule.yeetUpdateSuppressionCrash.MinecraftServerMixin from mod carpet-tis-addition failed injection check, (0/1) succeeded. Scanned 1 target(s). Using refmap carpet-tis-addition-mc1.19.2-refmap.json
\tat org.spongepowered.asm.mixin.injection.struct.InjectionInfo.postInject(InjectionInfo.java:468)
\tat org.spongepowered.asm.mixin.transformer.MixinTargetContext.applyInjections(MixinTargetContext.java:1385)
\tat org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.applyInjections(MixinApplicatorStandard.java:1062)
\tat org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.applyMixin(MixinApplicatorStandard.java:402)
\tat org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.apply(MixinApplicatorStandard.java:327)
\tat org.spongepowered.asm.mixin.transformer.TargetClassContext.apply(TargetClassContext.java:421)
\tat org.spongepowered.asm.mixin.transformer.TargetClassContext.applyMixins(TargetClassContext.java:403)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:363)
\t... 33 more


-- Mods --

| Index | Mod                                               | ID                                                   | Version                     | Type    | File Hash (SHA-1)                        | File(s)                                                                                                    | Sub-File                                                                            |
|------:|---------------------------------------------------|------------------------------------------------------|-----------------------------|---------|------------------------------------------|------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
|   124 | Xibao                                             | xibaopp                                              | 0.1.0-release-mc1.19        | Fabric  | b7b3c7c1cf10258a58fbca2fa9ca1bc4f852deea | <mods>\\XibaoPlusPlus-Fabric-0.1.0-release-mc1.19.jar                                                       |                                                                                     |
|------:|---------------------------------------------------|------------------------------------------------------|-----------------------------|---------|------------------------------------------|------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
Mod Table Version: 2
Plugin Types: {quilted_fabric_loader=[Fabric], quilt_loader=[Quilt, Builtin]}


---- end of report ----`