import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { utf8ToBytes,toHex } from "ethereum-cryptography/utils.js";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if (privateKey) {
      const publicKey = secp256k1.getPublicKey(privateKey);
      const address = toHex(publicKey);
      setAddress(address);
      if (address) {
        try {
          const {
            data: { balance },
          } = await server.get(`balance/${privateKey}`);
          setBalance(balance);
        } catch (ex) {
          alert(ex.response.data.message);
        }
    }
    else {
      setBalance(0);
    }
  }
}

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private Key
        <input placeholder="Type a privateKey, for example 42d0bb555xxx" value={privateKey} onChange={onChange}></input>
      </label>
      <label>
        Wallet Address
        <div className="box">{address}...</div>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
