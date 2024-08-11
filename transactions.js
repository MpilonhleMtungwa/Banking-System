app.post("/api/transfer", (req, res) => {
  const { customerId, recipient, amount } = req.body;

  // Update the customer's balance
  const updateBalanceQuery = `
      UPDATE customers SET Balance = Balance - ? WHERE id = ?;
    `;

  // Insert the transaction into the transactions table
  const insertTransactionQuery = `
      INSERT INTO transactions (customer_id, recipient, amount)
      VALUES (?, ?, ?);
    `;

  connection.query(updateBalanceQuery, [amount, customerId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Transfer failed", error: err });
    }

    connection.query(
      insertTransactionQuery,
      [customerId, recipient, amount],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to log transaction", error: err });
        }
        res.status(200).json({ message: "Transfer successful and logged" });
      }
    );
  });
});
