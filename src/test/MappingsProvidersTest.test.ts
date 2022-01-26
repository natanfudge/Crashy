import {getYarnBuilds} from "../mappings/YarnMappingsProvider";
import {getYarnMappings2} from "../mappings/providers/YarnMappingsProvider2";
import {getIntermediaryMappings} from "../mappings/providers/IntermediaryMappingsProvider";

test("Yarn mappings can be retrieved via new method", async () => {
    const versions = await getYarnBuilds("1.18.1");
    const mappings = await getYarnMappings2(versions[0].version)
    expect(mappings.classes["net.minecraft.class_5973"]).toEqual("net.minecraft.util.math.MathConstants")
    //TODO: needs to be changed to match descriptor stuff
    expect(mappings.noDescriptorToDescriptorMethods["net.minecraft.class_3060#method_13365"]).toEqual("net.minecraft.server.command.ForceLoadCommand#register")
}, 40000)
test("Intermediary mappings can be retrieved", async () => {
    const mappings = await getIntermediaryMappings("1.18.1")
    expect(mappings.classes["aqb"]).toEqual("net.minecraft.class_1234")
    //TODO: needs to be changed to match descriptor stuff
    expect(mappings.noDescriptorToDescriptorMethods["dqx#a"]).toEqual("net.minecraft.class_276#method_1234")
}, 30000)
