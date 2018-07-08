#!/bin/bash

docker rmi $(docker images dev-* -q) -f

export FABRIC_VERSION=hlfv11

cd fabric-tools/
./startFabric.sh
./createPeerAdminCard.sh

cd ../
#create dir dist if it doesn't exist
mkdir -p dist

composer archive create -a dist/printer-use-case.bna --sourceType dir --sourceName .

cd dist

composer network install --card PeerAdmin@hlfv1 --archiveFile printer-use-case.bna

composer network start --networkName printer-use-case --networkVersion 0.0.1 --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --file networkadmin.card

composer card import --file networkadmin.card

cd ../angular-app
ng serve --open

cd ../mongoserver
node mongoAPI.js
