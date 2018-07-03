
const app_id = '5bc2b153';
const app_key = 'cb78d7872622f4d0a2a2ec1cdf9eef21';
const driver = require('bigchaindb-driver');
//const API_PATH = 'https://test.bigchaindb.com/api/v1/';
const API_PATH =  'http://localhost:9984/api/v1/';
const assert = require('assert');

export async function postKeyToBcDB(key, description, ownerID) {


    //const API_PATH = 'http://78.47.44.213:8209/'


    const user = new driver.Ed25519Keypair()

    console.log('Public key ', user.publicKey)

    //Initialize the assetdata variable with the owner and key
    const assetdata = {
        'asset': {
            'owner': ownerID,
            'key': key // IPFS key
        }
    }

    const metadata = {
        'keyDescription': description,
        'owner': ownerID
    }

    // Construct a transaction payload
    const txCreateUserSimple = driver.Transaction.makeCreateTransaction(
        assetdata,
        metadata,

        // A transaction needs an output
        [driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(user.publicKey))
        ],
        user.publicKey
    )

    // Sign the transaction with private keys of user to fulfill it
    const txCreateSimpleSigned = driver.Transaction.signTransaction(txCreateUserSimple, user.privateKey)

    // Send the transaction off to BigchainDB
    if (!app_id || !app_key) {
        window.alert('Ensure you configured an bigchainDB app_id and app_key (ipfsKeyAssetBigchain.js)');
    }
    const conn = new driver.Connection(API_PATH, {
        app_id: app_id,
        app_key: app_key,
    })

    debugger;
    var retrievedTx = await conn.postTransactionCommit(txCreateSimpleSigned);
    console.log('Transaction', retrievedTx.id, 'successfully posted.');
    var queriedTx = await conn.getTransaction(txCreateSimpleSigned.id);
    console.log('Queried transaction: ', queriedTx);
    var assets = await conn.searchAssets(txCreateSimpleSigned.id);
    console.log('Found assets created by ', ownerID, ' ', assets);
    debugger;
    return retrievedTx.id;
}

export async function getAssetFromBcDB (txId) {
    if (!app_id || !app_key) {
        window.alert('Ensure you configured an bigchainDB app_id and app_key (ipfsKeyAssetBigchain.js)');
    }
    const conn = new driver.Connection(API_PATH, {
        app_id: app_id,
        app_key: app_key,
    })

    var assets = await conn.searchAssets(txId);
    console.log('Found assets: ', assets);
    assert.equal(assets.length, 1);
    debugger;
    return assets[0]
}
