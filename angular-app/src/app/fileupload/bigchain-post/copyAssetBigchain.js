import encryptor from './encryptor';
import sendToPrinter from './sendToPrinter';

export default function postToDB(dataPayload) {

const driver = require('bigchaindb-driver')

const API_PATH = 'http://localhost:9984/api/v1/'
//const API_PATH = 'http://78.47.44.213:8209/'

// Create a new keypair for Alice and Bob
const alice = new driver.Ed25519Keypair()
const bob = new driver.Ed25519Keypair()

console.log('Alice: ', alice.publicKey)
console.log('Bob: ', bob.publicKey)

var encryptedFileSeed = encryptor(dataPayload);
var encryptedFile = encryptedFileSeed[0]; //Assign File and Seed to individual variable
const seed = encryptedFileSeed[1];

//Initialize the assetdata variable with the model_creator default to Dian
const assetdata = {
        'model': {
                'model_creator': 'Dian Balta'
        }
}
assetdata.model.encrypted_model = encryptedFile; //Possibly need to change the input payload to BCDB

//assetdata.model.printed_model = dataPayload;

const metadata = {'model_description': 'chair'}

// Construct a transaction payload
const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
        assetdata,
        metadata,

        // A transaction needs an output
        [ driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(alice.publicKey))
        ],
        alice.publicKey
)

// Sign the transaction with private keys of Alice to fulfill it
const txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, alice.privateKey)

// Send the transaction off to BigchainDB
const conn = new driver.Connection(API_PATH)

var encryptedAsset = conn.postTransaction(txCreateAliceSimpleSigned)
        // Check status of transaction every 0.5 seconds until fulfilled
        .then(() => conn.pollStatusAndFetchTransaction(txCreateAliceSimpleSigned.id))
        //.then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
        
        .then(() => conn.getStatus(txCreateAliceSimpleSigned.id))
        //.then(status => console.log('Retrieved status method 2: ', status))
        .then(() => conn.searchAssets(txCreateAliceSimpleSigned.id))
        .then(function(assets){
               
               return assets;
               //asset_return = assets;
               //resolve(assets); 

        });

        

        encryptedAsset.then(function(returned){
                var encryptedAsset = returned[0].data.model.encrypted_model;
                sendToPrinter(encryptedAsset, seed);
        });


//console.log(encryptedAsset.result.0.data.model.id);
//sendToPrinter(encryptedAsset, seed);

return;
}