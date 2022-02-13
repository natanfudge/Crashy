import {SemanticVersionImpl} from "../mappings/providers/SemanticVersionImpl";

test("Semantic Version implementation works correctly", () => {
    const versions = [
        new SemanticVersionImpl("1.7.10-pre4"),
        new SemanticVersionImpl("1.7.10"),
        new SemanticVersionImpl("1.10.2"),
        new SemanticVersionImpl("1.14-4"),
        new SemanticVersionImpl("1.14"),
        new SemanticVersionImpl("1.16.4-pre1"),
        new SemanticVersionImpl("1.16.4-pre4"),
        new SemanticVersionImpl("1.16.4"),
        new SemanticVersionImpl("1.18.1")
    ]

    expect(new SemanticVersionImpl("1.16.4-pre4").equals(new SemanticVersionImpl("1.16.4-pre4"))).toBeTruthy()

    for (let i = 0; i < versions.length; i++) {
        for (let j = 0; j < versions.length; j++) {
            const versionA = versions[i];
            const versionB = versions[j]

            // console.log(`Compare ${versionA.toString()} to ${versionB.toString()}`)

            const equalsResult = expect(versionA.equals(versionB))
            const compareToResult = expect(versionA.compareTo(versionB));
            if (i === j) {
                equalsResult.toBeTruthy();
                compareToResult.toEqual(0)
            } else if (i > j) {
                // i comes after j
                equalsResult.toBeFalsy();
                compareToResult.toBeGreaterThan(0)
            } else {
                equalsResult.toBeFalsy();
                compareToResult.toBeLessThan(0);
            }
        }
    }
})