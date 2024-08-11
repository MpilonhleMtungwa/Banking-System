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
