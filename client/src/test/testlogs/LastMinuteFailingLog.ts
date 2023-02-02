export const LastMinuteFailingLog = `---- Minecraft Crash Report ----
// There are four lights!

Time: 2022-09-02 08:48:32
Description: Exception in server tick loop

java.lang.OutOfMemoryError: Java heap space


A detailed walkthrough of the error, its code path and all known details is as follows:
---------------------------------------------------------------------------------------

-- System Details --
Details:
\tMinecraft Version: 1.19.2
\tMinecraft Version ID: 1.19.2
\tOperating System: Windows 10 (amd64) version 10.0
\tJava Version: 17.0.3, Microsoft
\tJava VM Version: OpenJDK 64-Bit Server VM (mixed mode), Microsoft
\tMemory: 371172936 bytes (353 MiB) / 2147483648 bytes (2048 MiB) up to 2147483648 bytes (2048 MiB)
\tCPUs: 8
\tProcessor Vendor: GenuineIntel
\tProcessor Name: Intel(R) Core(TM) i5-8300H CPU @ 2.30GHz
\tIdentifier: Intel64 Family 6 Model 158 Stepping 10
\tMicroarchitecture: unknown
\tFrequency (GHz): 2.30
\tNumber of physical packages: 1
\tNumber of physical CPUs: 4
\tNumber of logical CPUs: 8
\tGraphics card #0 name: Intel(R) UHD Graphics 630
\tGraphics card #0 vendor: Intel Corporation (0x8086)
\tGraphics card #0 VRAM (MB): 1024.00
\tGraphics card #0 deviceId: 0x3e9b
\tGraphics card #0 versionInfo: DriverVersion=31.0.101.2111
\tGraphics card #1 name: NVIDIA GeForce GTX 1050 Ti
\tGraphics card #1 vendor: NVIDIA (0x10de)
\tGraphics card #1 VRAM (MB): 4095.00
\tGraphics card #1 deviceId: 0x1c8c
\tGraphics card #1 versionInfo: DriverVersion=30.0.14.9709
\tMemory slot #0 capacity (MB): 8192.00
\tMemory slot #0 clockSpeed (GHz): 2.67
\tMemory slot #0 type: DDR4
\tVirtual memory max (MB): 14208.39
\tVirtual memory used (MB): 10172.80
\tSwap memory total (MB): 6144.00
\tSwap memory used (MB): 376.87
\tJVM Flags: 9 total; -XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump -Xss1M -Xmx2G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M
\tFabric Mods: 
\t\tentityculling: EntityCulling-Fabric 1.5.2-mc1.19
\t\t\tcom_logisticscraft_occlusionculling: occlusionculling 0.0.6-SNAPSHOT
\t\tfabric-api: Fabric API 0.60.0+1.19.2
\t\t\tfabric-api-base: Fabric API Base 0.4.11+e62f51a390
\t\t\tfabric-api-lookup-api-v1: Fabric API Lookup API (v1) 1.6.9+9ff28f4090
\t\t\tfabric-biome-api-v1: Fabric Biome API (v1) 9.0.17+aeb40ebe90
\t\t\tfabric-blockrenderlayer-v1: Fabric BlockRenderLayer Registration (v1) 1.1.20+aeb40ebe90
\t\t\tfabric-client-tags-api-v1: Fabric Client Tags 1.0.1+b35fea8390
\t\t\tfabric-command-api-v1: Fabric Command API (v1) 1.2.11+f71b366f90
\t\t\tfabric-command-api-v2: Fabric Command API (v2) 2.1.7+0c17ea9690
\t\t\tfabric-commands-v0: Fabric Commands (v0) 0.2.28+df3654b390
\t\t\tfabric-containers-v0: Fabric Containers (v0) 0.1.34+df3654b390
\t\t\tfabric-content-registries-v0: Fabric Content Registries (v0) 3.2.3+aeb40ebe90
\t\t\tfabric-convention-tags-v1: Fabric Convention Tags 1.1.1+7cd20a1490
\t\t\tfabric-crash-report-info-v1: Fabric Crash Report Info (v1) 0.2.5+aeb40ebe90
\t\t\tfabric-data-generation-api-v1: Fabric Data Generation API (v1) 5.1.8+a680b9b490
\t\t\tfabric-dimensions-v1: Fabric Dimensions API (v1) 2.1.30+aeb40ebe90
\t\t\tfabric-entity-events-v1: Fabric Entity Events (v1) 1.4.18+9ff28f4090
\t\t\tfabric-events-interaction-v0: Fabric Events Interaction (v0) 0.4.28+aeb40ebe90
\t\t\tfabric-events-lifecycle-v0: Fabric Events Lifecycle (v0) 0.2.28+df3654b390
\t\t\tfabric-game-rule-api-v1: Fabric Game Rule API (v1) 1.0.21+aeb40ebe90
\t\t\tfabric-item-api-v1: Fabric Item API (v1) 1.5.7+35a03c4390
\t\t\tfabric-item-groups-v0: Fabric Item Groups (v0) 0.3.28+aeb40ebe90
\t\t\tfabric-key-binding-api-v1: Fabric Key Binding API (v1) 1.0.20+aeb40ebe90
\t\t\tfabric-keybindings-v0: Fabric Key Bindings (v0) 0.2.18+df3654b390
\t\t\tfabric-lifecycle-events-v1: Fabric Lifecycle Events (v1) 2.1.2+aeb40ebe90
\t\t\tfabric-loot-api-v2: Fabric Loot API (v2) 1.1.3+83a8659290
\t\t\tfabric-loot-tables-v1: Fabric Loot Tables (v1) 1.1.6+9e7660c690
\t\t\tfabric-message-api-v1: Fabric Message API (v1) 5.0.3+176380a290
\t\t\tfabric-mining-level-api-v1: Fabric Mining Level API (v1) 2.1.14+33fbc73890
\t\t\tfabric-models-v0: Fabric Models (v0) 0.3.17+aeb40ebe90
\t\t\tfabric-networking-api-v1: Fabric Networking API (v1) 1.2.4+5eb68ef290
\t\t\tfabric-networking-v0: Fabric Networking (v0) 0.3.21+df3654b390
\t\t\tfabric-object-builder-api-v1: Fabric Object Builder API (v1) 4.0.11+aeb40ebe90
\t\t\tfabric-particles-v1: Fabric Particles (v1) 1.0.10+aeb40ebe90
\t\t\tfabric-registry-sync-v0: Fabric Registry Sync (v0) 0.9.24+aeb40ebe90
\t\t\tfabric-renderer-api-v1: Fabric Renderer API (v1) 1.0.10+aeb40ebe90
\t\t\tfabric-renderer-indigo: Fabric Renderer - Indigo 0.6.12+aeb40ebe90
\t\t\tfabric-renderer-registries-v1: Fabric Renderer Registries (v1) 3.2.20+df3654b390
\t\t\tfabric-rendering-data-attachment-v1: Fabric Rendering Data Attachment (v1) 0.3.14+aeb40ebe90
\t\t\tfabric-rendering-fluids-v1: Fabric Rendering Fluids (v1) 3.0.7+aeb40ebe90
\t\t\tfabric-rendering-v0: Fabric Rendering (v0) 1.1.22+df3654b390
\t\t\tfabric-rendering-v1: Fabric Rendering (v1) 1.10.16+aeb40ebe90
\t\t\tfabric-resource-conditions-api-v1: Fabric Resource Conditions API (v1) 2.0.11+e62f51a390
\t\t\tfabric-resource-loader-v0: Fabric Resource Loader (v0) 0.6.1+aeb40ebe90
\t\t\tfabric-screen-api-v1: Fabric Screen API (v1) 1.0.26+f05effaf90
\t\t\tfabric-screen-handler-api-v1: Fabric Screen Handler API (v1) 1.2.13+9ff28f4090
\t\t\tfabric-textures-v0: Fabric Textures (v0) 1.0.20+aeb40ebe90
\t\t\tfabric-transfer-api-v1: Fabric Transfer API (v1) 2.0.11+83a8659290
\t\t\tfabric-transitive-access-wideners-v1: Fabric Transitive Access Wideners (v1) 1.3.0+42d99c3290
\t\tfabricloader: Fabric Loader 0.14.9
\t\tferritecore: FerriteCore 4.2.1
\t\tfpsreducer: FPS Reducer 1.19.2-2.1
\t\tiris: Iris 1.2.8
\t\t\torg_anarres_jcpp: jcpp 1.4.14
\t\tjava: OpenJDK 64-Bit Server VM 17
\t\tlazydfu: LazyDFU 0.1.3
\t\tlithium: Lithium 0.8.3
\t\tlogical_zoom: Logical Zoom 0.0.17
\t\tminecraft: Minecraft 1.19.2
\t\tmodmenu: Mod Menu 4.0.6
\t\tnotenoughcrashes: Not Enough Crashes 4.1.8+1.19.2
\t\tnoweathereffects: No Weather Effects 1.4.0
\t\treeses-sodium-options: Reese's Sodium Options 1.4.7+mc1.19.2-build.59
\t\tsmoke_suppression: Smoke Suppression 1.0.13
\t\t\tcrowdin-translate: CrowdinTranslate 1.4+1.19
\t\tsmoothboot: Smooth Boot 1.19-1.7.1
\t\tsodium: Sodium 0.4.4+build.18
\t\t\torg_joml_joml: joml 1.10.4
\t\tsodium-extra: Sodium Extra 0.4.10+mc1.19.2-build.64
\t\t\tcaffeineconfig: CaffeineConfig 1.0.0+1.17
\t\tstarlight: Starlight 1.1.1+fabric.ae22326
\t\tterralith: Terralith 2.3
\tLoaded Shaderpack: (off)
\tServer Running: true
\tPlayer Count: 0 / 8; []
\tData Packs: vanilla, Fabric Mods
\tWorld Generation: Experimental
\tType: Integrated Server (map_client.txt)
\tIs Modded: Definitely; Client brand changed to 'fabric'; Server brand changed to 'fabric'
\tLaunched Version: fabric-loader-0.14.9-1.19.2
\tClient Crashes Since Restart: 2
\tIntegrated Server Crashes Since Restart: 1
\tSuspected Mods: None`