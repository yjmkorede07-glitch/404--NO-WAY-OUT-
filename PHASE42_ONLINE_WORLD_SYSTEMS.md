# PHASE 42 — ONLINE WORLD SYSTEMS

The production foundation now carries the Online RP rules into Unity runtime/data contracts.

## Core flow
Launch Online -> choose official Veyron server -> create character -> choose Legitimate or Criminal -> starter house -> Citizen ID -> starter car -> one-time 10,000,000 VCR bank grant -> freemode.

Law Enforcement remains gated behind human/admin acceptance. NPC police continue operating independently.

## Authority
Money, property, vehicle ownership, Force status and custody-sensitive state are designated server-authoritative. Client-side code is not permitted to become the source of truth.

## Persistence
Character identity, Citizen ID, money, property, vehicle ownership and Force status have explicit persistence contracts and schema versioning hooks.

## Economy
Player-to-player VCR transfers validate source balance, reject invalid amounts, and create an audit record.
