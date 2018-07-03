import { Component, OnInit } from '@angular/core';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile } from 'ng2-file-drop';
import { postKeyToBcDB, getAssetFromBcDB } from './bigchain-post/ipfsKeyAssetBigchain.js';
import postBluePrintMaster from './bigchain-post/masterAssetBigchain.js';
import generateCS from './bigchain-post/ChecksumGenerator.js';
import { Buffer } from 'buffer';
import * as ipfsAPI from 'ipfs-api';

@Component({
  selector: 'fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent {

  //Maximum file size in bytes

  //Supported File Types
  private txid: string;
  private imageShown = false;
  private currentProfileImage = './uploadimage.png';
  private acceptedFile;
  private checksum;
  private currentFileName;

  // File being dragged has moved into the drop region
  private dragFileOverStart() {
    console.log("File being dragged has moved into the drop region");
  }

  // File being dragged has moved out of the drop region
  private dragFileOverEnd() {
    console.log("File being dragged has moved out of the drop region");
  }

  // File being dragged has been dropped and is valid
  private dragFileAccepted(acceptedFile: Ng2FileDropAcceptedFile) {
    console.log("File being dragged has been dropped and is valid");

    // Load the image in

    this.acceptedFile = acceptedFile.file;
    console.log("test: " + acceptedFile.file.name);
    this.currentFileName = acceptedFile.file.name;
    this.imageShown = true;

    generateCS(this.acceptedFile)
      .then(hs => {
        this.checksum = hs;
      });
  }

  getChecksum() {
    return this.checksum;
  }

  public async postFileToIPFS(): Promise<string> {
    let hashVal: string;
    let readerResult = await this.readAsArrayBuffer(this.acceptedFile);
    let ipfsApi;
    ipfsApi = ipfsAPI('localhost', '5001');
    const buffer = Buffer.from(readerResult);
    let ipfsResponse = await ipfsApi.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) });
    hashVal = ipfsResponse[0].hash;
    console.log('Hash Value: ' + hashVal);

    return hashVal;
}
  async postBluePrintMasterBCDB(price, meta, ownerID) {
    return postBluePrintMaster(this.acceptedFile, price, meta, ownerID);
  }
  async postKeyToBCDB(key, description, ownerID) {
    return await postKeyToBcDB(key, description, ownerID);
  }

  async getBCDB(txId) {
    return await getAssetFromBcDB(txId);
  }
  // File being dragged has been dropped and has been rejected
  private dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
    console.log("File being dragged has been dropped and has been rejected");
  }

  private async readAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    console.log('Blob: ' + blob);
    return new Promise<ArrayBuffer>((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener('load', e => resolve((<FileReader>e.target).result));
      reader.addEventListener('error', e => reject((<FileReader>e.target).error));
      reader.readAsArrayBuffer(blob);
    });
}
}
