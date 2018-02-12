# 3DPrinter using Hyperledger Composer

Follow these steps to setup and run the application:

### Prerequisites

* Docker
*	npm 
*	Node 
* Hyperledger Composer
	* to install composer cli `npm install -g composer-cli`
	*	to install composer-rest-server `npm install -g composer-rest-server`


### Steps

1. [Clone the repo](#1-clone-the-repo)
2.	[Setup Fabric](#2-setup-fabric)
3.	[Generate the Business Network Archive](#3-generate-the-business-network-archive)
4.	[Deploy to Fabric](#4-deploy-to-fabric)
5.	[Run the Application](#5-run-the-application)
6.	[Create Participants](#6-create-participants)
7.	[Execute Transactions](#7-execute-transaction)

### 1. Clone the repo

Clone the ```3DPrinter-Composer``` code locally. In a terminal, run:


`git clone https://git.fortiss.org/nieves/3DPrinter-Composer.git`




### 2.	Setup Fabric
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

### 3.	Generate the Business Network Archive

Generate the Business Network Archive (BNA) file from the **root** directory:

```
cd ../
mkdir dist
composer archive create -a dist/printer-use-case.bna --sourceType dir --sourceName .
```

The `composer archive create` command will created a file called `printer-use-case.bna` in the `dist` folder.



### 4.	Deploy to Fabric

### 5.	Run the Application