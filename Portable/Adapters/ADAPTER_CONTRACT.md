# Engine Adapter Contract

Each engine adapter must provide:
1. World/entity import from `Portable/Data`.
2. Mission/state import from engine-neutral mission contracts.
3. Input/action mapping using stable action IDs.
4. Asset import from GLB/GLTF and FBX where supported.
5. Save/network payload compatibility with the same portable schemas.
6. No engine-native identifier may replace the stable project ID.

Stable IDs such as `district.veyr0n.central`, `mission.M01`, `poi.bank.central` remain authoritative.
