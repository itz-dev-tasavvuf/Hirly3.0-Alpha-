require('dotenv').config();
const algosdk = require('algosdk');

// Algorand TestNet client
const algodToken = '';
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = '';
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Central (Pera) wallet mnemonic from env
const mnemonic = process.env.ALGOD_MNEMONIC;
if (!mnemonic) throw new Error('ALGOD_MNEMONIC not set in environment!');
const centralAccount = algosdk.mnemonicToSecretKey(mnemonic);

async function sendVerificationTx(userIdentifier) {
  const params = await algodClient.getTransactionParams().do();
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: centralAccount.addr,
    to: centralAccount.addr,
    amount: 1000, // 0.001 ALGO
    note: new Uint8Array(Buffer.from(`hirly-verify:${userIdentifier}`)),
    suggestedParams: params,
  });
  const signedTxn = txn.signTxn(centralAccount.sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  await waitForConfirmation(algodClient, txId);
  return txId;
}

async function waitForConfirmation(client, txId) {
  let response = await client.status().do();
  let lastRound = response['last-round'];
  while (true) {
    const pendingInfo = await client.pendingTransactionInformation(txId).do();
    if (pendingInfo['confirmed-round'] && pendingInfo['confirmed-round'] > 0) {
      break;
    }
    lastRound++;
    await client.statusAfterBlock(lastRound).do();
  }
}

// Example usage
if (require.main === module) {
  // node index.js testuser@email.com
  const userId = process.argv[2] || `testuser-${Date.now()}@example.com`;
  sendVerificationTx(userId)
    .then(txId => {
      console.log('Verification transaction sent! TxID:', txId);
      process.exit(0);
    })
    .catch(err => {
      console.error('Error sending verification tx:', err);
      process.exit(1);
    });
}
