import {allMappingNamespaces, MappingsNamespace} from "./MappingsNamespace";
import {MappingsProvider} from "./MappingsProvider";

/**
 * Problem: Given only a limited set of mappings from namespaces to other namespaces, find a way to map from any namespace to any other namespace.
 * We need to find a sequence of mappings that can eventually reach from 'fromNamespace' to 'toNamespace'.
 * This problem is equivalent to finding a path in a non-directed graph (because if we can map from a to b we can map from b to a), where we try to reach from the 'fromNamespace' node to the 'toNamespace' node.
 */
export function resolveMappingsChain(fromNamespace: MappingsNamespace, toNamespace: MappingsNamespace, availableProviders: MappingsProvider[]): MappingsProvider[] {
    return BFS(fromNamespace, toNamespace, availableProviders);
}

// function DFS(fromNamespace: string, toNamespace: string, availableProviders: MappingsProvider.ts[], visited: string[], path: MappingsProvider.ts[]): MappingsProvider.ts[] {
//     if (fromNamespace === toNamespace) {
//         return path;
//     }
//
//     for (let provider of availableProviders) {
//         if (visited.indexOf(provider.namespace) !== -1) {
//             continue;
//         }
//
//         visited.push(provider.namespace);
//         let result = DFS(provider.namespace, toNamespace, provider.getMappings(), visited, path.concat(provider));
//         if (result) {
//             return result;
//         }
//     }
//
//     return null;
// }

export function BFS(fromNamespace: MappingsNamespace, toNamespace: MappingsNamespace, availableProviders: MappingsProvider[]): MappingsProvider[] {
    const graphAdj = makeAdjacencyList(availableProviders);
    const visited: Set<MappingsNamespace> = new Set([fromNamespace]);
    const queue = [fromNamespace];

    const distances : Partial<Record<MappingsNamespace, number>> = {}
    const predecessors : Partial<Record<MappingsNamespace, MappingsNamespace>> = {}

    //TODO: figure out how to extract the path after we found the target node. (probably add another array and add to it)

    while (queue.length > 0) {
        let visiting = queue.shift()!;
        console.log(`we visited ${visiting}`)
        for (const neighborProvider of graphAdj[visiting]) {
            const neighbor = neighborProvider.node;
            if (visited.has(neighbor)) continue;
            visited.add(neighbor);

            if (neighbor === toNamespace) {
                throw new Error("TODO");
            }
            queue.push(neighbor);
        }
    }
    return [];
}

type MappingsAdjacencyList = Record<MappingsNamespace, { node: MappingsNamespace, provider: MappingsProvider }[]>;

function makeAdjacencyList(mappingsProviders: MappingsProvider[]): MappingsAdjacencyList {
    //TODO: make this into a generic function i think
    const adjacencyList = allMappingNamespaces.reduce((o, namespace) => ({
        ...o,
        [namespace]: []
    }), {}) as MappingsAdjacencyList

    for (const provider of mappingsProviders) {
        // We store the provider so we can know later what provider we need to use to implement the edge
        // Add fromNamespace => toNamespace as an edge
        adjacencyList[provider.fromNamespace].push({node: provider.toNamespace, provider});
        // Add toNamespace => fromNamespace as an edge
        adjacencyList[provider.toNamespace].push({node: provider.fromNamespace, provider});
    }
    return adjacencyList;
}