'use strict';


var NS = 'org.usecase.printer';

/**
 * Trasferring a Blueprint in return for cash
 * @param {org.usecase.printer.ConfirmTransaction} transferValues
 * @transaction
 */

function confirmTransaction(transferValues) {
        //update the cash values
        var cashSeller = transferValues.blueprintCopy.owner.cash
        var cashBuyer = transferValues.blueprintCopy.buyer.cash
        var price =  transferValues.blueprintCopy.blueprintMaster.price

        //Enduser doesn't have enough money to buy blueprint.
        if(cashBuyer.value < price) {
          throw new Error('Cannot buy asset. Not enough funds.');
        }
        
        cashBuyer.value = cashBuyer.value - price;
        cashSeller.value = cashSeller.value + price;
    
        //update blueprint attributes
        transferValues.blueprintCopy.owner = transferValues.blueprintCopy.buyer;
        transferValues.blueprintCopy.printed = true;
    
        return getAssetRegistry('org.usecase.printer.Cash')
            .then(function (assetRegistry) {
                return assetRegistry.updateAll([cashSeller, cashBuyer]);
            })                
            .then(function () {
                return  getAssetRegistry('org.usecase.printer.BlueprintCopy')
                .then(function (assetRegistry) {
                    return assetRegistry.update(transferValues.blueprintCopy);
                });            
            });     
        // TODO: Notification for Enduser?
    }

/**
 * Trasferring a Blueprint in return for cash
 * @param {org.usecase.printer.RequestBlueprint} buyingInfo
 * @transaction
 */

function requestBlueprint(buyingInfo) {
    // BlueprintCopy is created
    var blueprintCopy = getFactory().newResource(NS, 'BlueprintCopy', Math.random().toString(36).substring(3));
    blueprintCopy.printed = false
    blueprintCopy.printer = buyingInfo.printer
    blueprintCopy.buyer = buyingInfo.buyer
    blueprintCopy.blueprintMaster = buyingInfo.blueprintMaster
    blueprintCopy.owner = buyingInfo.blueprintMaster.owner

       
    // Create OTP encrypt it with Printer PubKey pubKeys and send to Printer
    // Create OTP encrypt it with Designer PubKey pubKeys and send it and the 3DPrinter PubKey and assetHash to Designer
    // Todo: Encrypt OTP!

    var otp =  Math.random().toString(36).substring(3);
    blueprintCopy.otpEncryptedWithDesignerPubKey = otp
    blueprintCopy.otpEncryptedWithPrinterPubKey = otp

    return getAssetRegistry(NS + '.BlueprintCopy')
    .then(function (assetRegistry) {
        return assetRegistry.add(blueprintCopy);
    });     
    
}

/**
 * Add new BlueprintMaster
 * @param {org.usecase.printer.AddNewBlueprintMaster} newBlueprintMaster - new product addition
 * @transaction
 */

function addNewBlueprintMaster(newBlueprintMaster) {
    var blueprintMaster = getFactory().newResource(NS, 'BlueprintMaster', newBlueprintMaster.blueprintCopyID);
    blueprintMaster.assetHash = newBlueprintMaster.assetHash
    blueprintMaster.price = newBlueprintMaster.price
    blueprintMaster.metadata = newBlueprintMaster.metadata
    blueprintMaster.owner = newBlueprintMaster.owner

    return getAssetRegistry(NS + '.BlueprintMaster')
    .then(function(assetRegistry) {
        return assetRegistry.add(blueprintMaster);
      });
}

