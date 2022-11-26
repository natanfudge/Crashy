package io.github.crashy.mappings

data class MappingsId(val namespace: MappingsNamespace, val version: MappingsVersion)
data class MappingsVersion(val mcVersion: String, val build: Int?)
enum class MappingsNamespace {
    Yarn, Official, MojMap, Intermediary, Srg, Mcp, Quilt
}
//
//typealias Mappings = Map<String,ClassMappingsEntry>
//
//export type SerializedMappings = Record<string, ClassMappingsEntry>
//
// data class ClassMappingsEntry(val c: string, m: MethodEntry[])
//// Unmapped, mapped, unmapped descriptor
//export type MethodEntry = [string, string, string]
