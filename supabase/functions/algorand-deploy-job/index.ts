import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import algosdk from "https://esm.sh/algosdk@2.7.0";

// Inline your TEAL code here
const approvalTeal = `#pragma version 6
txn ApplicationID
int 0
==
bnz main_l4
txn OnCompletion
int DeleteApplication
==
bnz main_l3
err
main_l3:
txn TypeEnum
int appl
==
global LatestTimestamp
byte "exp"
app_global_get
>
&&
return
main_l4:
byte "title"
txna ApplicationArgs 0
app_global_put
byte "name"
txna ApplicationArgs 0
app_global_put
byte "desc"
txna ApplicationArgs 1
app_global_put
byte "company"
txna ApplicationArgs 2
app_global_put
byte "exp"
txna ApplicationArgs 3
btoi
app_global_put
int 1
return
`;
const clearTeal = `#pragma version 6
int 1
return
`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};

function toUint8Array(str) {
  return new TextEncoder().encode(str);
}
function uint64ToBigEndian(val) {
  const arr = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    arr[i] = val & 0xff;
    val >>= 8;
  }
  return arr;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, description, company = "", expiration } = await req.json();
    if (!title || !description || !expiration) {
      return new Response(JSON.stringify({ error: "Missing job info (title, description, expiration)" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Algorand setup
    const algodToken = "";
    const algodServer = "https://testnet-api.algonode.cloud";
    const algodPort = "";
    const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    // Get mnemonic from environment
    const mnemonic = Deno.env.get("ALGOD_MNEMONIC");
    if (!mnemonic) throw new Error("ALGOD_MNEMONIC not set in environment!");
    const centralAccount = algosdk.mnemonicToSecretKey(mnemonic);

    // 2. Compile TEAL to bytecode
    const approvalResp = await algodClient.compile(approvalTeal).do();
    const clearResp = await algodClient.compile(clearTeal).do();
    const approvalProg = Uint8Array.from(atob(approvalResp.result), c => c.charCodeAt(0));
    const clearProg = Uint8Array.from(atob(clearResp.result), c => c.charCodeAt(0));

    // 3. Prepare app create transaction
    const params = await algodClient.getTransactionParams().do();
    const appArgs = [
      toUint8Array(title),
      toUint8Array(description),
      toUint8Array(company),
      uint64ToBigEndian(Number(expiration))
    ];

    const txn = algosdk.makeApplicationCreateTxnFromObject({
      from: centralAccount.addr,
      approvalProgram: approvalProg,
      clearProgram: clearProg,
      suggestedParams: params,
      numGlobalInts: 1,
      numGlobalByteSlices: 4,
      numLocalInts: 0,
      numLocalByteSlices: 0,
      appArgs
    });

    // 4. Sign and send
    const signedTxn = txn.signTxn(centralAccount.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

    // 5. Wait for confirmation
    let confirmed = false;
    let round = params.firstRoundValid || (await algodClient.status().do())["last-round"] || 1;
    let appId = null;
    while (!confirmed) {
      const pending = await algodClient.pendingTransactionInformation(txId).do();
      if (pending["confirmed-round"] && pending["confirmed-round"] > 0) {
        confirmed = true;
        appId = pending["application-index"];
        break;
      }
      round++;
      await algodClient.statusAfterBlock(round).do();
    }

    // 6. Respond with appId and txId
    return new Response(JSON.stringify({ appId, txId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
