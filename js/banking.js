function formatMoney(amount) {

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}


/*
    Creates a transaction record.
*/

function createTransaction(
    type,
    amount,
    description,
    direction
) {

    return {

        id:
            "txn_" +
            Date.now() +
            "_" +
            Math.floor(
                Math.random() * 100000
            ),

        type: type,

        amount: amount,

        direction: direction,

        description: description,

        date: new Date().toISOString()
    };
}


/*
    Add transaction to Darius.
*/

function addPlayerTransaction(
    type,
    amount,
    description,
    direction
) {

    const transaction =
        createTransaction(
            type,
            amount,
            description,
            direction
        );

    player.transactions.unshift(
        transaction
    );


    if (player.transactions.length > 100) {

        player.transactions =
            player.transactions.slice(0, 100);
    }
}


/*
    Add transaction to NPC.
*/

function addNPCTransaction(
    npc,
    type,
    amount,
    description,
    direction
) {

    const transaction =
        createTransaction(
            type,
            amount,
            description,
            direction
        );

    npc.transactions.unshift(
        transaction
    );


    if (npc.transactions.length > 100) {

        npc.transactions =
            npc.transactions.slice(0, 100);
    }
}


/*
    ATM WITHDRAWAL
*/

function withdrawCash(amount) {

    amount = Number(amount);


    if (!Number.isFinite(amount) || amount <= 0) {

        return {
            success: false,
            message: "Enter a valid amount."
        };
    }


    if (amount > player.bank.balance) {

        return {
            success: false,
            message: "Insufficient bank funds."
        };
    }


    player.bank.balance -= amount;

    player.cash += amount;


    addPlayerTransaction(
        "ATM_WITHDRAWAL",
        amount,
        "ATM cash withdrawal",
        "out"
    );


    savePlayer();


    return {
        success: true,
        message:
            `You withdrew ${formatMoney(amount)}.`
    };
}


/*
    ATM DEPOSIT
*/

function depositCash(amount) {

    amount = Number(amount);


    if (!Number.isFinite(amount) || amount <= 0) {

        return {
            success: false,
            message: "Enter a valid amount."
        };
    }


    if (amount > player.cash) {

        return {
            success: false,
            message: "You don't have enough cash."
        };
    }


    player.cash -= amount;

    player.bank.balance += amount;


    addPlayerTransaction(
        "ATM_DEPOSIT",
        amount,
        "ATM cash deposit",
        "in"
    );


    savePlayer();


    return {
        success: true,
        message:
            `You deposited ${formatMoney(amount)}.`
    };
}


/*
    BANK TRANSFER

    Darius -> NPC
*/

function transferToNPC(
    npcId,
    amount
) {

    amount = Number(amount);

    const npc =
        getNPCById(npcId);


    if (!npc) {

        return {
            success: false,
            message: "Recipient not found."
        };
    }


    if (!Number.isFinite(amount) || amount <= 0) {

        return {
            success: false,
            message: "Enter a valid amount."
        };
    }


    if (amount > player.bank.balance) {

        return {
            success: false,
            message: "Insufficient bank funds."
        };
    }


    /*
        Remove money from Darius.
    */

    player.bank.balance -= amount;


    /*
        Give money to recipient.
    */

    npc.bank.balance += amount;


    /*
        Record Darius transaction.
    */

    addPlayerTransaction(
        "BANK_TRANSFER",
        amount,
        `Transfer to ${npc.name}`,
        "out"
    );


    /*
        Record recipient transaction.
    */

    addNPCTransaction(
        npc,
        "BANK_TRANSFER",
        amount,
        `Transfer received from Darius Cole`,
        "in"
    );


    savePlayer();


    return {
        success: true,
        message:
            `Transferred ${formatMoney(amount)} to ${npc.name}.`
    };
}


/*
    IN-PERSON CASH TRANSFER

    Darius physically gives cash
    to an NPC.
*/

function transferCashToNPC(
    npcId,
    amount
) {

    amount = Number(amount);

    const npc =
        getNPCById(npcId);


    if (!npc) {

        return {
            success: false,
            message: "Recipient not found."
        };
    }


    if (!Number.isFinite(amount) || amount <= 0) {

        return {
            success: false,
            message: "Enter a valid amount."
        };
    }


    if (amount > player.cash) {

        return {
            success: false,
            message: "You don't have enough cash."
        };
    }


    /*
        Darius loses physical cash.
    */

    player.cash -= amount;


    /*
        NPC receives physical cash.
    */

    npc.cash += amount;


    /*
        Record both sides.
    */

    addPlayerTransaction(
        "CASH_TRANSFER",
        amount,
        `Cash given to ${npc.name}`,
        "out"
    );


    addNPCTransaction(
        npc,
        "CASH_TRANSFER",
        amount,
        `Cash received from Darius Cole`,
        "in"
    );


    savePlayer();


    return {
        success: true,
        message:
            `You gave ${formatMoney(amount)} to ${npc.name}.`
    };
}


/*
    CARD VALIDATION

    This is the foundation for future
    shops, restaurants, vehicles, etc.
*/

function isCardUsable() {

    return (
        player.bank.card &&
        player.bank.card.active === true
    );
}


/*
    CARD PAYMENT

    This will eventually be called by
    shops and businesses.
*/

function payWithCard(
    amount,
    merchantName
) {

    amount = Number(amount);


    if (!isCardUsable()) {

        return {
            success: false,
            message: "Your card cannot be used."
        };
    }


    if (!Number.isFinite(amount) || amount <= 0) {

        return {
            success: false,
            message: "Invalid payment amount."
        };
    }


    if (amount > player.bank.balance) {

        return {
            success: false,
            message: "Insufficient bank funds."
        };
    }


    player.bank.balance -= amount;


    addPlayerTransaction(
        "CARD_PAYMENT",
        amount,
        `Card payment - ${merchantName}`,
        "out"
    );


    savePlayer();


    return {
        success: true,
        message:
            `Paid ${formatMoney(amount)} with your card.`
    };
}
