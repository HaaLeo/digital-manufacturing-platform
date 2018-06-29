import * as Yup from 'yup';
import {Chaincode, Helpers, StubHelper} from "@theledger/fabric-chaincode-utils";

export class EvaluateReportChaincode extends Chaincode {


    // Basic implementation of Chaincode for creating an evaluationResult: Still 2do: Add database hash, encrypt with
    // customerpubkey, add printingJobID, maybe write a get function as well.
    // next up, create EvaluationResult Asset
    async evaluateReport(stubHelper: StubHelper, args: string[]): Promise<any> {
        const verifiedArgs = await Helpers.checkArgs<{peakTemperatureRequirement: Number,
            peakPressureRequirement: Number, peakTemperature: Number, peakPressure: Number, customerKey: string}>(args[0],
            Yup.object().shape(
            {
                peakTemperature: Yup.number().required(),
                peakTemperatureRequirement: Yup.number().required(),
                peakPressure: Yup.number().required(),
                peakPressureRequirement: Yup.number().required(),
            }));

        let evaluationResult = {
            is_passed: false
        };
        if (verifiedArgs.peakTemperature <= verifiedArgs.peakTemperatureRequirement
            && verifiedArgs.peakPressure <= verifiedArgs.peakPressureRequirement){
            evaluationResult = {
                is_passed: true,
            };
        }
        await stubHelper.putState(verifiedArgs.customerKey, evaluationResult);

    }
}
