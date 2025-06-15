require('dotenv').config();
const express = require('express');
const cors = require('cors');
const algosdk = require('algosdk');

const app = express();
app.use(express.json());
app.use(cors());

const algodToken = '';
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = '';
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const mnemonic = process.env.ALGOD_MNEMONIC;
if (!mnemonic) throw new Error('ALGOD_MNEMONIC not set in environment!');
const centralAccount = algosdk.mnemonicToSecretKey(mnemonic);

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) : str;
}

app.post('/api/algorand/verify', async (req, res) => {
  try {
    // Hash and salt all user data before storing on-chain
    // Only the hash, salt, and verifiedAt are stored in the note (no raw PII)
    const crypto = require('crypto');
    const { fullName = '', email = '', role = '', company = '', extra = '' } = req.body;
    const salt = crypto.randomBytes(16).toString('hex');
    const dataToHash = `${fullName}|${email}|${role}|${company}|${extra}|${salt}`;
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
    const noteObj = { hash, salt, verifiedAt: new Date().toISOString() };
    let noteStr = JSON.stringify(noteObj);
    // Algorand note field max is 1000 bytes; truncate if needed
    noteStr = truncate(noteStr, 950);
    const params = await algodClient.getTransactionParams().do();
    console.log('Algod params:', params);
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: centralAccount.addr,
      to: centralAccount.addr,
      amount: 1000,
      note: new Uint8Array(Buffer.from(noteStr)),
      suggestedParams: params,
    });
    const signedTxn = txn.signTxn(centralAccount.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    // Wait for confirmation
    let confirmed = false;
    let round = (params.firstRoundValid || params['firstRoundValid'] || params['firstRound'] || params['lastRound'] || 0);
    if (typeof round !== 'number' || isNaN(round) || round === 0) {
      round = (await algodClient.status().do())['last-round'] || 1;
    }
    console.log('Initial round:', round);
    while (!confirmed) {
      const pending = await algodClient.pendingTransactionInformation(txId).do();
      if (pending['confirmed-round'] && pending['confirmed-round'] > 0) {
        confirmed = true;
        break;
      }
      round++;
      await algodClient.statusAfterBlock(round).do();
    }
    res.json({ txId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Algorand verification server running on port ${PORT}`);
});
