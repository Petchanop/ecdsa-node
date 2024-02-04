import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes,toHex } from "ethereum-cryptography/utils.js";

function Transfer({ address, privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    try {
      const hashMessage = keccak256(utf8ToBytes(message));
      const sig = secp256k1.sign(hashMessage, privateKey);
      const verify = secp256k1.verify(sig, hashMessage, address);
      if (verify) {
        const {
          data: { balance },
        } = await server.post(`send`, {
          sender: address,
          amount: parseInt(sendAmount),
          recipient,
          message,
        });
        setBalance(balance);
      }
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>
      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <label>
        Message
        <input
          placeholder="Type a message"
          value={message}
          onChange={setValue(setMessage)}
        ></input>
      </label>
      <input type="submit" className="button" value="Transfer"/>
    </form>
  );
}

export default Transfer;
