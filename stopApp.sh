#!/bin/bash 

composer card delete --card admin@printer-use-case

cd fabric-tools
./stopFabric.sh
./teardownFabric.sh