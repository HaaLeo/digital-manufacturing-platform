import { Component, OnInit } from '@angular/core';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile }  from 'ng2-file-drop';
import masterAssetBigchain from './bigchain-post/masterAssetBigchain.js';


@Component({
  selector: 'fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
  
  // template: `
  
    
  //   <div class="file-drop-container">
  //     <div ng2FileDrop class="custom-component-drop-zone"
  
  //      [ng2FileDropMaximumSizeBytes]="maximumFileSizeInBytes"
  //      [ng2FileDropSupportedFileTypes]="supportedFileTypes"
  
  //      (ng2FileDropHoverStart)="dragFileOverStart()" 
  //      (ng2FileDropHoverEnd)="dragFileOverEnd()"
  //      (ng2FileDropFileAccepted)="dragFileAccepted($event)" 
  //      (ng2FileDropFileRejected)="dragFileRejected($event)">
        
  //       <div *ngIf="!imageShown">
  //            <p class="instructions">Drag and Drop your blueprint.</p>
  //       </div>
        
  //       <div *ngIf="imageShown" class=image-container>
  //           <p class="instructions">Thank you for your design!</p>
  //       </div>
        
  //     </div>
  //   </div>
  
  // `,
  
  // styles: [`
  
  //   .file-drop-container {
  //     margin: 30 auto;
  //     padding-top: 15px;
  //   }
  
  //   .custom-component-drop-zone {
  //     margin: 0 auto;

  //     border-style: dashed;
  //     border-width: 2px;
  //     border-radius: 30px;
  //     border-color: #979797;
  
  //     width: 300px;
  //     height: 300px;
  
  //     text-align: center;
  //   }
    
  //   .instructions {
  //     position: relative;
  //     color: #979797;
  
  //     text-align: center;
  
  //     font-size: 12px;
  
  //     top: 40px;
  //     width: 100%;
  //   }
    
  //   .image-container {

  //     width: 100%;
  //     height: 100%;
  
  //     overflow: hidden;
  //     position: relative;
  
  //     border-radius: 30px;
  //   }
  //   .request-image {

  //     width: 100%;
  //     height: 100%;
  //     object-fit: cover;
  //   }
  
  // `]
})
export class FileuploadComponent {

  //Maximum file size in bytes
  
  //Supported File Types
  private txid: string;
  private imageShown: boolean = false;
  private currentProfileImage: string =  './uploadimage.png';

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
     

    // Read in the file
    this.txid = masterAssetBigchain(acceptedFile.file);
    console.log(this.txid);
  }
 
 
 
 
 
 
 
  // File being dragged has been dropped and has been rejected
  private dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
    console.log("File being dragged has been dropped and has been rejected");
  }




}
