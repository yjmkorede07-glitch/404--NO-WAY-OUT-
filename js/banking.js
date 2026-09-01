function formatMoney(amount) {

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}


function addTransaction(
    type,
    amount,
    description,
    direction
) {

    const transaction = {

        id:
            "txn_" +
            Date.now() +
            "_" +
            Math.floor(Math.random() * 10000),

        type: type,

        amount: amount,

        direction: direction,

        description: description,

        date: new Date().toISOString()
    };

    player.transactions.unshift(transaction);

    // Keep the history manageable.
    if (player.transactions.length > 100) {
        player.transactions =
            player.transactions.slice(0, 100);
    }
}


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

    addTransaction(
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

    addTransaction(
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


function transferToPerson(
    recipientName,
    amount
) {

    amount = Number(amount);

    if (!recipientName.trim()) {
        return {
            success: false,
            message: "Enter a recipient."
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

    player.bank.balance -= amount;

    addTransaction(
        "PERSON_TRANSFER",
        amount,
        `Transfer to ${recipientName}`,
        "out"
    );

    savePlayer();

    return {
        success: true,
        message:
            `Transferred ${formatMoney(amount)} to ${recipientName}.`
    };
}


function transferCashToPerson(
    recipientName,
    amount
) {

    amount = Number(amount);

    if (!recipientName.trim()) {
        return {
            success: false,
            message: "Enter a recipient."
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

    player.cash -= amount;

    addTransaction(
        "CASH_TRANSFER",
        amount,
        `Cash given to ${recipientName}`,
        "out"
    );

    savePlayer();

    return {
        success: true,
        message:
            `You gave ${formatMoney(amount)} to ${recipientName}.`
    };
}
