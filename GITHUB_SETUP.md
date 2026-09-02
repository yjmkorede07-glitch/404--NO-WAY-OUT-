# GitHub setup — 404: NO WAY OUT

This repository is intended to be the single source of truth for the project.

## What is included

- Unity 6.3 LTS production project, cumulative through Phase 54.
- Historical Phase 34 and Phase 35 source/contracts, preserved under `Legacy/` because those phases were not previously uploaded to GitHub.
- Engine-neutral contracts and production documentation.
- Unity `.gitignore` rules for generated folders and local build output.
- `.gitattributes` rules for Unity text files and binary assets.

## Repository creation

Create an **empty** GitHub repository for the project. When importing an existing local repository, GitHub recommends not pre-initializing the remote with another README, license, or `.gitignore`, which avoids an unnecessary merge conflict.

Recommended repository name:

`404-NO-WAY-OUT`

Keep the repository **Private** unless you intentionally decide to publish the project.

## First push

From this repository folder:

```bash
git remote add origin https://github.com/YOUR-USERNAME/404-NO-WAY-OUT.git
git push -u origin main
```

The local repository already contains its initial Git commit. Do not create a second unrelated repository inside it.

## Unity rules

Do not commit generated Unity folders such as `Library/`, `Temp/`, `Obj/`, `Logs/`, `UserSettings/`, or local build output. The root `.gitignore` handles these.

Do not commit passwords, API keys, private tokens, or production credentials. `.env` files are ignored; `.env.example` is safe to commit.

## Large assets

When final FBX, GLB/GLTF, WAV, EXR, HDR, or other large binary assets are added, use Git LFS rather than ordinary Git blobs where appropriate. Keep source/master assets and distributable build artifacts separated according to the production asset policy.

## Current engine decision

Primary production engine: **Unity 6.3 LTS**.

Unreal Engine 5.6+ remains a fallback because the project retains engine-neutral contracts. No production work is discarded if the engine decision changes later.
