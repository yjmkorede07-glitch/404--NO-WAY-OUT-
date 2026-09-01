document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePlayer();

        updateUI();
    }
);


function updateUI() {

    document.getElementById(
        "cashDisplay"
    ).textContent =
        formatMoney(player.cash);


    document.getElementById(
        "bankBalance"
    ).textContent =
        formatMoney(
            player.bank.balance
        );
}


function showPanel(html) {

    const panel =
        document.getElementById("panel");

    panel.innerHTML = html;

    panel.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top:
            document.body.scrollHeight,

        behavior: "smooth"
    });
}


function closePanel() {

    document
        .getElementById("panel")
        .classList.add("hidden");
}


/*
    ATM
*/

function openATM() {

    showPanel(`

        <h3>Veyron City Bank ATM</h3>

        <div class="notice">

            Account ending in:
            ${player.bank.accountNumber.slice(-4)}

            <br><br>

            Bank balance:
            <strong>
                ${formatMoney(
                    player.bank.balance
                )}
            </strong>

            <br>

            Cash:
            <strong>
                ${formatMoney(
                    player.cash
                )}
            </strong>

        </div>


        <label>Amount</label>

        <input
            id="atmAmount"
            type="number"
            min="1"
            placeholder="Enter amount"
        >


        <button onclick="handleWithdraw()">
            Withdraw Cash
        </button>


        <button onclick="handleDeposit()">
            Deposit Cash
        </button>


        <button onclick="closePanel()">
            Cancel
        </button>

    `);
}


function handleWithdraw() {

    const amount =
        document.getElementById(
            "atmAmount"
        ).value;


    const result =
        withdrawCash(amount);


    alert(result.message);


    updateUI();


    if (result.success) {

        openATM();
    }
}


function handleDeposit() {

    const amount =
        document.getElementById(
            "atmAmount"
        ).value;


    const result =
        depositCash(amount);


    alert(result.message);


    updateUI();


    if (result.success) {

        openATM();
    }
}


/*
    TRANSFERS
*/

function openTransfer() {

    const npcList =
        getNPCList();


    let options = "";


    npcList.forEach(npc => {

        options += `

            <option value="${npc.id}">
                ${npc.name}
            </option>

        `;
    });


    showPanel(`

        <h3>Transfer Money</h3>


        <label>Recipient</label>

        <select id="recipient">

            ${options}

        </select>


        <label>Amount</label>

        <input
            id="transferAmount"
            type="number"
            min="1"
            placeholder="Amount"
        >


        <button
            onclick="handleBankTransfer()"
        >
            Bank Transfer
        </button>


        <button
            onclick="handleCashTransfer()"
        >
            Give Cash In Person
        </button>


        <button
            onclick="closePanel()"
        >
            Cancel
        </button>

    `);
}


function handleBankTransfer() {

    const npcId =
        document.getElementById(
            "recipient"
        ).value;


    const amount =
        document.getElementById(
            "transferAmount"
        ).value;


    const result =
        transferToNPC(
            npcId,
            amount
        );


    alert(result.message);


    updateUI();


    if (result.success) {

        openTransfer();
    }
}


function handleCashTransfer() {

    const npcId =
        document.getElementById(
            "recipient"
        ).value;


    const amount =
        document.getElementById(
            "transferAmount"
        ).value;


    const result =
        transferCashToNPC(
            npcId,
            amount
        );


    alert(result.message);


    updateUI();


    if (result.success) {

        openTransfer();
    }
}


/*
    TRANSACTION HISTORY
*/

function openTransactions() {

    let html = `

        <h3>Transaction History</h3>

    `;


    if (
        player.transactions.length === 0
    ) {

        html += `
            <p>No transactions yet.</p>
        `;

    } else {

        player.transactions.forEach(
            transaction => {

                const sign =
                    transaction.direction === "in"
                        ? "+"
                        : "-";


                const amountClass =
                    transaction.direction === "in"
                        ? "amount-positive"
                        : "amount-negative";


                const date =
                    new Date(
                        transaction.date
                    ).toLocaleString();


                html += `

                    <div class="transaction">

                        <div class="transaction-title">

                            ${transaction.description}

                        </div>


                        <div class="transaction-info">

                            ${transaction.type}

                            <br>

                            ${date}

                        </div>


                        <div class="${amountClass}">

                            ${sign}${formatMoney(
                                transaction.amount
                            )}

                        </div>

                    </div>

                `;
            }
        );
    }


    html += `

        <button onclick="closePanel()">
            Close
        </button>

    `;


    showPanel(html);
}


/*
    RESET
*/

function resetGame() {

    const confirmed =
        confirm(
            "Reset the 404 test account?"
        );


    if (!confirmed) {
        return;
    }


    deleteSave();


    initializePlayer();


    updateUI();


    closePanel();
}
