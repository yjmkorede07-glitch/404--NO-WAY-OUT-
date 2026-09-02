# GitHub setup for 404: NO WAY OUT

## Recommended repository
Create a private GitHub repository named:

`404-NO-WAY-OUT`

Keep it private while production assets, backend contracts, and unreleased game content are being developed.

## What to commit
Commit the project source, including:
- `Assets/`
- `Packages/`
- `ProjectSettings/`
- `Portable/`
- `Docs/`
- `Tools/`
- root documentation and configuration files

Do **not** commit Unity-generated folders or local build outputs covered by `.gitignore`.

## Large binary assets
GitHub repository limits apply to large binary assets. When final FBX/GLB/WAV/other binary production assets are added, use Git LFS where appropriate rather than ordinary Git blobs.

## Branch suggestion
- `main` — stable production source of truth
- `develop` — integration branch when multiple contributors are active
- `feature/*` — isolated changes

For the current solo phase, `main` alone is acceptable.
