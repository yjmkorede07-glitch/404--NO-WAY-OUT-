# Phase 26 — Online Life Paths, Starter Economy & Settings

This phase locks the Online onboarding experience and the in-game settings surface.

## Online starting state
- 10,000,000 VCR bank grant after character creation.
- No free house.
- No free business.
- No free vehicle collection.
- No automatic police-player role.
- One starter house and one starter vehicle must be purchased during onboarding.

## Life choice
- Legitimate
- Criminal with specialization
- Law Enforcement application

Law Enforcement requires a human/admin decision. Normal NPC police remain active in every path.

## First mission
`ONLINE_ONBOARDING / First Day in Veyron` is the mandatory onboarding chain: character → world → life → district recommendation → house → ID → car → freemode.

## Settings built into the runtime contract
The Settings menu contains Display, Graphics, Controls, Audio, Accessibility, Gameplay, Online, Notifications, Language and Account. Runtime defaults and setters are implemented in `UGameSettingsSubsystem`.

## Production note
Final UI widgets, art, localization, device-specific graphics presets and platform account integration remain production work when Unreal and the target devices are available. The runtime/data contracts are prepared now so they do not need to be redesigned later.
