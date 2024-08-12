// Handle transfer form submission
document
  .getElementById("transferForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const recipientName = document.getElementById("recipientName").value;
    const amount = document.getElementById("amount").value;

    fetch("http://localhost:3000/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipientName, amount }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Transfer failed");
        }
        return response.text();
      })
      .then((message) => alert(message))
      .catch((error) => console.error("Error:", error));
  });

// Refresh balance and transactions

fetch("http://localhost:3000/api/user-balance")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("balance").textContent = `R ${data.balance}`;
  })
  .catch((error) => console.error("Error fetching user balance:", error));

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
/*fetch("http://localhost:3000/api/user-balance")
  .then((response) => response.json())
  .then((data) => {
    document.querySelector("#balance").innerText = `R ${data.balance}`;
  })
  .catch((error) => console.error("Error fetching user balance:", error));

// Handle transfer form submission

// Refresh balance and transactions
fetch("http://localhost:3000/api/transactions")
  .then((response) => response.json())
  .then((data) => {
    const transactionsList = document.querySelector("#transaction-list");
    transactionsList.innerHTML = ""; // Clear existing list
    data.forEach((transaction) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${transaction.transaction_date}: ${transaction.recipient} received R${transaction.amount}`;
      transactionsList.appendChild(listItem);
    });
  })
  .catch((error) => console.error("Error fetching transactions:", error));
*/
