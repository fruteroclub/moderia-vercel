"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecallClient = createRecallClient;
var chains_1 = require("@recallnet/chains");
var client_1 = require("@recallnet/sdk/client");
var viem_1 = require("viem");
var accounts_1 = require("viem/accounts");
var viem_2 = require("viem");
// Create a wallet client from a private key
function createRecallClient() {
    var privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    var walletClient = (0, viem_1.createWalletClient)({
        account: (0, accounts_1.privateKeyToAccount)(privateKey),
        chain: chains_1.testnet,
        transport: (0, viem_2.http)(),
    });
    var client = new client_1.RecallClient({ walletClient: walletClient });
    return client;
}
