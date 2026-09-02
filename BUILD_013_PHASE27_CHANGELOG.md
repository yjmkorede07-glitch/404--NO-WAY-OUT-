# Build 013 — Phase 27 Changelog

## Online time
- Locked **5 real minutes = 1 in-game hour**.
- Locked **120 real minutes = 1 in-game day**.
- Corrected authoritative server world-clock tick to match the scale.

## Lifestyle
- Added Legitimate / Criminal / Law Enforcement lifestyle switching.
- Successful lifestyle changes have a **2 real-hour cooldown**.
- Law Enforcement remains gated by human/admin acceptance.
- NPC police remain active for every lifestyle.
- Server stores lifestyle state and timestamps.

## Online opening
- Added pre-choice cinematic contract: **OC-01 — Welcome to Veyron**.
- Added post-choice cinematic contract: **OC-02 — Your Life Starts Here**.
- Browser reference flow now goes character creation → grant → cinematic → life choice → cinematic → onboarding.

## Starting money
- Starting grant is server-authoritative and one-time per account.
- **10,000,000 VCR is deposited to bank balance**, not handed out as free assets.
- Added DB migration for bank balance to support the existing transfer contract.

## Law enforcement
- Added persistent application queue.
- Added admin list/decision routes protected by `ADMIN_API_KEY`.
- Accepted/rejected state is persisted and pushed to the connected applicant.

## Legitimate businesses with illegal sides
- Added 10 dual-use business archetypes.
- Legal operations remain the main business identity.
- Optional fictional illegal side activities add heat/evidence/reputation/closure consequences.
- Added server persistence for business side-activity activation.

## QA
- Phase 27 validator passes.
- Node syntax checks pass for server/db/browser additions.
- Native Unreal compile/runtime remains pending until UE 5.6.1 is installed on a larger development machine.
