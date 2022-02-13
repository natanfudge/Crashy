import {mcVersions} from "./versions";

test("Transform Json", () => {
    const json = mcVersions;
    const transformed: string[] = [];
    const versions = json["versions"]
    for(const version of versions){
        transformed.push(version["id"])
    }

    const combined = "[" + transformed.map(v => `"${v}"`).join(",\n") + "]"
    const x = 2;
})

