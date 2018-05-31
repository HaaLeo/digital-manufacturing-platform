const IOTA = require('./iota.lib.js');
const MAM = require('./mam');
const MerkleTree = require('./merkle');
const Encryption = require('./encryption');
var Crypto = require('./iota.crypto.js');
//var CryptoJS = require("./crypto-js");

 export default function sendToPrinter(encryptedFile, oneTimePassword) {
//encryptedFile is the JSON object retrieved from BCDB of the Copied Assets
//oneTimePassword is randomly generated for encrypting the copied assets

var iota = new IOTA({
    'host': 'http://localhost',
    'port': 14265,
});

//iota.api.getNodeInfo();
//iota.version

iota.api.getNodeInfo();
console.log(iota.api.getNodeInfo());

const seed = oneTimePassword;
const message = "hello";
const channelKeyIndex = 3;
const channelKey = Crypto.converter.trytes(Encryption.hash(Encryption.increment(Crypto.converter.trits(seed.slice()))));
const start = 3;
const count = 4;
const security = 1;

const tree0 = new MerkleTree(seed, start, count, security);
const tree1 = new MerkleTree(seed, start + count, count, security);
let index = 0;
console.log('butter');
// Get the trytes of the MAM transactions
const mam = MAM.create({
    message: iota.utils.toTrytes(message),
    merkleTree: tree0,
    index: index,
    nextRoot: tree1.root.hash.toString(),
    channelKey: channelKey
});


// Depth
const depth = 4;

// minWeighMagnitude
const minWeightMagnitude = 13;

console.log("Next Key: " + mam.nextKey);

// Send trytes
// iota.api.sendTrytes(mam.trytes, depth, minWeightMagnitude, (err, tx) => {
//   if (err)
//     console.log(err);
//   else
//     console.log(tx);
// });


return;

 }