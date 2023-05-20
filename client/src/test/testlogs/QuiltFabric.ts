export const QuiltFabricLog = `---- Minecraft Crash Report ----
// You're mean.

Time: 2023-05-19 21:33:02
Description: Initializing game

java.lang.RuntimeException: Could not execute entrypoint stage 'client' due to errors, provided by 'continuity'!
\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.lambda$invoke0$2(EntrypointUtils.java:66)
\tat org.quiltmc.loader.impl.util.ExceptionUtil.gatherExceptions(ExceptionUtil.java:34)
\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.invoke0(EntrypointUtils.java:64)
\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.invokeContainer(EntrypointUtils.java:49)
\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.invoke(EntrypointUtils.java:36)
\tat org.quiltmc.loader.impl.game.minecraft.Hooks.startClient(Hooks.java:56)
\tat net.minecraft.class_310.<init>(class_310.java:468)
\tat net.minecraft.client.main.Main.main(Main.java:198)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:568)
\tat org.quiltmc.loader.impl.game.minecraft.MinecraftGameProvider.launch(MinecraftGameProvider.java:527)
\tat org.quiltmc.loader.impl.launch.knot.Knot.launch(Knot.java:82)
\tat org.quiltmc.loader.impl.launch.knot.KnotClient.main(KnotClient.java:28)
\tSuppressed: org.quiltmc.loader.impl.entrypoint.QuiltEntrypointException: Exception while loading entries for entrypoint 'client' provided by 'replaymod'
\t\tat org.quiltmc.loader.impl.entrypoint.EntrypointStorage.lambda$getEntrypointContainers$1(EntrypointStorage.java:225)
\t\tat org.quiltmc.loader.impl.entrypoint.EntrypointContainerImpl.getEntrypoint(EntrypointContainerImpl.java:54)
\t\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.lambda$invoke$0(EntrypointUtils.java:36)
\t\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.invoke0(EntrypointUtils.java:62)
\t\t... 12 more
\tCaused by: org.quiltmc.loader.api.LanguageAdapterException: java.lang.reflect.InvocationTargetException
\t\tat org.quiltmc.loader.impl.util.DefaultLanguageAdapter.create(DefaultLanguageAdapter.java:62)
\t\tat org.quiltmc.loader.impl.entrypoint.EntrypointStorage$NewEntry.getOrCreate(EntrypointStorage.java:115)
\t\tat org.quiltmc.loader.impl.entrypoint.EntrypointStorage.lambda$getEntrypointContainers$1(EntrypointStorage.java:223)
\t\t... 15 more
\tCaused by: java.lang.reflect.InvocationTargetException
\t\tat java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
\t\tat java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:77)
\t\tat java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
\t\tat java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:499)
\t\tat java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:480)
\t\tat org.quiltmc.loader.impl.util.DefaultLanguageAdapter.create(DefaultLanguageAdapter.java:59)
\t\t... 17 more
\tCaused by: java.lang.NoSuchMethodError: 'int net.minecraft.class_6489.getProtocolVersion()'
\t\tat com.replaymod.core.versions.MCVer.getProtocolVersion(MCVer.java:101)
\t\tat com.replaymod.core.ReplayMod.<init>(ReplayMod.java:87)
\t\tat com.replaymod.core.ReplayModBackend.<init>(ReplayModBackend.java:10)
\t\t... 23 more
\tSuppressed: java.lang.BootstrapMethodError: java.lang.RuntimeException: Mixin transformation of net.minecraft.class_757 failed
\t\tat net.minecraft.class_4668.<clinit>(class_4668.java:126)
\t\tat net.fabricmc.fabric.api.renderer.v1.material.BlendMode.<clinit>(BlendMode.java:33)
\t\tat link.infra.indium.renderer.RenderMaterialImpl.<clinit>(RenderMaterialImpl.java:33)
\t\tat link.infra.indium.renderer.IndiumRenderer.materialFinder(IndiumRenderer.java:48)
\t\tat link.infra.indium.renderer.IndiumRenderer.<clinit>(IndiumRenderer.java:31)
\t\tat link.infra.indium.Indium.onInitializeClient(Indium.java:119)
\t\tat org.quiltmc.loader.impl.game.minecraft.Hooks.lambda$startClient$1(Hooks.java:56)
\t\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.lambda$invoke$0(EntrypointUtils.java:36)
\t\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.invoke0(EntrypointUtils.java:62)
\t\t... 12 more
\tCaused by: java.lang.RuntimeException: Mixin transformation of net.minecraft.class_757 failed
\t\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:456)
\t\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.tryLoadClass(KnotClassDelegate.java:246)
\t\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.loadClassOnly(KnotClassDelegate.java:164)
\t\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.loadClass(KnotClassDelegate.java:150)
\t\tat org.quiltmc.loader.impl.launch.knot.KnotClassLoader.loadClass(KnotClassLoader.java:228)
\t\tat java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:520)
\t\t... 21 more
\tCaused by: org.spongepowered.asm.mixin.transformer.throwables.MixinTransformerError: An unexpected critical error was encountered
\t\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:392)
\t\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClass(MixinTransformer.java:234)
\t\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClassBytes(MixinTransformer.java:202)
\t\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:451)
\t\t... 26 more
\tCaused by: org.spongepowered.asm.mixin.transformer.throwables.MixinPreProcessorException: Attach error for mixins.render.replaymod.json:Mixin_Omnidirectional_Rotation from mod (unknown) during activity: [Transform -> Method replayModRender_setupCubicFrameRotation(FJLnet/minecraft/class_4587;Lorg/spongepowered/asm/mixin/injection/callback/CallbackInfo;)V -> INVOKESPECIAL -> net/minecraft/class_1160::<init>:(FFF)V]
\t\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.attach(MixinPreProcessorStandard.java:313)
\t\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.createContextFor(MixinPreProcessorStandard.java:277)
\t\tat org.spongepowered.asm.mixin.transformer.MixinInfo.createContextFor(MixinInfo.java:1289)
\t\tat org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.apply(MixinApplicatorStandard.java:294)
\t\tat org.spongepowered.asm.mixin.transformer.TargetClassContext.apply(TargetClassContext.java:421)
\t\tat org.spongepowered.asm.mixin.transformer.TargetClassContext.applyMixins(TargetClassContext.java:403)
\t\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:363)
\t\t... 29 more
\tCaused by: java.lang.RuntimeException: java.lang.ClassNotFoundException: net.minecraft.class_1160
\t\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.transformMemberReference(MixinPreProcessorStandard.java:786)
\t\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.transformMethod(MixinPreProcessorStandard.java:772)
\t\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.transform(MixinPreProcessorStandard.java:738)
\t\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.attach(MixinPreProcessorStandard.java:307)
\t\t... 35 more
\tCaused by: java.lang.ClassNotFoundException: net.minecraft.class_1160
\t\t... 39 more
Caused by: java.lang.ExceptionInInitializerError
\tat me.pepperbell.continuity.client.properties.BaseCTMProperties.<clinit>(BaseCTMProperties.java:47)
\tat me.pepperbell.continuity.client.ContinuityClient.createLoader(ContinuityClient.java:206)
\tat me.pepperbell.continuity.client.ContinuityClient.onInitializeClient(ContinuityClient.java:87)
\tat org.quiltmc.loader.impl.game.minecraft.Hooks.lambda$startClient$1(Hooks.java:56)
\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.lambda$invoke$0(EntrypointUtils.java:36)
\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.invoke0(EntrypointUtils.java:62)
\t... 12 more
Caused by: java.lang.RuntimeException: Mixin transformation of net.minecraft.class_1059 failed
\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:456)
\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.tryLoadClass(KnotClassDelegate.java:246)
\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.loadClassOnly(KnotClassDelegate.java:164)
\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.loadClass(KnotClassDelegate.java:150)
\tat org.quiltmc.loader.impl.launch.knot.KnotClassLoader.loadClass(KnotClassLoader.java:228)
\tat java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:520)
\tat me.pepperbell.continuity.client.util.TextureUtil.toSpriteId(TextureUtil.java:13)
\tat me.pepperbell.continuity.client.util.TextureUtil.<clinit>(TextureUtil.java:10)
\t... 18 more
Caused by: org.spongepowered.asm.mixin.transformer.throwables.MixinTransformerError: An unexpected critical error was encountered
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:392)
\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClass(MixinTransformer.java:234)
\tat org.spongepowered.asm.mixin.transformer.MixinTransformer.transformClassBytes(MixinTransformer.java:202)
\tat org.quiltmc.loader.impl.launch.knot.KnotClassDelegate.getPostMixinClassByteArray(KnotClassDelegate.java:451)
\t... 25 more
Caused by: org.spongepowered.asm.mixin.throwables.MixinApplyError: Mixin [#continuity:continuity.mixins.json:SpriteAtlasTextureMixin from mod continuity] from phase [DEFAULT] in config [#continuity:continuity.mixins.json] FAILED during APPLY
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.handleMixinError(MixinProcessor.java:638)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.handleMixinApplyError(MixinProcessor.java:589)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:379)
\t... 28 more
Caused by: org.spongepowered.asm.mixin.transformer.throwables.InvalidMixinException: @Shadow method method_18164 in #continuity:continuity.mixins.json:SpriteAtlasTextureMixin from mod continuity was not located in the target class net.minecraft.class_1059. Using refmap continuity-refmap.json
\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.attachSpecialMethod(MixinPreProcessorStandard.java:436)
\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.attachShadowMethod(MixinPreProcessorStandard.java:412)
\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.attachMethods(MixinPreProcessorStandard.java:340)
\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.attach(MixinPreProcessorStandard.java:299)
\tat org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.createContextFor(MixinPreProcessorStandard.java:277)
\tat org.spongepowered.asm.mixin.transformer.MixinInfo.createContextFor(MixinInfo.java:1289)
\tat org.spongepowered.asm.mixin.transformer.MixinApplicatorStandard.apply(MixinApplicatorStandard.java:294)
\tat org.spongepowered.asm.mixin.transformer.TargetClassContext.apply(TargetClassContext.java:421)
\tat org.spongepowered.asm.mixin.transformer.TargetClassContext.applyMixins(TargetClassContext.java:403)
\tat org.spongepowered.asm.mixin.transformer.MixinProcessor.applyMixins(MixinProcessor.java:363)
\t... 28 more


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- Head --
Thread: Render thread
Stacktrace:
\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.lambda$invoke0$2(EntrypointUtils.java:66)
\tat org.quiltmc.loader.impl.util.ExceptionUtil.gatherExceptions(ExceptionUtil.java:34)
\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.invoke0(EntrypointUtils.java:64)
\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.invokeContainer(EntrypointUtils.java:49)
\tat org.quiltmc.loader.impl.entrypoint.EntrypointUtils.invoke(EntrypointUtils.java:36)
\tat org.quiltmc.loader.impl.game.minecraft.Hooks.startClient(Hooks.java:56)
\tat net.minecraft.class_310.<init>(class_310.java:468)

-- Initialization --
Details:
\tModules: 
\t\tADVAPI32.dll:Erweiterte Windows 32 Base-API:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tCOMCTL32.dll:Bibliothek für Steuerelemente:6.10 (WinBuild.160101.0800):Microsoft Corporation
\t\tCRYPT32.dll:Krypto-API32:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tCRYPTBASE.dll:Base cryptographic API DLL:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tCRYPTSP.dll:Cryptographic Service Provider API:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tDBGHELP.DLL:Windows Image Helper:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tDNSAPI.dll:DNS-Client-API-DLL:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tGDI32.dll:GDI Client DLL:10.0.22621.1635 (WinBuild.160101.0800):Microsoft Corporation
\t\tIMM32.DLL:Multi-User Windows IMM32 API Client DLL:10.0.22621.1344 (WinBuild.160101.0800):Microsoft Corporation
\t\tIPHLPAPI.DLL:IP-Hilfs-API:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tKERNEL32.DLL:Client-DLL für Windows NT-Basis-API:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tKERNELBASE.dll:Client-DLL für Windows NT-Basis-API:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tMSASN1.dll:ASN.1 Runtime APIs:10.0.22621.819 (WinBuild.160101.0800):Microsoft Corporation
\t\tMpOav.dll:IOfficeAntiVirus Module:4.18.2304.8 (WinBuild.160101.0800):Microsoft Corporation
\t\tNSI.dll:NSI User-mode interface DLL:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tNTASN1.dll:Microsoft ASN.1 API:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tOLEAUT32.dll:OLEAUT32.DLL:10.0.22621.608 (WinBuild.160101.0800):Microsoft Corporation
\t\tOle32.dll:Microsoft OLE für Windows:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tPSAPI.DLL:Process Status Helper:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tPdh.dll:Windows Unterstützungs-DLL für Leistungsdaten:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tRPCRT4.dll:Remoteprozeduraufruf-Laufzeitumgebung:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tSHCORE.dll:SHCORE:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tSHELL32.dll:Allgemeine Windows-Shell-DLL:10.0.22621.1635 (WinBuild.160101.0800):Microsoft Corporation
\t\tUSER32.dll:Client-DLL für Windows USER-API (mehrere Benutzer):10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tUSERENV.dll:Userenv:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tVCRUNTIME140.dll:Microsoft® C Runtime Library:14.29.30139.0 built by: vcwrkspc:Microsoft Corporation
\t\tVERSION.dll:Version Checking and File Installation Libraries:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tWINHTTP.dll:Windows HTTP-Dienste:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tWINMM.dll:MCI API-DLL:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tWINTRUST.dll:Microsoft Trust Verification APIs:10.0.22621.1485 (WinBuild.160101.0800):Microsoft Corporation
\t\tWS2_32.dll:Windows Socket 2.0-32-Bit-DLL:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tWSOCK32.dll:Windows Socket 32-Bit DLL:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tamsi.dll:Anti-Malware Scan Interface:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tbcrypt.dll:Bibliothek mit kryptografischen Primitiven von Windows:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tbcryptPrimitives.dll:Windows Cryptographic Primitives Library:10.0.22621.1344 (WinBuild.160101.0800):Microsoft Corporation
\t\tclbcatq.dll:COM+ Configuration Catalog:2001.12.10941.16384 (WinBuild.160101.0800):Microsoft Corporation
\t\tcombase.dll:Microsoft COM für Windows:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tdbgcore.DLL:Windows Core Debugging Helpers:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tdhcpcsvc.DLL:DHCP Clientdienst:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tdhcpcsvc6.DLL:DHCPv6-Client:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tfwpuclnt.dll:FWP/IPsec Benutzermodus-API:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tgdi32full.dll:GDI Client DLL:10.0.22621.1635 (WinBuild.160101.0800):Microsoft Corporation
\t\tglfw.dll:GLFW 3.4.0 DLL:3.4.0:GLFW
\t\tjava.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\tjavaw.exe:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\tjemalloc.dll
\t\tjimage.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\tjli.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\tjna5444499530738870117.dll:JNA native library:6.1.4:Java(TM) Native Access (JNA)
\t\tjsvml.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\tjvm.dll:OpenJDK 64-Bit server VM:17.0.3.0:Microsoft
\t\tkernel.appcore.dll:AppModel API Host:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tlwjgl.dll
\t\tmanagement.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\tmanagement_ext.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\tmsvcp140.dll:Microsoft® C Runtime Library:14.29.30139.0 built by: vcwrkspc:Microsoft Corporation
\t\tmsvcp_win.dll:Microsoft® C Runtime Library:10.0.22621.608 (WinBuild.160101.0800):Microsoft Corporation
\t\tmsvcrt.dll:Windows NT CRT DLL:7.0.22621.608 (WinBuild.160101.0800):Microsoft Corporation
\t\tmswsock.dll:Microsoft Windows Sockets 2.0-Dienstanbieter:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tnapinsp.dll:E-Mail-Namenshimanbieter:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tncrypt.dll:Windows NCrypt-Router:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tnet.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\tnio.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\tnlansp_c.dll:NLA Namespace Service Provider DLL:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tntdll.dll:DLL für NT-Layer:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tperfos.dll:DLL für Windows-Systemleistungsobjekte:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tpfclient.dll:SysMain Client:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tpnrpnsp.dll:PNRP-Namespaceanbieter:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tprofapi.dll:User Profile Basic API:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\trasadhlp.dll:Remote Access AutoDial Helper:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\trsaenh.dll:Microsoft Enhanced Cryptographic Provider:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tsechost.dll:Host for SCM/SDDL/LSA Lookup APIs:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tshlwapi.dll:Shell Light-weight-Hilfsprogrammbibliothek:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\tsunmscapi.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\tsymamsi.dll:Symantec AMSI provider:15.7.12.41:Broadcom
\t\tucrtbase.dll:Microsoft® C Runtime Library:10.0.22621.608 (WinBuild.160101.0800):Microsoft Corporation
\t\tvcruntime140_1.dll:Microsoft® C Runtime Library:14.29.30139.0 built by: vcwrkspc:Microsoft Corporation
\t\tverify.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
\t\twin32u.dll:Win32u:10.0.22621.1635 (WinBuild.160101.0800):Microsoft Corporation
\t\twindows.storage.dll:Microsoft WinRT Storage-API:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\twinrnr.dll:LDAP RnR Provider DLL:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\twintypes.dll:Windows-Basistypen-DLL:10.0.22621.1554 (WinBuild.160101.0800):Microsoft Corporation
\t\twshbth.dll:Windows Sockets Helper DLL:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\twshunix.dll:AF_UNIX Winsock2 Helper DLL:10.0.22621.1 (WinBuild.160101.0800):Microsoft Corporation
\t\tzip.dll:OpenJDK Platform binary:17.0.3.0:Microsoft
Stacktrace:
\tat net.minecraft.client.main.Main.main(Main.java:198)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:568)
\tat org.quiltmc.loader.impl.game.minecraft.MinecraftGameProvider.launch(MinecraftGameProvider.java:527)
\tat org.quiltmc.loader.impl.launch.knot.Knot.launch(Knot.java:82)
\tat org.quiltmc.loader.impl.launch.knot.KnotClient.main(KnotClient.java:28)

-- System Details --
Details:
\tMinecraft Version: 1.19.4
\tMinecraft Version ID: 1.19.4
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 17.0.3, Microsoft
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode), Microsoft
\tMemory: 312960552 bytes (298 MiB) / 738197504 bytes (704 MiB) up to 2147483648 bytes (2048 MiB)
\tCPUs: 12
\tProcessor Vendor: GenuineIntel
\tProcessor Name: 11th Gen Intel(R) Core(TM) i5-11400F @ 2.60GHz
\tIdentifier: Intel64 Family 6 Model 167 Stepping 1
\tMicroarchitecture: Rocket Lake
\tFrequency (GHz): 2.59
\tNumber of physical packages: 1
\tNumber of physical CPUs: 6
\tNumber of logical CPUs: 12
\tGraphics card #0 name: NVIDIA GeForce GTX 1650
\tGraphics card #0 vendor: NVIDIA (0x10de)
\tGraphics card #0 VRAM (MB): 4095.00
\tGraphics card #0 deviceId: 0x1f82
\tGraphics card #0 versionInfo: DriverVersion=31.0.15.2824
\tMemory slot #0 capacity (MB): 8192.00
\tMemory slot #0 clockSpeed (GHz): 3.20
\tMemory slot #0 type: DDR4
\tMemory slot #1 capacity (MB): 8192.00
\tMemory slot #1 clockSpeed (GHz): 3.20
\tMemory slot #1 type: DDR4
\tVirtual memory max (MB): 32677.83
\tVirtual memory used (MB): 27699.48
\tSwap memory total (MB): 16440.44
\tSwap memory used (MB): 1153.41
\tJVM Flags: 9 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xss1M -Xmx2G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M
\tFabric Mods: 
\t\tadvanced_runtime_resource_pack: Runtime Resource Pack 0.6.7
\t\tcloth-api: Cloth API 4.0.65
\t\t\tcloth-basic-math: cloth-basic-math 0.6.1
\t\t\tcloth-client-events-v0: Cloth Client Events v0 4.0.65
\t\t\tcloth-common-events-v1: Cloth Common Events v1 4.0.65
\t\t\tcloth-scissors-api-v1: Cloth Scissors API v1 4.0.65
\t\t\tcloth-utils-v1: Cloth Utils v1 4.0.65
\t\tcompleteconfig: CompleteConfig 2.3.0
\t\t\tcoat: Coat 1.0.0-beta.19+mc1.19.3
\t\t\tcompleteconfig-base: completeconfig-base 2.3.0
\t\t\tcompleteconfig-gui-cloth: completeconfig-gui-cloth 2.3.0
\t\t\tcompleteconfig-gui-coat: completeconfig-gui-coat 2.3.0
\t\t\tcompleteconfig-gui-yacl: completeconfig-gui-yacl 2.3.0
\t\tcontinuity: Continuity 2.0.2+1.19
\t\tdynamicfps: Dynamic FPS 2.2.0
\t\t\tcom_moandjiezana_toml_toml4j: toml4j 0.7.2
\t\tfabric-api: Fabric API 0.76.0+1.19.4
\t\t\tfabric-api-lookup-api-v1: Fabric API Lookup API (v1) 1.6.24+49abcf7ef4
\t\t\tfabric-biome-api-v1: Fabric Biome API (v1) 13.0.6+348a9c64f4
\t\t\tfabric-block-api-v1: Fabric Block API (v1) 1.0.5+e022e5d1f4
\t\t\tfabric-blockrenderlayer-v1: Fabric BlockRenderLayer Registration (v1) 1.1.33+c2e6f674f4
\t\t\tfabric-client-tags-api-v1: Fabric Client Tags 1.0.14+1134c5b8f4
\t\t\tfabric-command-api-v1: Fabric Command API (v1) 1.2.25+f71b366ff4
\t\t\tfabric-command-api-v2: Fabric Command API (v2) 2.2.4+ae0966baf4
\t\t\tfabric-commands-v0: Fabric Commands (v0) 0.2.42+df3654b3f4
\t\t\tfabric-containers-v0: Fabric Containers (v0) 0.1.52+df3654b3f4
\t\t\tfabric-content-registries-v0: Fabric Content Registries (v0) 3.5.7+ae0966baf4
\t\t\tfabric-convention-tags-v1: Fabric Convention Tags 1.4.0+9a7c5daaf4
\t\t\tfabric-crash-report-info-v1: Fabric Crash Report Info (v1) 0.2.14+aeb40ebef4
\t\t\tfabric-data-generation-api-v1: Fabric Data Generation API (v1) 11.3.5+5da15ca1f4
\t\t\tfabric-dimensions-v1: Fabric Dimensions API (v1) 2.1.44+7f87f8faf4
\t\t\tfabric-entity-events-v1: Fabric Entity Events (v1) 1.5.12+e45f7c65f4
\t\t\tfabric-events-interaction-v0: Fabric Events Interaction (v0) 0.4.42+a1ccd7bff4
\t\t\tfabric-events-lifecycle-v0: Fabric Events Lifecycle (v0) 0.2.51+df3654b3f4
\t\t\tfabric-game-rule-api-v1: Fabric Game Rule API (v1) 1.0.32+a1ccd7bff4
\t\t\tfabric-item-api-v1: Fabric Item API (v1) 2.1.16+09a3510cf4
\t\t\tfabric-item-group-api-v1: Fabric Item Group API (v1) 3.0.3+043f9acff4
\t\t\tfabric-keybindings-v0: Fabric Key Bindings (v0) 0.2.30+df3654b3f4
\t\t\tfabric-loot-api-v2: Fabric Loot API (v2) 1.1.25+75e98211f4
\t\t\tfabric-loot-tables-v1: Fabric Loot Tables (v1) 1.1.29+9e7660c6f4
\t\t\tfabric-message-api-v1: Fabric Message API (v1) 5.1.0+1ee8be40f4
\t\t\tfabric-mining-level-api-v1: Fabric Mining Level API (v1) 2.1.37+49abcf7ef4
\t\t\tfabric-models-v0: Fabric Models (v0) 0.3.29+11ba9c3bf4
\t\t\tfabric-networking-api-v1: Fabric Networking API (v1) 1.2.22+ca5f59aaf4
\t\t\tfabric-networking-v0: Fabric Networking (v0) 0.3.39+df3654b3f4
\t\t\tfabric-object-builder-api-v1: Fabric Object Builder API (v1) 7.0.1+63b515f4f4
\t\t\tfabric-particles-v1: Fabric Particles (v1) 1.0.22+f1e4495bf4
\t\t\tfabric-recipe-api-v1: Fabric Recipe API (v1) 1.0.6+a1ccd7bff4
\t\t\tfabric-registry-sync-v0: Fabric Registry Sync (v0) 2.1.2+a383ab97f4
\t\t\tfabric-renderer-api-v1: Fabric Renderer API (v1) 2.2.4+81e8c576f4
\t\t\tfabric-renderer-indigo: Fabric Renderer - Indigo 1.1.0+81e8c576f4
\t\t\tfabric-renderer-registries-v1: Fabric Renderer Registries (v1) 3.2.37+df3654b3f4
\t\t\tfabric-rendering-v0: Fabric Rendering (v0) 1.1.40+df3654b3f4
\t\t\tfabric-rendering-v1: Fabric Rendering (v1) 2.1.0+8f878217f4
\t\t\tfabric-resource-conditions-api-v1: Fabric Resource Conditions API (v1) 2.3.0+e6c7d4eef4
\t\t\tfabric-screen-handler-api-v1: Fabric Screen Handler API (v1) 1.3.18+5da15ca1f4
\t\t\tfabric-sound-api-v1: Fabric Sound API (v1) 1.0.8+75e98211f4
\t\t\tfabric-transfer-api-v1: Fabric Transfer API (v1) 3.0.1+9003cbe9f4
\t\t\tfabric-transitive-access-wideners-v1: Fabric Transitive Access Wideners (v1) 3.0.2+63b515f4f4
\t\tfabric-language-kotlin: Fabric Language Kotlin 1.9.4+kotlin.1.8.21
\t\t\torg_jetbrains_kotlin_kotlin-reflect: kotlin-reflect 1.8.21
\t\t\torg_jetbrains_kotlin_kotlin-stdlib: kotlin-stdlib 1.8.21
\t\t\torg_jetbrains_kotlin_kotlin-stdlib-jdk7: kotlin-stdlib-jdk7 1.8.21
\t\t\torg_jetbrains_kotlin_kotlin-stdlib-jdk8: kotlin-stdlib-jdk8 1.8.21
\t\t\torg_jetbrains_kotlinx_atomicfu-jvm: atomicfu-jvm 0.20.2
\t\t\torg_jetbrains_kotlinx_kotlinx-coroutines-core-jvm: kotlinx-coroutines-core-jvm 1.6.4
\t\t\torg_jetbrains_kotlinx_kotlinx-coroutines-jdk8: kotlinx-coroutines-jdk8 1.6.4
\t\t\torg_jetbrains_kotlinx_kotlinx-datetime-jvm: kotlinx-datetime-jvm 0.4.0
\t\t\torg_jetbrains_kotlinx_kotlinx-serialization-cbor-jvm: kotlinx-serialization-cbor-jvm 1.5.0
\t\t\torg_jetbrains_kotlinx_kotlinx-serialization-core-jvm: kotlinx-serialization-core-jvm 1.5.0
\t\t\torg_jetbrains_kotlinx_kotlinx-serialization-json-jvm: kotlinx-serialization-json-jvm 1.5.0
\t\tfiveonefouroneeight: FiveOneFourOneEight 1.0.0
\t\tindium: Indium 1.0.15+mc1.19.4
\t\tjava: OpenJDK 64-Bit Server VM 17
\t\tkrypton: Krypton 0.2.1
\t\t\tcom_velocitypowered_velocity-native: velocity-native 3.1.2-SNAPSHOT
\t\tlazydfu: LazyDFU 0.1.3
\t\tlithium: Lithium 0.11.1
\t\tmalilib: MaLiLib 0.15.4
\t\tmarlows-crystal-optimizer: Marlow's Crystal Optimizer 1.0.0
\t\tmidnightlib: MidnightLib 1.3.0
\t\tminecraft: Minecraft 1.19.4
\t\tminihud: MiniHUD 0.26.2
\t\tmodmenu: Mod Menu 6.2.2
\t\t\tfabric-key-binding-api-v1: Fabric Key Binding API (v1) 1.0.32+c477957ef4
\t\t\tfabric-lifecycle-events-v1: Fabric Lifecycle Events (v1) 2.2.14+5da15ca1f4
\t\t\tfabric-resource-loader-v0: Fabric Resource Loader (v0) 0.11.0+938a1d56f4
\t\t\tfabric-screen-api-v1: Fabric Screen API (v1) 1.0.44+8c25edb4f4
\t\tmorechathistory: MoreChatHistory 1.1.1
\t\tnohurtcam: NoHurtCam 1
\t\tquilt_loader: Quilt Loader 0.18.10
\t\treplaymod: Replay Mod 1.19.2-2.6.12
\t\tsmoothboot: Smooth Boot 1.19.4-1.7.0
\t\tsodium: Sodium 0.4.10+build.24
\t\t\tfabric-api-base: Fabric API Base 0.4.23+9ff28bced8
\t\t\tfabric-rendering-data-attachment-v1: Fabric Rendering Data Attachment (v1) 0.3.27+afca2f3ed8
\t\t\tfabric-rendering-fluids-v1: Fabric Rendering Fluids (v1) 3.0.20+f1e4495bd8
\t\tstarlight: Starlight 1.1.1+fabric.ae22326
\t\ttooltipfix: ToolTip Fix 1.1.1-1.19.3
\tLaunched Version: quilt-loader-0.18.10-1.19.4
\tBackend library: LWJGL version 3.3.1 build 7
\tBackend API: Unknown
\tWindow size: <not initialized>
\tGL Caps: Using framebuffer using OpenGL 3.2
\tGL debug messages: <disabled>
\tUsing VBOs: Yes
\tIs Modded: Definitely; Client brand changed to 'quilt'
\tType: Client (map_client.txt)
\tCPU: <unknown>`