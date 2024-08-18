const express = require("express");
const connection = require("../db");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Fetch user balance
app.get("/api/user-balance", (req, res) => {
  connection.query(
    "SELECT balance FROM user_balance WHERE id = 1",
    (err, results) => {
      if (err) {
        res.status(500).send("Error fetching user balance");
        return;
      }
      res.json(results[0]);
    }
  );
});

app.get("/api/customers", (req, res) => {
  connection.query("SELECT * FROM customers", (err, results) => {
    if (err) {
      res.status(500).send("Error querying the database");
      return;
    }

    // Add the Transfer button to each customer
    results.forEach((customer) => {
      customer.transferButton = `<button onclick="openTransferForm('${customer.name}')">Transfer</button>`;
    });

    res.json(results);
  });
});

app.post("/api/transfer", (req, res) => {
  const { recipientName, amount } = req.body;

  connection.beginTransaction((err) => {
    if (err) throw err;

    connection.query(
      "SELECT balance FROM user_balance WHERE id = 1",
      (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).send("Error fetching user balance");
          });
        }

        const userBalance = results[0].balance;

        if (userBalance < amount) {
          return connection.rollback(() => {
            res.status(400).send("Insufficient funds");
          });
        }

        connection.query(
          "UPDATE user_balance SET balance = balance - ?, last_withdrawal = ? WHERE id = 1",
          [amount, -amount],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).send("Error updating user balance");
              });
            }

            connection.query(
              "SELECT id, balance FROM customers WHERE name = ?",
              [recipientName],
              (err, results) => {
                if (err) {
                  return connection.rollback(() => {
                    res.status(500).send("Error querying the database");
                  });
                }

                if (results.length === 0) {
                  return connection.rollback(() => {
                    res.status(404).send("Recipient not found");
                  });
                }

                const recipientId = results[0].id;
                const newBalance = results[0].balance + parseFloat(amount);

                connection.query(
                  "UPDATE customers SET balance = ? WHERE id = ?",
                  [newBalance, recipientId],
                  (err) => {
                    if (err) {
                      return connection.rollback(() => {
                        res.status(500).send("Error updating customer balance");
                      });
                    }

                    connection.query(
                      "INSERT INTO transactions (customer_id, recipient, amount) VALUES (?, ?, ?)",
                      [recipientId, recipientName, amount],
                      (err) => {
                        if (err) {
                          return connection.rollback(() => {
                            res.status(500).send("Error inserting transaction");
                          });
                        }

                        connection.commit((err) => {
                          if (err) {
                            return connection.rollback(() => {
                              res.status(500).send("Transaction failed");
                            });
                          }

                          // Return the last withdrawal amount
                          res.json({ success: true, lastWithdrawal: -amount });
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

app.get("/api/lastWithdrawal", (req, res) => {
  connection.query(
    "SELECT last_withdrawal FROM user_balance WHERE id = 1",
    (err, results) => {
      if (err) {
        return res.status(500).send("Error fetching last withdrawal");
      }

      res.json({ lastWithdrawal: results[0].last_withdrawal });
    }
  );
});

app.get("/api/getBalanceAndTransactions", (req, res) => {
  // Fetch the balance
  connection.query(
    "SELECT balance FROM user_balance WHERE id = 1",
    (err, balanceResults) => {
      if (err) {
        return res.status(500).send("Error fetching balance");
      }
      const balance = balanceResults[0].balance;

      // Fetch recent transactions
      connection.query(
        "SELECT * FROM transactions ORDER BY date DESC LIMIT 5",
        (err, transactionResults) => {
          if (err) {
            return res.status(500).send("Error fetching transactions");
          }

          res.json({
            balance: balance,
            transactions: transactionResults, // Send the recent transactions
          });
        }
      );
    }
  );
});

// Fetch recent transactions
app.get("/api/transactions", (req, res) => {
  connection.query(
    "SELECT * FROM transactions ORDER BY transaction_date DESC LIMIT 10",
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send("Error querying the database for recent transactions");
        return;
      }
      res.json(results);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
