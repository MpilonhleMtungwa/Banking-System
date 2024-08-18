function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
}

/* form popup */
function openTransferForm(customerName) {
  document.getElementById("transferForm").style.display = "block";
  document.getElementById("customerName").innerText =
    "Transfer Funds for " + customerName;
}

function closeTransferForm() {
  document.getElementById("transferForm").style.display = "none";
}

//Table function//
function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("customerTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, hide who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

fetch("https://banking-system-neon-two.vercel.app/api/customers")
  .then((response) => response.json())
  .then((data) => {
    const datalist = document.querySelector("#recipients");
    data.forEach((customer) => {
      const option = document.createElement("option");
      option.value = customer.name; // Use customer name for the value
      datalist.appendChild(option);
    });
  })
  .catch((error) => console.error("Error fetching customer names:", error));

function openTransferForm(customerName) {
  document.getElementById(
    "customerName"
  ).textContent = `Transfer Funds for ${customerName}`;
  document.getElementById("transferForm").style.display = "block";
}

// Function to close the transfer form
function closeTransferForm() {
  document.getElementById("transferForm").style.display = "none";
}

// Form submission event listener
document
  .querySelector(".form-container")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const customerName = document
      .getElementById("customerName")
      .textContent.split(" for ")[1];
    const amount = document.querySelector("input[name='amount']").value;

    fetch("https://banking-system-neon-two.vercel.app/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipientName: customerName, amount: amount }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Transfer failed");
        }
        return response.text();
      })
      .then((message) => {
        alert(message);

        // Refresh balance and transactions
        fetch("https://banking-system-neon-two.vercel.app/api/user-balance")
          .then((response) => response.json())
          .then((data) => {
            document.getElementById(
              "balance"
            ).textContent = `R ${data.balance}`;
          })
          .catch((error) =>
            console.error("Error fetching user balance:", error)
          );

        fetch("https://banking-system-neon-two.vercel.app/api/transactions")
          .then((response) => response.json())
          .then((data) => {
            const transactionsList =
              document.querySelector("#transaction-list");
            transactionsList.innerHTML = ""; // Clear existing list
            const limitedData = data.slice(0, 5); // Show only the last 5 transactions
            limitedData.forEach((transaction) => {
              const listItem = document.createElement("li");
              listItem.textContent = `${transaction.transaction_date}: ${transaction.recipient} received R${transaction.amount}`;
              transactionsList.appendChild(listItem);
            });
          })
          .catch((error) =>
            console.error("Error fetching transactions:", error)
          );

        // Close the pop-up form
        closeTransferForm();
      })
      .catch((error) => console.error("Error:", error));
  });

/*
document
  .getElementById("transferForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const recipientName = document.getElementById("recipientName").value;
    const amount = document.getElementById("amount").value;

    fetch("https://banking-system-neon-two.vercel.app/api/transfer", {
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
*/
/*
function openForm(name) {
  // Logic to open the pop-up form and populate it with the relevant data
  alert(`Transfer funds to ${name}`); // Replace this with your actual pop-up logic
}
*/

//balance funds//
/*
document
  .getElementById("transferButton")
  .addEventListener("click", function () {
    // Get the current balance
    let balanceElement = document.getElementById("balanceAmount");
    let currentBalance = parseFloat(balanceElement.textContent);

    // Get the amount to transfer
    let transferAmount = parseFloat(
      document.getElementById("transferAmount").value
    );

    // Add the transfer amount to the balance
    if (!isNaN(transferAmount) && transferAmount > 0) {
      let newBalance = currentBalance + transferAmount;

      // Update the balance display
      balanceElement.textContent = newBalance.toFixed(2);
    } else {
      alert("Please enter a valid amount");
    }
  });
*/
