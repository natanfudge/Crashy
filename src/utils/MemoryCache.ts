export class MemoryCache<T> {
    cache: Record<string, T> = {}

    async get(key: string, orProduce: () => Promise<T>): Promise<T> {
        const cached = this.cache[key];
        if (cached !== undefined) {
            return cached;
        } else {
            const value = await orProduce();
            this.cache[key] = value;
            return value;
        }
    }
}

//
// type BuildsKey = string
// const buildsCache: Record<BuildsKey, MappingsBuilds> = {}
//
// async function getBuildsCached(mappingsProvider: MappingsProvider, minecraftVersion: string): Promise<MappingsBuilds> {
//     const key = mappingsProvider.fromNamespace + mappingsProvider.toNamespace + minecraftVersion;
//     const buildsCached = buildsCache[key];
//     if (buildsCached !== undefined) {
//         return buildsCached;
//     } else {
//         const value = await mappingsProvider.getBuilds(minecraftVersion);
//         buildsCache[key] = value;
//         return value;
//     }
// }
//
// type MappingsKey = string
// const mappingsCache: Record<MappingsKey, Mappings> = {}
//
// async function getMappingsCached(mappingsProvider: MappingsProvider, build: string): Promise<Mappings> {
//     const key = mappingsProvider.fromNamespace + mappingsProvider.toNamespace + build;
//     const mappingsCached = mappingsCache[key];
//     if (mappingsCached !== undefined) {
//         return mappingsCached;
//     } else {
//         const value = await mappingsProvider.getMappings(build);
//         mappingsCache[key] = value;
//         return value;
//     }
// }
