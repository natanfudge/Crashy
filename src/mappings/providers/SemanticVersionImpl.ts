/*
 * Copyright 2016 FabricMC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const COMPONENT_WILDCARD = Number.MIN_VALUE;

class VersionParsingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'VersionParsingError';
    }
}

// Taken from Fabric Loader https://github.com/FabricMC/fabric-loader/blob/cbb121843c861bbf97f4a4360047dd38ac3f9fd1/src/main/java/net/fabricmc/loader/impl/util/version/SemanticVersionImpl.java
export class SemanticVersionImpl {
    static DOT_SEPARATED_ID = /|[-\dA-Za-z]+(\\.[-\dA-Za-z]+)*/.compile();
    static UNSIGNED_INTEGER = /0|[1-9]\d*/.compile();
    components: number[];
    prerelease: string | undefined;
    build: string | undefined;
    friendlyName: string;


    constructor(ver: string) {
        let version = ver;
        const buildDelimPos = version.indexOf('+');
        if (buildDelimPos >= 0) {
            this.build = version.substring(buildDelimPos + 1);
            version = version.substring(0, buildDelimPos);
        } else {
            this.build = undefined;
        }

        const dashDelimPos = version.indexOf('-');

        if (dashDelimPos >= 0) {
            this.prerelease = version.substring(dashDelimPos + 1);
            version = version.substring(0, dashDelimPos);
        } else {
            this.prerelease = undefined;
        }

        if (this.prerelease !== undefined && !SemanticVersionImpl.DOT_SEPARATED_ID.test(this.prerelease)) {
            throw new VersionParsingError("Invalid prerelease string '" + this.prerelease + "'!");
        }

        if (this.build != null && !SemanticVersionImpl.DOT_SEPARATED_ID.test(this.build)) {
            throw new VersionParsingError("Invalid build string '" + this.build + "'!");
        }

        if (version.endsWith(".")) {
            throw new VersionParsingError("Negative version number component found!");
        } else if (version.startsWith(".")) {
            throw new VersionParsingError("Missing version component!");
        }

        const componentStrings = version.split(".");

        if (componentStrings.length < 1) {
            throw new VersionParsingError("Did not provide version numbers!");
        }

        let components = new Array<number>(componentStrings.length);
        const firstWildcardIdx = -1;

        for (let i = 0; i < componentStrings.length; i++) {
            const compStr = componentStrings[i];


            if (compStr.trim().length === 0) {
                throw new VersionParsingError("Missing version number component!");
            }

            const parsed = Number(compStr);
            if (isNaN(parsed)) {
                throw new VersionParsingError("Could not parse version number component '" + compStr + "'!");
            }
            components[i] = parsed


            if (components[i] < 0) {
                throw new VersionParsingError("Negative version number component '" + compStr + "'!");
            }
        }


// strip extra wildcards (1.x.x -> 1.x)
        if (firstWildcardIdx > 0 && components.length > firstWildcardIdx + 1) {
            components = components.slice(0, firstWildcardIdx + 1);
        }

        this.components = components;

        this.friendlyName = this.buildFriendlyName();
    }


    private buildFriendlyName(): string {
        let fnBuilder = "";
        let first = true;

        for (const i of this.components) {
            if (first) {
                first = false;
            } else {
                fnBuilder += "."
            }

            if (i === COMPONENT_WILDCARD) {
                fnBuilder += "x"
            } else {
                fnBuilder += i
            }
        }

        if (this.prerelease != null) {
            fnBuilder += ("-" + this.prerelease)
        }

        if (this.build != null) {
            fnBuilder += ("+" + this.build);
        }

        return fnBuilder;
    }


    equals(other: SemanticVersionImpl): boolean {
        if (!this.equalsComponentsExactly(other)) {
            return false;
        }
        return this.prerelease === other.prerelease && this.build === other.build;
    }


    getVersionComponent(pos: number): number {
        if (pos < 0) {
            throw new Error("Tried to access negative version number component!");
        } else if (pos >= this.components.length) {
            // Repeat "x" if x-range, otherwise repeat "0".
            return this.components[this.components.length - 1] === COMPONENT_WILDCARD ? COMPONENT_WILDCARD : 0;
        } else {
            return this.components[pos];
        }
    }


    toString(): string {
        return this.friendlyName;
    }

    getVersionComponentCount(): number {
        return this.components.length;
    }

    equalsComponentsExactly(other: SemanticVersionImpl): boolean {
        for (let i = 0; i < Math.max(this.getVersionComponentCount(), other.getVersionComponentCount()); i++) {
            if (this.getVersionComponent(i) !== other.getVersionComponent(i)) {
                return false;
            }
        }

        return true;
    }


    compareTo(o: SemanticVersionImpl): number {

        for (let i = 0; i < Math.max(this.getVersionComponentCount(), o.getVersionComponentCount()); i++) {
            const first = this.getVersionComponent(i);
            const second = o.getVersionComponent(i);

            if (first === COMPONENT_WILDCARD || second === COMPONENT_WILDCARD) {
                continue;
            }

            const compare = first - second;
            if (compare !== 0) return compare;
        }

        const prereleaseA = this.prerelease
        const prereleaseB = o.prerelease;

        if (prereleaseA !== undefined || prereleaseB !== undefined) {
            if (prereleaseA !== undefined && prereleaseB !== undefined) {
                const prereleaseATokenizer = prereleaseA.split(".");
                const prereleaseBTokenizer = prereleaseB.split(".");

                let i;
                for (i = 0; i < prereleaseATokenizer.length; i++) {
                    if (prereleaseBTokenizer.length > i) {
                        const partA = prereleaseATokenizer[i]
                        const partB = prereleaseBTokenizer[i]

                        if (SemanticVersionImpl.UNSIGNED_INTEGER.test(partA)) {
                            if (SemanticVersionImpl.UNSIGNED_INTEGER.test(partB)) {
                                const compare = partA.length - partB.length;
                                if (compare !== 0) return compare;
                            } else {
                                return -1;
                            }
                        } else {
                            if (SemanticVersionImpl.UNSIGNED_INTEGER.test(partB)) {
                                return 1;
                            }
                        }

                        const compare = partA.localeCompare(partB);
                        if (compare !== 0) return compare;
                    } else {
                        return 1;
                    }
                }


                return prereleaseBTokenizer.length > i ? -1 : 0;
            } else if (prereleaseA !== undefined) {
                return o.hasWildcard() ? 0 : -1;
            } else { // prereleaseB.isPresent()
                return this.hasWildcard() ? 0 : 1;
            }
        } else {
            return 0;
        }
    }

    hasWildcard(): boolean {
        for (const i of this.components) {
            if (i < 0) {
                return true;
            }
        }

        return false;
    }
}


