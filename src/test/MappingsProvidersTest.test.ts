import {getYarnBuilds, getYarnMappings} from "../mappings/providers/YarnMappingsProvider";
import {getIntermediaryMappings} from "../mappings/providers/IntermediaryMappingsProvider";

test("Yarn mappings can be retrieved via new method", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings(versions[0].version)
    expect(mappings.classes.valueOf("net.minecraft.class_5973")).toEqual("net.minecraft.util.math.MathConstants")
    expect(mappings.noDescriptorToDescriptorMethods.valueOf("net.minecraft.class_3060#method_13365"))
        .toEqual("net.minecraft.server.command.ForceLoadCommand#register(Lcom/mojang/brigadier/CommandDispatcher;)V")
    expect(mappings.descriptorToDescriptorMethods.valueOf("net.minecraft.class_3060#method_13365(Lcom/mojang/brigadier/CommandDispatcher;)V"))
        .toEqual("net.minecraft.server.command.ForceLoadCommand#register(Lcom/mojang/brigadier/CommandDispatcher;)V")
}, 40000)
test("Intermediary mappings can be retrieved", async () => {
    const mappings = await getIntermediaryMappings("1.18.1")
    expect(mappings.classes.valueOf("aqb")).toEqual("net.minecraft.class_1234")
    expect(["net.minecraft.class_276#method_1234(IIZ)V","net.minecraft.class_276#method_1236(FFFF)V"]).toContain(mappings.noDescriptorToDescriptorMethods.valueOf("dqx#a"))
    expect(mappings.descriptorToDescriptorMethods.valueOf("dqx#a(IIZ)V")).toEqual("net.minecraft.class_276#method_1234(IIZ)V")
}, 30000)
