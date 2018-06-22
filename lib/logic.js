'use strict';


var NS = 'org.usecase.printer';

/**
*  Canceling a Blueprint request
 * @param {org.usecase.printer.CancelRequest} cancelInfo
 * @transaction
*/

function cancelRequest(cancelInfo) {

    var cashBuyer = cancelInfo.printingJob.buyer.cash
    var price =  cancelInfo.printingJob.blueprintMaster.price

    cashBuyer.value = cashBuyer.value + price;
    
    return getAssetRegistry('org.usecase.printer.Cash')
    .then(function (assetRegistry) {
        return assetRegistry.update(cashBuyer);
        })                
        .then(function () {
            return  getAssetRegistry('org.usecase.printer.PrintingJob')
            .then(function (assetRegistry) {
                return assetRegistry.remove(cancelInfo.printingJob);
            });            
        });     
}

/**
 * Trasferring a Blueprint in return for cash
 * @param {org.usecase.printer.ConfirmTransaction} transferValues
 * @transaction
 */

function confirmTransaction(transferValues) {
        //update the cash values
	debugger;
        var cashSeller = transferValues.printingJob.owner.cash
        // var cashBuyer = transferValues.printingJob.buyer.cash
        var price =  transferValues.printingJob.blueprintMaster.price

//        cashBuyer.value = cashBuyer.value - price;
        cashSeller.value = cashSeller.value + price;
    
        //update blueprint attributes
        transferValues.printingJob.owner = transferValues.printingJob.buyer;
        transferValues.printingJob.printed = true;
    
        return getAssetRegistry('org.usecase.printer.Cash')
            .then(function (assetRegistry) {
                return assetRegistry.update(cashSeller);
            })                
            .then(function () {
                return  getAssetRegistry('org.usecase.printer.PrintingJob')
                .then(function (assetRegistry) {
                    return assetRegistry.update(transferValues.printingJob);
                });            
            });     
        // TODO: Notification for Enduser?
    }


/**
 * Updating a PrintingJob with txID and checksum
 * @param {org.usecase.printer.UploadPrintingJob} uploadInfo
 * @transaction
 */
function UploadPrintingJob(uploadInfo) {
    var masterChecksum = uploadInfo.printingJob.blueprintMaster.checksum;
    var jobChecksum = uploadInfo.checksum;
    
    if(masterChecksum == jobChecksum) {
        uploadInfo.printingJob.checksum = jobChecksum;
        uploadInfo.printingJob.txID = uploadInfo.txID;
        return getAssetRegistry(NS + '.PrintingJob')
        .then(function (assetRegistry) {
            return assetRegistry.update(uploadInfo.printingJob);
        });      
    } else {
        throw new Error('Checksum doesn\'t match.');
    }
}



/**
 * Trasferring a Blueprint in return for cash
 * @param {org.usecase.printer.RequestBlueprint} buyingInfo
 * @transaction
 */

function requestBlueprint(buyingInfo) {
  
    var buyerCashValue = buyingInfo.buyer.cash.value;
    var blueprintMasterPrice = buyingInfo.blueprintMaster.price;

    //Enduser doesn't have enough money to buy blueprint.
    if(buyerCashValue < blueprintMasterPrice) {
      throw new Error('Cannot buy asset. Not enough funds.');
    }
  
    // PrintingJob is created
    var printingJob = getFactory().newResource(NS, 'PrintingJob', Math.random().toString(36).substring(3));
	printingJob.printed = false;
	printingJob.printer = buyingInfo.printer;
	printingJob.buyer = buyingInfo.buyer;
	printingJob.blueprintMaster = buyingInfo.blueprintMaster;
	printingJob.owner = buyingInfo.blueprintMaster.owner;
	printingJob.txID = '';
	printingJob.checksum = '';

    //Subtract the price from the user's wallet - will be added to the designer after confirmation
    buyingInfo.buyer.cash.value = buyingInfo.buyer.cash.value - blueprintMasterPrice;
    
    // Create OTP encrypt it with Printer PubKey pubKeys and send to Printer
    // Create OTP encrypt it with Designer PubKey pubKeys and send it and the 3DPrinter PubKey and assetHash to Designer
    // Todo: Encrypt OTP!

    var otp =  Math.random().toString(36).substring(3);
	printingJob.otpEncryptedWithDesignerPubKey = otp;
	printingJob.otpEncryptedWithPrinterPubKey = otp;

    return getAssetRegistry(NS + '.PrintingJob')
    .then(function (assetRegistry) {
        return assetRegistry.add(printingJob);
    })
    .then(function () {
        return  getAssetRegistry('org.usecase.printer.Cash')
        .then(function (assetRegistry) {
            return assetRegistry.update(buyingInfo.buyer.cash);
        });
    });    
    
}

/**
 * Add new BlueprintMaster
 * @param {org.usecase.printer.AddNewBlueprintMaster} newBlueprintMaster - new product addition
 * @transaction
 */

function addNewBlueprintMaster(newBlueprintMaster) {
    var blueprintMaster = getFactory().newResource(NS, 'BlueprintMaster', newBlueprintMaster.printingJobID);
    blueprintMaster.txID = newBlueprintMaster.txID
    blueprintMaster.checksum = newBlueprintMaster.checksum
    blueprintMaster.price = newBlueprintMaster.price
    blueprintMaster.metadata = newBlueprintMaster.metadata
    blueprintMaster.owner = newBlueprintMaster.owner

    return getAssetRegistry(NS + '.BlueprintMaster')
    .then(function(assetRegistry) {
        return assetRegistry.add(blueprintMaster);
      });
}

