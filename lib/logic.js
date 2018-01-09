'use strict';

/**
 * Trasferring a Blueprint in return for cash
 * @param {org.usecase.printer.CashforBlueprintTransfer} UpdateValues
 * @transaction
 */


function executeTransfer(UpdateValues) {
    
        //update the cash values
        UpdateValues.cashInc.value = UpdateValues.cashInc.value + UpdateValues.blueprintCopy.blueprintMaster.price;
        UpdateValues.cashDec.value = UpdateValues.cashDec.value - UpdateValues.blueprintCopy.blueprintMaster.price;
    
        //update blueprint attributes
        UpdateValues.BlueprintCopy.owner = UpdateValues.printer;
        UpdateValues.BlueprintCopy.printed = true;
    
        return getAssetRegistry('org.usecase.printer.Cash')
            .then(function (assetRegistry) {
                return assetRegistry.updateAll([UpdateValues.cashInc,UpdateValues.cashDec]);
            })                
            .then(function () {
                return  getAssetRegistry('org.usecase.printer.BlueprintCopy')
                .then(function (assetRegistry) {
                    return assetRegistry.update(UpdateValues.blueprintCopy);
                });            
            });     
    
        // TODO: Notification for Enduser?
    }

/*
function initTransfer(UpdateValues) {
    // Create Copy of BlueprintMaster and write to Ledger
    // Will be triggered by Dapp :
    // 1. BlueprintCopy is created
    // 2. TransactionData is created and BlueprintCopy is assigned to it
    // 3. initTransfer is called
    
       
    // Create OTP encrypt it with Printer PubKey pubKeys and send to Printer
    // Create OTP encrypt it with Designer PubKey pubKeys and send it and the 3DPrinter PubKey and assetHash to Designer

    // Todo: Encrypt!
    var otp = Math.floor(Math.random() * Math.floor(1000));

    UpdateValues.transactionData.OTPencryptedWithDesignerPubKey = otp + UpdateValues.transactionData.designer.pubKey
    UpdateValues.transactionData.OTPencryptedWithPrinterPubKey = otp + UpdateValues.transactionData.printer.pubKey

    return getAssetRegistry('org.usecase.printer.TransactionData')
    .then(function (assetRegistry) {
        return assetRegistry.update(UpdateValues.transactionData);
    });     
    
}
*/
