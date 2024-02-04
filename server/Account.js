const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils"); 

class Account {

	constructor(name, balance, privateKey) {
		this.privateKey = privateKey;
		this.address = toHex(secp256k1.getPublicKey(this.privateKey));
		this.name = name;
		this.balance = balance;
  }

  getName() {
	return this.name;
  }

  getBalance() {
    return this.balance;
  }

  updateBalance(type, amount) {
    if (type === "send") {
      this.balance -= amount;
    } else if (type === "receive") {
      this.balance += amount;
    }
  }

  getAddress() {
	return this.address;
  }

  hashMessage(message) {
	const bytes = utf8ToBytes(message);
    return keccak256(bytes);
  }

  signMessage(msg){
	return secp256k1.sign(msg, this.privateKey);
  }

  isVerify(signature, message, publicKey) {
	return secp256k1.verify(signature, message, publicKey);
  }

  recoverKey(message, signature, recoveryBit) {
    return secp.recoverPublicKey(hashMessage(message) , signature, recoveryBit)
}
}

Accounts = []

JohnPrivateKey = toHex(secp256k1.utils.randomPrivateKey());
jackPrivateKey = toHex(secp256k1.utils.randomPrivateKey());
JillPrivateKey = toHex(secp256k1.utils.randomPrivateKey());
const john = new Account("john", 100, JohnPrivateKey);
const jack = new Account("jack", 75, jackPrivateKey);
const jill = new Account("jill", 50, JillPrivateKey);


Accounts.push(john);
Accounts.push(jack);
Accounts.push(jill);

function findAccount(privateKey) {
  return Accounts.find(((account) => account.privateKey === privateKey)) || Accounts.find(((account) => account.address === privateKey));
}

module.exports = { Account, Accounts, findAccount };
