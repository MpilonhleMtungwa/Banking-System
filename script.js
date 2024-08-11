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

  // Loop through all table rows, and hide those who don't match the search query
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

fetch("http://localhost:3000/api/customers")
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
