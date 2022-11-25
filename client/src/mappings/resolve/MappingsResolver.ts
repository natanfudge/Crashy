import {allMappingNamespaces, MappingsNamespace} from "../MappingsNamespace";
import {MappingsProvider, allMappingsProviders} from "../providers/MappingsProvider";
import {toRecord} from "../../fudge-commons/methods/Javascript";
import {Queue} from "../../fudge-commons/collections/Queue";

/**
 * Problem: Given only a limited set of mappings from namespaces to other namespaces, find a way to map from any namespace to any other namespace.
 * We need to find a sequence of mappings that can eventually reach from 'fromNamespace' to 'toNamespace'.
 * This problem is equivalent to finding a path in a non-directed graph (because if we can map from a to b we can map from b to a), where we try to reach from the 'fromNamespace' node to the 'toNamespace' node.
 */
export function resolveMappingsChain(fromNamespace: MappingsNamespace, toNamespace: MappingsNamespace): MappingsProvider[] | undefined {
    if(fromNamespace === toNamespace) return [];
    return findShortestPath(fromNamespace, toNamespace, allMappingsProviders);
}

type PartialRecord<K extends keyof any, V> = Partial<Record<K, V>>
type ShortLinks = PartialRecord<MappingsNamespace, { prev: MappingsNamespace, provider: MappingsProvider }>

// This is the BFS algorithm
function findShortestPath(fromNamespace: MappingsNamespace, toNamespace: MappingsNamespace, availableProviders: MappingsProvider[]): MappingsProvider[] | undefined {
    const graphAdj = makeAdjacencyList(availableProviders);

    const visited: Set<MappingsNamespace> = new Set([fromNamespace]);
    const queue: Queue<MappingsNamespace> = new Queue(fromNamespace)

    // When a BFS reaches a node, it will reach it by the shortest path.
    // We store in this map how exactly the BFS reached each node, and then track back from the 'toNamespace' node to find the shortest path.
    const shortLinks: ShortLinks = {}

    while (queue.isNotEmpty()) {
        const node = queue.dequeue()!;
        for (const neighbor of graphAdj[node]) {
            const neighborNode = neighbor.node;
            if (visited.has(neighborNode)) continue;
            shortLinks[neighborNode] = {prev: node, provider: neighbor.provider}
            if (neighborNode === toNamespace) return createPathFromShortLinks(shortLinks,fromNamespace, toNamespace);


            visited.add(neighborNode)
            queue.push(neighborNode)
        }
    }
    return undefined;
}

function createPathFromShortLinks(shortLinks: ShortLinks, fromNamespace: MappingsNamespace, toNamespace: MappingsNamespace): MappingsProvider[] {
    const path: MappingsProvider[] = [];
    let current = toNamespace;
    while (current !== fromNamespace) {
        path.push(shortLinks[current]!.provider);
        current = shortLinks[current]!.prev;
    }
    return path.reverse();
}

type MappingsAdjacencyList = Record<MappingsNamespace, { node: MappingsNamespace, provider: MappingsProvider }[]>;

function makeAdjacencyList(mappingsProviders: MappingsProvider[]): MappingsAdjacencyList {
    const adjacencyList = allMappingNamespaces.toRecord(namespace => [namespace,[]]) as MappingsAdjacencyList;

    for (const provider of mappingsProviders) {
        // We store the provider so we can know later what provider we need to use to implement the edge
        // Add fromNamespace => toNamespace as an edge
        adjacencyList[provider.fromNamespace].push({node: provider.toNamespace, provider});
        // Add toNamespace => fromNamespace as an edge
        adjacencyList[provider.toNamespace].push({node: provider.fromNamespace, provider});
    }
    return adjacencyList;
}
