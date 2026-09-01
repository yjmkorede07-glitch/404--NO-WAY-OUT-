# Online Backend V2

Build 008 adds persistent accounts and campaign progression to the real WebSocket backend.

## Added
- SQLite persistent account database
- scrypt password hashing
- login/register/resume token sessions
- persistent player profile
- persistent mission progress
- property table foundation
- server-side save endpoints
- existing authoritative movement, crime, mission and vehicle events remain

## Run
cd server
npm install
npm start

The browser connects to ws://localhost:8080 in local HTTP development.

## Production checklist
Use HTTPS/WSS, managed database, secure token rotation/expiry, rate limiting, CSRF/origin controls where applicable, secrets management, backups, monitoring, matchmaking and multiple server instances behind a load balancer.
