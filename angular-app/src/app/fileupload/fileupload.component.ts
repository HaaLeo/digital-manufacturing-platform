import { Component, OnInit } from '@angular/core';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile } from 'ng2-file-drop';
import { postKeyToBcDB, getAssetFromBcDB } from './bigchain-post/ipfsKeyAssetBigchain.js';
import postBluePrintMaster from './bigchain-post/masterAssetBigchain.js';
import generateCS from './bigchain-post/ChecksumGenerator.js';
import { Buffer } from 'buffer';
import * as ipfsAPI from 'ipfs-api';
import * as openpgp from 'openpgp';
//declare var openpgp: any;

//import { openpgp } from 'openpgp';

@Component({
  selector: 'fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent {

  // IPFS connection details
  private readonly ipfsHost = 'localhost';
  private readonly ipfsPort = '5001';

  //Supported File Types
  private txid: string;
  private imageShown = false;
  private currentProfileImage = './uploadimage.png';
  private acceptedFile;
  private checksum;
  private currentFileName;
  private encryptedFile;

  //UPDATE THIS WITH NEW PASSPHRASE IF REQUIRED
  private passphrase = "printer-use-case";

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

  //Converts file into buffer and posts file to IPFS. Returns the hash value of the file from IPFS
  public async postFileToIPFS(): Promise<string> {
    const ipfs = ipfsAPI(this.ipfsHost, this.ipfsPort);

    const readerResult = await this.readAsArrayBufferAsync(this.acceptedFile);
    const buffer = Buffer.from(readerResult);

    let ipfsResponse = await ipfs.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) });
    const hashVal = ipfsResponse[0].hash;
    console.log('Ipfs hash value: ' + hashVal);

    return hashVal;
  }

  //Posts text to IPFS. Accepts string value. Returns the hash value of the item uploaded to Ipfs
  public async postTextToIPFS(text: string): Promise<string> {
    const ipfs = ipfsAPI(this.ipfsHost, this.ipfsPort);

    const buffer = Buffer.from(text);

    let ipfsResponse = await ipfs.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) });
    const hashVal = ipfsResponse[0].hash;
    console.log('Ipfs hash value: ' + hashVal);

    return hashVal;
  }

  //Retrieves text from IPFS based on accepted hash value.
  public async getTextFromIPFS(hash: string): Promise<string> {

      const ipfs = ipfsAPI(this.ipfsHost, this.ipfsPort);

      const buffer:Buffer = await ipfs.cat(hash);
      console.log('Received buffer from ipfs: ' + buffer.toString());
      return buffer.toString();
  }

  //Retrieves File from IPFS based on received hash value
  public async getFileFromIPFS(hash: string, filename: string): Promise<File> {
    const ipfs = ipfsAPI(this.ipfsHost, this.ipfsPort);

    const buffer:Buffer = await ipfs.cat(hash);
    console.log('Received buffer from ipfs: ' + buffer.toString());
    const retrievedFile = new File([buffer], filename);
    return retrievedFile;
  }

  //Uses OpenPGP. Accepts string value of public key. Encrypts the accepted file.
  public async encryptFile(pubKey: string): Promise<string> {
    return this.readAsTextAsync(this.acceptedFile).then(response => {
      console.log(response);
      let encrypted;

      const options = {
        data: response,
        publicKeys: openpgp.key.readArmored(pubKey).keys,
      }

      return openpgp.encrypt(options).then(ciphertext => {
        let returnedEncrypted = ciphertext.data
        return returnedEncrypted
      })
      .then(returnedEncrypted => {
        encrypted = returnedEncrypted;
        console.log(encrypted);
        return encrypted;
      })
      .catch(error => {
        return error;
      });
    });
  }

  //Accepts public key and string value to encrypt. Uses OpenPGP to encrypt string value. Returns encrypted string.
  public async encryptText(pubKey: string, encryptText: string): Promise<string> {
      let encrypted;

      const options = {
        data: encryptText,
        publicKeys: openpgp.key.readArmored(pubKey).keys,
      }

      return openpgp.encrypt(options).then(ciphertext => {
        let returnedEncrypted = ciphertext.data
        return returnedEncrypted
      })
      .then(returnedEncrypted => {
        encrypted = returnedEncrypted;
        console.log(encrypted);
        return encrypted;
      })
      .catch(error => {
        return error;
      });
  }

  //Accepts string password and plaintext. Uses OpenPGP to encrypt text with password. Returns encrypted string.
  public async encryptTextWithPassword(password: string, plaintext: string): Promise<string> {
    var options, encrypted;

    options = {
        data: plaintext,
        passwords: password
    };

    return openpgp.encrypt(options).then(ciphertext => {
      encrypted = ciphertext.data;
      return encrypted;
    })
    .then(returnEncrypted => {
      return returnEncrypted;
    })
    .catch(error => {
      return error
    });
  }

  //Takes in password and encrypted text. Decrypts text using password
  public async decryptTextWithPassword(password: string, encryptedText: string): Promise<string> {
    const options = {
      message: openpgp.message.readArmored(encryptedText),
      passwords: password
    };

    return openpgp.decrypt(options).then(plainText => {
      console.log("Look here" + plainText);
      console.log("Look here again" + plainText.data);
      return plainText;
    })
    .catch(error => {
      return error;
    });
  }

  //Accepts data and a private key. Decrypts the data with the private key and passphrase
  public async decryptTextWithPrivKey(data: string, privateKey: string): Promise<string> {
    console.log("------ MESSAGE ------");
    console.log(data);
    console.log("---------------------");

    console.log("------ PRIV KEY ------");
    console.log(privateKey);
    console.log("----------------------");
    const privKeyObj = openpgp.key.readArmored(privateKey).keys[0];

    //all generated PGP keys use this as passphrase, so hard-coded passphrase
    privKeyObj.decrypt(passphrase);

    const options = {
      message: openpgp.message.readArmored(data),
      privateKeys: [privKeyObj]
    }

    return openpgp.decrypt(options).then(plaintext => {
      console.log(plaintext.data)
      return plaintext.data
    })
    .then(plaintext => {
      return plaintext;
    })
    .catch(error => {
      return error;
    });
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

  private async readAsArrayBufferAsync(blob: Blob): Promise<ArrayBuffer> {
    console.log('Blob: ' + blob);
    return new Promise<ArrayBuffer>((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener('load', e => resolve((<FileReader>e.target).result));
      reader.addEventListener('error', e => reject((<FileReader>e.target).error));
      reader.readAsArrayBuffer(blob);
    });
  }

  public async readAsTextAsync(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener('load', e => resolve((<FileReader>e.target).result));
      reader.addEventListener('error', e => reject((<FileReader>e.target).error));
      reader.readAsText(blob);
    });
  }
}
