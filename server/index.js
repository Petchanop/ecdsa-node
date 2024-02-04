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
  const senderAccount = Account.findAccount(sender);
  const recipientAccount = Account.findAccount(recipient);
  if (!senderAccount || !recipientAccount) {
    res.status(400).send({ message: "Invalid sender or recipient!" });
  }
  const msgHash = recipientAccount.hashMessage(message);
  const signature = recipientAccount.signMessage(msgHash);
  const isVerfy = recipientAccount.isVerify(signature, msgHash, recipient);
  if (isVerfy) {
    if (senderAccount.getBalance() < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      senderAccount.updateBalance("send", amount);
      recipientAccount.updateBalance("receive", amount);
      let msg = "You have transferred " + amount + " to " + recipientAccount.getName();
      res.status(200).send({ balance: senderAccount.getBalance() });
    }
  }
  else {
    res.status(400).send({ message: "Invalid signature!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
