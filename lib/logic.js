/* eslint-disable require-jsdoc */
'use strict';


var NS = 'org.usecase.printer';
/**
 * Add new QualityRequirement
 * @param {org.usecase.printer.AddNewQualityRequirement} newQualityRequirement - new product addition
 * @transaction
 */

function addNewQualityRequirement(newQualityRequirement) {
    var qualityRequirement = getFactory().newResource(NS, 'QualityRequirement', newQualityRequirement.qualityRequirementID);
    qualityRequirement.txID = newQualityRequirement.txID;
    qualityRequirement.checksum = newQualityRequirement.checksum;
    qualityRequirement.pressure = newQualityRequirement.pressure;
    qualityRequirement.peakTemperature = newQualityRequirement.peakTemperature;
    qualityRequirement.metadata = newQualityRequirement.metadata;
    qualityRequirement.owner = newQualityRequirement.owner;

    return getAssetRegistry(NS + '.QualityRequirement')
        .then(function(assetRegistry) {
            return assetRegistry.add(qualityRequirement);
        });
}

function addNewPrintingJob(newPrintingJob) {
    var printingJob = getFactory().newResource(NS, 'PrintingJob', newPrintingJob.printingJobID);
    printingJob.txID = newPrintingJob.txID;
    printingJob.checksum = newPrintingJob.checksum;
    printingJob.metadata = newPrintingJob.metadata;
    printingJob.blueprint = newPrintingJob.blueprint;
    printingJob.customer = newPrintingJob.customer;
    printingJob.printer = newPrintingJob.printer;

    return getAssetRegistry(NS + '.PrintingJob')
        .then(function(assetRegistry) {
            return assetRegistry.add(printingJob);
        });
}