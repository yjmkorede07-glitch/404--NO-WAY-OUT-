# Phase 24 Implementation Runbook

## Systems added
- PropertySubsystem
- MarketSubsystem
- ConstructionSubsystem
- WeatherSubsystem
- expanded freemode registry
- economy/property/construction/world data contracts

## Game-facing websites
The eventual UMG/phone browser should expose fictional in-world services:
- Veyron Realty — property listings
- Veyron Exchange — stock market
- Veyron Motors — vehicle purchases
- BlackNet — fictional high-risk marketplace
- Veyron Build & Design — construction and renovation
- Veyron Business Network — business acquisition/management

These are in-game interfaces, not real websites.

## Bank/store rule
Banks and stores remain physically visitable. Their map presence is never replaced by a website-only system. Websites supplement physical interaction.

## Construction visual progression
Construction actors/data layers should read the project's construction state and swap/enable staged geometry:
survey -> foundation -> frame -> exterior -> interior -> landscaping -> finished.
