import * as CryptoJS from 'crypto-js';

export default function generateCS(dataPayload) {
	return generateChecksum(dataPayload,getCS);
}

 function generateChecksum(dataPayload, callback) {
	var reader = new FileReader();

	return new Promise((resolve, reject) => {

		reader.onload = function(event) {
	    var binary = event.target.result;
	    var sha256Hash = CryptoJS.SHA256(binary).toString();
	    resolve(sha256Hash);
  	};		
  	
  	reader.readAsBinaryString(dataPayload);
	})
}

function getCS(cs) {
		return cs;
	}