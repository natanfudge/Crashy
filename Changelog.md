# Crashy 2.0

Crashy 2.0 is a complete rewrite of the server side of Crashy. Here are the changes.

### Added

- **Mapping crash logs **

  Crashy now supports remapping class and methods names in the stacktrace of any crash log into the following namespaces:

  - Yarn (Fabric mappings)
  - MCP (Forge mappings, for applicable Minecraft versions)
  - Mojang (Mojang-provided mappings, starting 1.14.4)

  - Obfuscated (The way Minecraft is distributed)

  - Intermediary (The way Fabric runs Minecraft)

  - SRG (The way Forge runs Minecraft)

    
