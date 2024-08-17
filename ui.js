// Handle transfer form submission
function updateBalanceAndTransactions() {
  fetch("http://localhost:3000/api/getBalanceAndTransactions")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch balance and transactions");
      }
      return response.json(); // Assuming the response is in JSON format
    })
    .then((data) => {
      // Update the balance
      document.getElementById("balance").textContent = `R ${data.balance}`;

      // Update the recent transactions
      const transactionsList = document.getElementById("transaction-list");
      transactionsList.innerHTML = ""; // Clear the current list

      data.transactions.forEach((transaction) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${transaction.date}: ${transaction.recipient} received R${transaction.amount}`;
        transactionsList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error:", error));
}

document
  .getElementById("transferForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const recipientName = document.getElementById("recipientName").value;
    const amount = document.getElementById("amount").value;

    fetch(
      "https://banking-system-git-master-mpilonhle-s-projects.vercel.app/api/transfer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipientName, amount }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Transfer failed");
        }
        return response.json(); // Assuming your server returns a JSON response
      })
      .then((data) => {
        // Update the Withdraw card
        const withdrawCard = document.querySelector("#withdraw .amount");
        const withdrawalAmount = -Math.abs(parseFloat(amount)); // Ensure the amount is negative
        withdrawCard.textContent = `R ${withdrawalAmount}`;

        alert(`Transfer successful! Last Withdrawal: ${data.lastWithdrawal}`); // Assuming your server sends a success message
        updateBalanceAndTransactions();
        window.location.reload(); // Refresh balance and transactions
      })
      .catch((error) => console.error("Error:", error));
  });

/* Show Withdraw Amount to Card*/
document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://banking-system-git-master-mpilonhle-s-projects.vercel.app/api/lastWithdrawal"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch last withdrawal");
      }
      return response.json();
    })
    .then((data) => {
      document.querySelector(
        "#withdraw .amount"
      ).textContent = `R ${data.lastWithdrawal}`;
    })
    .catch((error) => console.error("Error:", error));
});

/* Fetch the user balance and display on Balance Card*/
fetch(
  "https://banking-system-git-master-mpilonhle-s-projects.vercel.app/api/user-balance"
)
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("balance").textContent = `R ${data.balance}`;
  })
  .catch((error) => console.error("Error fetching user balance:", error));

/* Transaction list and show only 5 */
fetch(
  "https://banking-system-git-master-mpilonhle-s-projects.vercel.app/api/transactions"
)
  .then((response) => response.json())
  .then((data) => {
    const transactionsList = document.querySelector("#transaction-list");
    transactionsList.innerHTML = ""; // Clear existing list

    // Limit to the most recent 5 transactions
    const limitedData = data.slice(0, 5);

    limitedData.forEach((transaction) => {
      const listItem = document.createElement("li");

      const dateSpan = document.createElement("span");
      dateSpan.className = "transaction-date";
      dateSpan.textContent = new Date(
        transaction.transaction_date
      ).toLocaleString();

      const detailsSpan = document.createElement("span");
      detailsSpan.className = "transaction-details";
      detailsSpan.textContent = `${transaction.recipient} received R${transaction.amount}`;

      listItem.appendChild(dateSpan);
      listItem.appendChild(detailsSpan);
      transactionsList.appendChild(listItem);
    });
  })
  .catch((error) =>
    console.error("Error fetching updated transactions:", error)
  );
/*
fetch("http://localhost:3000/api/transactions")
  .then((response) => response.json())
  .then((data) => {
    const transactionsList = document.querySelector("#transaction-list");
    transactionsList.innerHTML = ""; // Clear existing list

    // Limit to 5 transactions
    const limitedData = data.slice(0, 5);

    limitedData.forEach((transaction) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${transaction.transaction_date}: ${transaction.recipient} received R${transaction.amount}`;
      transactionsList.appendChild(listItem);
    });
  })
  .catch((error) => console.error("Error fetching transactions:", error));
*/

setInterval(updateBalanceAndTransactions, 30000);
