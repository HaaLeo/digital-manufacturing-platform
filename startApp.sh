#!/bin/bash 

cd fabric-tools/
./startFabric.sh
./createPeerAdminCard.sh
cd ../dist

composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName printer-use-case

composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile printer-use-case.bna --file networkadmin.card

cd ../angular-app
ng serve --open