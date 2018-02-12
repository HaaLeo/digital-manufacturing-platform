import { Component, OnInit } from '@angular/core';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile }  from 'ng2-file-drop';
import masterAssetBigchain from './bigchain-post/masterAssetBigchain.js';
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
  private imageShown: boolean = false;
  private currentProfileImage: string =  './uploadimage.png';
  private acceptedFile;
  private checksum;

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
     this.imageShown = true;
     this.acceptedFile = acceptedFile.file;

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
  async postBCDB(price, description, ownerID) {
    return await masterAssetBigchain(this.acceptedFile,price, description, ownerID)
  }

  // File being dragged has been dropped and has been rejected
  private dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
    console.log("File being dragged has been dropped and has been rejected");
  }

}
