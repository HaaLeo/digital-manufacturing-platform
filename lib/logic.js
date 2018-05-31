'use strict';


var NS = 'org.usecase.printer';

/**
*  Canceling a Blueprint request
 * @param {org.usecase.printer.CancelRequest} cancelInfo
 * @transaction
*/

function cancelRequest(cancelInfo) {

    var cashBuyer = cancelInfo.blueprintCopy.buyer.cash
    var price =  cancelInfo.blueprintCopy.qualityRequirement.price

    cashBuyer.value = cashBuyer.value + price;
    
    return getAssetRegistry('org.usecase.printer.Cash')
    .then(function (assetRegistry) {
        return assetRegistry.update(cashBuyer);
        })                
        .then(function () {
            return  getAssetRegistry('org.usecase.printer.BlueprintCopy')
            .then(function (assetRegistry) {
                return assetRegistry.remove(cancelInfo.blueprintCopy);
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
        var cashSeller = transferValues.blueprintCopy.owner.cash
        // var cashBuyer = transferValues.blueprintCopy.buyer.cash
        var price =  transferValues.blueprintCopy.qualityRequirement.price

//        cashBuyer.value = cashBuyer.value - price;
        cashSeller.value = cashSeller.value + price;
    
        //update blueprint attributes
        transferValues.blueprintCopy.owner = transferValues.blueprintCopy.buyer;
        transferValues.blueprintCopy.printed = true;
    
        return getAssetRegistry('org.usecase.printer.Cash')
            .then(function (assetRegistry) {
                return assetRegistry.update(cashSeller);
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
 * Updating a BlueprintCopy with txID and checksum
 * @param {org.usecase.printer.UploadBlueprintCopy} uploadInfo
 * @transaction
 */
function UploadBlueprintCopy(uploadInfo) {
    var masterChecksum = uploadInfo.blueprintCopy.qualityRequirement.checksum;
    var copyChecksum = uploadInfo.checksum;
    
    if(masterChecksum == copyChecksum) {
        uploadInfo.blueprintCopy.checksum = copyChecksum;
        uploadInfo.blueprintCopy.txID = uploadInfo.txID;
        return getAssetRegistry(NS + '.BlueprintCopy')
        .then(function (assetRegistry) {
            return assetRegistry.update(uploadInfo.blueprintCopy);
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
// TODO refactor!
function requestBlueprint(buyingInfo) {
  
    var buyerCashValue = buyingInfo.buyer.cash.value;
    var qualityRequirementPrice = buyingInfo.qualityRequirement.price;

    //Enduser doesn't have enough money to buy blueprint.
    if(buyerCashValue < qualityRequirementPrice) {
      throw new Error('Cannot buy asset. Not enough funds.');
    }
  
    // BlueprintCopy is created
    var blueprintCopy = getFactory().newResource(NS, 'BlueprintCopy', Math.random().toString(36).substring(3));
    blueprintCopy.printed = false;
    blueprintCopy.printer = buyingInfo.printer;
    blueprintCopy.buyer = buyingInfo.buyer;
    blueprintCopy.qualityRequirement = buyingInfo.qualityRequirement;
    blueprintCopy.owner = buyingInfo.qualityRequirement.owner;
    blueprintCopy.txID = '';
    blueprintCopy.checksum = '';

    //Subtract the price from the user's wallet - will be added to the customers after confirmation
    buyingInfo.buyer.cash.value = buyingInfo.buyer.cash.value - qualityRequirementPrice;
    
    // Create OTP encrypt it with Printer PubKey pubKeys and send to Printer
    // Create OTP encrypt it with Customer PubKey pubKeys and send it and the 3DPrinter PubKey and assetHash to Customer
    // Todo: Encrypt OTP!

    var otp =  Math.random().toString(36).substring(3);
    blueprintCopy.otpEncryptedWithCustomerPubKey = otp;
    blueprintCopy.otpEncryptedWithPrinterPubKey = otp;

    return getAssetRegistry(NS + '.BlueprintCopy')
    .then(function (assetRegistry) {
        return assetRegistry.add(blueprintCopy);
    })
    .then(function () {
        return  getAssetRegistry('org.usecase.printer.Cash')
        .then(function (assetRegistry) {
            return assetRegistry.update(buyingInfo.buyer.cash);
        });
    });    
    
}

/**
 * Add new QualityRequirement
 * @param {org.usecase.printer.AddNewQualityRequirement} newQualityRequirement - new product addition
 * @transaction
 */

function addNewQualityRequirement(newQualityRequirement) {
    var qualityRequirement = getFactory().newResource(NS, 'QualityRequirement', newQualityRequirement.blueprintCopyID);
	qualityRequirement.txID = newQualityRequirement.txID;
	qualityRequirement.checksum = newQualityRequirement.checksum;
	qualityRequirement.price = newQualityRequirement.price;
	qualityRequirement.metadata = newQualityRequirement.metadata;
	qualityRequirement.owner = newQualityRequirement.owner;

    return getAssetRegistry(NS + '.QualityRequirement')
    .then(function(assetRegistry) {
        return assetRegistry.add(qualityRequirement);
      });
}

