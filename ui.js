fetch("http://localhost:3000/api/user-balance")
  .then((response) => response.json())
  .then((data) => {
    document.querySelector("#balance").innerText = `R ${data.balance}`;
  })
  .catch((error) => console.error("Error fetching user balance:", error));

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
function updateUserBalance() {
  fetch("http://localhost:3000/api/user-balance")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("balanceCard").textContent = `R ${data.balance}`;
    })
    .catch((error) => console.error("Error fetching user balance:", error));
}

updateUserBalance();
