const Account = require("./Account");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

console.log(Account.Accounts);

app.get("/balance/:privateKey", (req, res) => {
  const { privateKey } = req.params;
  const account = Account.findAccount(privateKey);
  const balance = account.getBalance() || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount , message} = req.body;
  const msgHash = Account.hashMessage(message);
  console.log(msgHash);
  recipientAccount = Account.findAccount(recipient);
  console.log(recipientAccount);
  const { r, s, recovery } = recipientAccount.signMessage(msgHash);
  console.log(r)
  console.log(s)
  console.log(recovery)

  // const recipientAccount = Account.findAccount(recipient);
  // if (!recipientAccount) {
  //   res.status(400).send({ message: "Recipient not found!" });
  // }
  // if (senderAccount.getBalance() < amount) {
  //   res.status(400).send({ message: "Not enough funds!" });
  // } else {
  //   senderAccount.updateBalance("send", amount);
  //   recipientAccount.updateBalance("receive", amount);
    // res.send({ balance: senderAccount.getBalance() });
  // }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
