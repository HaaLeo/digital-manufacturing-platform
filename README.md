# 3DPrinter using Hyperledger Composer

A Blockchain application using Hyperledger Composer and BigchainDB for buying and printing 3D Printer models.

The idea is that designers upload their original models and set the price for each model. These models are avaliable to the end-users for 3D printing. The end-users select which models they want to print and pay the cost. The designers upload a copy of the already bought models and the printers print the 3D objects and transfer the money to the corresponding model creators.

## Running the Application

Follow these steps to setup and run the application:

### Prerequisite

* [Docker](https://www.docker.com/)
*	[npm](https://www.npmjs.com/)
*	[Node](https://nodejs.org/en/)
* [Hyperledger Composer](https://hyperledger.github.io/composer/latest/installing/development-tools.html)
	* to install composer cli `npm install -g composer-cli`
	*	to install composer-rest-server `npm install -g composer-rest-server`


### Steps

1. 	[Clone the repo](#1-clone-the-repo)
	* [Quick Run](#quick-run)
2.	[Setup Fabric](#2-setup-fabric)
3.	[Generate the Business Network Archive](#3-generate-the-business-network-archive)
4.	[Deploy to Fabric](#4-deploy-to-fabric)
5.	[Set up PGP keys](#5-set-up-pgp-keys)
6.	[Run the Application](#6-run-the-application)
7.	[Generate a REST Server](#7-generate-a-rest-server)
8.	[Set Up Local BCDB Node](#8-set-up-local-bcdb-node)
9.	[Install and run IPFS](#9-install-and-run-ipfs)
10.	[Install and run MongoDB](#10-install-and-run-mongodb)
11.	[Stop Fabric](#11-stop-fabric)
12.	[Additional Resources](#12-additional-resources)
13.	[Usage](#13-usage)

### 1. Clone the repo

Clone the `3DPrinter-Composer` code locally. In a terminal, run:


`git clone https://git.fortiss.org/nieves/3DPrinter-Composer.git`

#### Quick Run

There is a bash script `startApp.sh` that executes all the necessary steps in order to run the application.

Inside the `root` directory run:
```
./startApp.sh
```

To stop the fabric run:
```
./stop.sh
```

These steps are described in detail below.


NOTE: The application is using the single BigchainDB node running at the fortiss network at the following IP and port: http://78.47.44.213:8209

### 2. Setup Fabric

Remove all previously created Hyperledger Fabric chaincode images:

`docker rmi $(docker images dev-* -q)`


Set Hyperledger Fabric version to v1.0:

`export FABRIC_VERSION=hlfv1`

All the necessary scripts are in the directory `/fabric-tools`. Start fabric and create peer admin card:

```
cd fabric-tools/
./downloadFabric.sh
./startFabric.sh
./createPeerAdminCard.sh
```

### 3. Generate the Business Network Archive

Generate the Business Network Archive (BNA) file from the `root` directory:

```
cd ../
mkdir dist
composer archive create -a dist/printer-use-case.bna --sourceType dir --sourceName .
```

The `composer archive create` command will created a file called `printer-use-case.bna` in the `dist` folder.


### 4. Deploy to Fabric


First, install the composer runtime on the peer:

```
cd dist/
composer network install --card PeerAdmin@hlfv1 --archiveFile printer-use-case.bna
```

Deploy the business network on the peer and create a new participant, identity and an associated card for the network adminstrator:
```
composer network start --networkName printer-use-case --networkVersion 0.0.1 --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --file networkadmin.card
```

Import the network administrator identity card:
```
composer card import --file networkadmin.card
```

Ping the network to check that the business network has been deployed successfully:

```
composer network ping --card admin@printer-use-case
```

### 5. Set up PGP keys

First, install GPG. On Ubuntu/Debian, use the following command:

```
apt-get install gnupg
```

If you are on a mac, use Brew to install GPG:

```
brew install gnupg
```

The Analyst, End User, Manufacturer, and Printer all need PGP keys. Generate four keys using the following command. For simplicity, use the same passphrase for each keypair, and name each of the keypairs according to their use.

```
gpg --gen-key
```

Now export the public and private keys of each of the generated PGP keypairs, where "User Name" is the name you gave the PGP key.

```
gpg --export -a "User Name" > public.key
gpg --export-secret-key -a "User Name" > private.key
```

As the private keys for the entities are used in the application, you will need to go through several of the files and put the private keys in them. They are placed in the 'service' files. You can find the private key locations below. Ensure you copy the whole private key, including the header and footer.

* Printer private key - angular-app/src/app/BuyAssetTR/BuyAssetTR.service.ts
* End User private key - angular-app/src/app/EvaluationResult/EvaluationResult.service.ts
* Manufacturer private key - angular-app/src/app/QualityReportRaw/QualityReportRaw.service.ts

When creating the entities in the application, use the public keys from the generated PGP keys.

Finally, update the 'passphrase' variable in angular-app/src/app/fileupload/fileupload.component.ts

### 6. Run the Application

First, inside the `angular-app` directory install the dependencies:

```
cd ../angular-app
npm install
```


To start the application run:
```
npm start
```

NOTE: The application is now running at: http://localhost:4200
We are using the single BigchainDB node running at the fortiss network at the following IP and port: http://78.47.44.213:8209

### 7. Generate a REST server

The application needs a REST server in order to communicate with the network. The generated API is connected to the blockchain and the business network.

1.	To start the REST server run:
```
composer-rest-server
```

2.	Enter `admin@printer-use-case` as the card name.

3.	Select **Always use namespaces** when asked whether to use namespaces in the generated API.

4.	Select **No** when asked whether to secure the generated API.

5.	Select **Yes** when asked whether to enable event publication.

6.	Select **No** when asked whether to enable TLS security.

The REST server is available at: `http://localhost:3000/explorer/`

### 8. Set Up Local BCDB Node

1. Clone the BCDB github
```
git clone https://github.com/bigchaindb/bigchaindb.git
```

2. Open the 'bigchaindb' folder. Install BCDB
```
make run
```

3. You can start and stop BCDB in the future by entering the following in the BCDB directory:
```
make start
make stop
```

### 9. Install and run IPFS

1. Follow these instructions to install IPFS https://ipfs.io/docs/install/

2. Initialise IPFS
```
ipfs init
```

3. Start IPFS node
```
ipfs daemon
```

### 10. Install and run MongoDB

1. Follow these instructions to install MongoDB depending on your Operating System https://docs.mongodb.com/manual/administration/install-community/

2. After you have installed MongoDB and set up the data directory, run MongoDB
```
mongod
```

### 11. Stop Fabric

To stop the fabric, run the following commands inside the `fabric-tools` directory:

```
./stopFabric.sh
./teardownFabric.sh
```


### 12. Additional resources

*	[Hyperledger Composer Docs](https://hyperledger.github.io/composer/latest/introduction/introduction.html)
*   @Tasos, please Refer to the video I sent you the link to on Jul 28, 2018 for a video documentation on how to start the application.
*   Please find the keys for printer, manufacturer and enduser in the same folder:
*   https://drive.google.com/drive/folders/11ssyeta3TSkieHlnTP6ostBVsKvB9y60
*   The qualityRequirement has to be of the following structure:

```
{
    "peakPressure": <integer>,
    "peakTemperature": <integer>
}
```

* an example of a valid quality requirement can be found in the drive folder as well

### 13. Usage

* For usage examples please refer to the final presentation and the demo video (both available in the drive folder as well.)

