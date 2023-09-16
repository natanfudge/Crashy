export const SeeminglySimpleLog = `Time: 2023-08-05 11:17:48
Description: Rendering overlay

java.lang.NullPointerException: Cannot invoke "it.unimi.dsi.fastutil.objects.Object2IntMap.getInt(Object)" because "this.uniformCache" is null
at net.minecraft.class_5944.redirect$bmg000$sodium$redirectGetUniformLocation(class_5944.java:2167)
at net.minecraft.class_5944.method_34586(class_5944.java:392)
at net.minecraft.class_291.method_34431(class_291.java:180)
at net.minecraft.class_291.method_34427(class_291.java:123)
at net.minecraft.class_286.method_43438(class_286.java:33)
at net.minecraft.class_286.method_43433(class_286.java:26)
at net.minecraft.class_332.method_25295(class_332.java:398)
at net.minecraft.class_332.method_25297(class_332.java:378)
at net.minecraft.class_332.method_25293(class_332.java:362)
at net.minecraft.class_425.method_25394(class_425.java:124)
at net.minecraft.class_757.method_3192(class_757.java:934)
at net.minecraft.class_310.method_1523(class_310.java:1219)
at net.minecraft.class_310.method_1514(class_310.java:802)
at net.minecraft.client.main.Main.main(Main.java:250)
at net.fabricmc.loader.impl.game.minecraft.MinecraftGameProvider.launch(MinecraftGameProvider.java:468)
at net.fabricmc.loader.impl.launch.knot.Knot.launch(Knot.java:74)
at net.fabricmc.loader.impl.launch.knot.KnotClient.main(KnotClient.java:23)

A detailed walkthrough of the error, its code path and all known details is as follows:
-- Head --
Thread: Render thread
Stacktrace:
at net.minecraft.class_5944.redirect$bmg000$sodium$redirectGetUniformLocation(class_5944.java:2167)
at net.minecraft.class_5944.method_34586(class_5944.java:392)
at net.minecraft.class_291.method_34431(class_291.java:180)
at net.minecraft.class_291.method_34427(class_291.java:123)
at net.minecraft.class_286.method_43438(class_286.java:33)
at net.minecraft.class_286.method_43433(class_286.java:26)
at net.minecraft.class_332.method_25295(class_332.java:398)
at net.minecraft.class_332.method_25297(class_332.java:378)
at net.minecraft.class_332.method_25293(class_332.java:362)
at net.minecraft.class_425.method_25394(class_425.java:124)

-- Overlay render details --
Details:
Overlay name: net.minecraft.class_425
Stacktrace:
at net.minecraft.class_757.method_3192(class_757.java:934)
at net.minecraft.class_310.method_1523(class_310.java:1219)
at net.minecraft.class_310.method_1514(class_310.java:802)
at net.minecraft.client.main.Main.main(Main.java:250)
at net.fabricmc.loader.impl.game.minecraft.MinecraftGameProvider.launch(MinecraftGameProvider.java:468)
at net.fabricmc.loader.impl.launch.knot.Knot.launch(Knot.java:74)
at net.fabricmc.loader.impl.launch.knot.KnotClient.main(KnotClient.java:23)`