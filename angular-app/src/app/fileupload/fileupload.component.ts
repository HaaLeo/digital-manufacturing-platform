import { Component, OnInit } from '@angular/core';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile } from 'ng2-file-drop';
import {postKeyToBcDB, getAssetFromBcDB} from './bigchain-post/ipfsKeyAssetBigchain.js';
import generateCS from './bigchain-post/ChecksumGenerator.js';


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
  private currentProfileImage =  './uploadimage.png';
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

      // Read in the file
    // masterAssetBigchain(acceptedFile.file)
    // .then(txid => {
    //   console.log("[dragFileAccepted]", txid);
    // });
  }

 getChecksum() {
   return this.checksum;
 }
  async postBCDB(key, description, ownerID) {
    return await postKeyToBcDB(key, description, ownerID);
  }

  async getBCDB(txId) {
    return await getAssetFromBcDB(txId);
  }
  // File being dragged has been dropped and has been rejected
  private dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
    console.log("File being dragged has been dropped and has been rejected");
  }

}
