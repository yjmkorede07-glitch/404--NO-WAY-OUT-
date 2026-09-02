# PLAYER MONEY TRANSFER CONTRACT

A player can send money to another verified online player from the phone, ATM or bank terminal.

### Transaction
`TRANSFER:<sender>:<recipient>:<amount>:<idempotency_key>`

Server validates:
- authenticated sender
- authenticated recipient
- amount bounds
- sender available bank balance
- transfer limit
- cooldown/rate limit
- idempotency key not already committed

Server commits a ledger entry before acknowledging success.

Client never directly edits cash/bank values.
