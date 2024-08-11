const express = require("express");
const connection = require("./db");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

// Get user balance
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

app.post("/api/transfer", (req, res) => {
  const { recipientName, amount } = req.body;

  // Find the recipient by name
  connection.query(
    "SELECT id, balance FROM customers WHERE name = ?",
    [recipientName],
    (err, results) => {
      if (err) {
        res.status(500).send("Error querying the database");
        return;
      }

      if (results.length === 0) {
        res.status(404).send("Recipient not found");
        return;
      }

      const recipientId = results[0].id;
      const recipientBalance = results[0].balance;

      // Update the recipient's balance
      const newBalance = recipientBalance + parseFloat(amount);
      connection.query(
        "UPDATE customers SET balance = ? WHERE id = ?",
        [newBalance, recipientId],
        (err, results) => {
          if (err) {
            res.status(500).send("Error updating balance");
            return;
          }

          res.status(200).send("Transfer successful");
        }
      );
    }
  );
});

// Transfer funds
/*
app.post("/api/transfer", (req, res) => {
  const { recipientName, amount } = req.body;

  // Start transaction
  connection.beginTransaction((err) => {
    if (err) throw err;

    // Check user balance
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

        // Deduct from user balance
        connection.query(
          "UPDATE user_balance SET balance = balance - ? WHERE id = 1",
          [amount],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).send("Error updating user balance");
              });
            }

            // Add to customer balance
            connection.query(
              "UPDATE customers SET balance = balance + ? WHERE name = ?",
              [amount, recipientName],
              (err) => {
                if (err) {
                  return connection.rollback(() => {
                    res.status(500).send("Error updating customer balance");
                  });
                }

                // Insert transaction record
                connection.query(
                  "INSERT INTO transactions (name, amount) VALUES (?, ?)",
                  [recipientName, amount],
                  (err) => {
                    if (err) {
                      return connection.rollback(() => {
                        res.status(500).send("Error inserting transaction");
                      });
                    }

                    // Commit transaction
                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          res.status(500).send("Transaction failed");
                        });
                      }
                      res.send("Transfer successful");
                    });
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
*/

app.get("/api/transactions", (req, res) => {
  const query =
    "SELECT * FROM transactions ORDER BY transaction_date DESC LIMIT 10";
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving transactions");
      return;
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
