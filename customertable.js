fetch("https://banking-system-eta.vercel.app/api/customers")
  .then((response) => response.json())
  .then((data) => {
    const tableBody = document.querySelector("#customerTable tbody");
    data.forEach((customer) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.country}</td>
                <td>${customer.bank}</td>
                <td>${customer.Balance}</td>
                <td>${customer.transferButton}</td>
            `;
      tableBody.appendChild(row);
    });
  })
  .catch((error) => console.error("Error fetching customer data:", error));
