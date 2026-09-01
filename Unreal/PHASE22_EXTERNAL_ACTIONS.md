# PHASE 22 — Exact Human/PC Actions When the Larger PC Is Available

Do these steps only when the 404 package is on a PC with enough free storage and Unreal Engine 5.6.1 installed.

## A. Put the project on disk
1. Extract `404-NO-WAY-OUT-Build-013-Portable-Production-Prep-v2.zip`.
2. Inside the extracted folder open `phase19batch09work/Unreal/`.
3. Copy the entire `Unreal` folder to a permanent development location, for example `D:/404_NO_WAY_OUT/Unreal/`.
4. Do not rename individual Source/Content files.

## B. First Unreal open
1. Open Epic Games Launcher.
2. Library → Unreal Engine 5.6.1 → Launch.
3. In Unreal, choose Open Project.
4. Select `D:/404_NO_WAY_OUT/Unreal/NoWayOut.uproject`.
5. If Unreal asks to rebuild C++ modules, choose Yes.
6. If a compiler error appears, stop and send the complete error text/screenshot. Do not delete Source files.

## C. First build verification
1. Let Unreal finish shader compilation and asset discovery.
2. Build the project in Development Editor.
3. Open the Output Log.
4. Verify there are no errors in `NoWayOut` or `NoWayOutEditor`.
5. Press Play.
6. Verify the greybox third-person pawn appears and keys 1/2/3 switch active protagonist state.

## D. Opening flow assets
Create these folders exactly:
- `Content/UI/Boot`
- `Content/UI/Title`
- `Content/UI/Loading`
- `Content/UI/Online`
- `Content/Cinematics/Opening`

The assistant will supply final UI/cinematic assets and exact filenames as those production passes are completed.

## E. Voice recording handoff
When a voice batch is requested:
1. Record clean WAV, 48 kHz, 24-bit.
2. Use mono unless a specific cinematic instruction says otherwise.
3. Leave headroom; never clip.
4. Record at least two usable takes for important cinematic lines.
5. Name each file exactly as supplied, e.g. `Darius_M01_001.wav`.
6. Put raw recordings in `Content/Audio/VO/Raw/`.
7. Do not normalize or rename files unless instructed.
8. Zip only the requested voice batch and upload it back to the assistant.

## F. Online server test
1. Install Node.js 18+ on the development PC.
2. Open a terminal in `phase19batch09work/server`.
3. Run `npm install`.
4. Run `npm start`.
5. The server should listen on port 8080 unless `PORT` is set.
6. Do not expose port 8080 directly to the public internet.
7. For production the service must use TLS/WSS, a managed database, secrets management, rate limits, monitoring and a deployment/load-balancer layer.

## G. What the human does NOT do
Do not invent mission logic, file names, online reward rules, loading screens, or folder names. The assistant will provide the exact artifact and placement instructions for each remaining external dependency.
