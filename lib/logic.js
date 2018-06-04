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

