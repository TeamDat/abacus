const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const pubsub = require('@google-cloud/pubsub')();
const path = require('path');
const os = require('os');
const fs = require('fs');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.monitor = functions.storage.bucket("abacus-pending").object().onChange(event => {
    if (!event.data.contentType.startsWith('image/')
        || event.data.resourceState === 'not_exists'
        || (event.data.resourceState === 'exists' && event.data.metageneration >1)
        || event.data.contentType.startsWith('image/jpeg')) {
      return;
    }
    const object = event.data;
    const filePath = object.name;
    const baseFileName = path.basename(filePath, path.extname(filePath));
    const fileDir = path.dirname(filePath);
    const JPEGFilePath = path.normalize(path.format({dir: fileDir, name: baseFileName, ext: '.jpg'}));
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const tempLocalJPEGFile = path.join(os.tmpdir(), JPEGFilePath);
    const bucket = gcs.bucket(object.bucket);
    const topic = pubsub.topic('completedownload');
    const publisher = topic.publisher();
    const dataBuffer = Buffer.from(fileDir);


    return mkdirp(tempLocalDir).then(() => {
        return bucket.file(filePath).download({destination: tempLocalFile});
      }).then(() => {
        return spawn('convert', [tempLocalFile, tempLocalJPEGFile]);
      }).then(() => {
        //return gcs.bucket("abacus-complete").upload(tempLocalJPEGFile, {destination: JPEGFilePath});
      }).then(() => {
        fs.unlinkSync(tempLocalJPEGFile);
        fs.unlinkSync(tempLocalFile);
        publisher.publish(dataBuffer);
      });
});

/*exports.pdfpreview = functions.storage.bucket("abacus-complete").object().onChange(event => {
    if (!event.data.name.endsWith('.pdf')
        || event.data.resourceState === 'not_exists'
        || (event.data.resourceState === 'exists' && event.data.metageneration >1)) {
        console.log('Not applicable here');
        return;
    }

    const object = event.data;
    const filePath = object.name;
    const baseFileName = path.basename(filePath, path.extname(filePath));
    const fileDir = path.dirname(filePath);
    const JPEGFilePath = path.normalize(path.format({dir: fileDir, name: baseFileName, ext: '.jpg'}));
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const tempLocalJPEGFile = path.join(os.tmpdir(), JPEGFilePath);
    const bucket = gcs.bucket(object.bucket);
    const dataBuffer = Buffer.from(fileDir);

    console.log('Generating JPG for PDF ' + filePath);

    return mkdirp(tempLocalDir).then(() => {
        console.log('Downloading file to ' + tempLocalFile);
        return bucket.file(filePath).download({destination: tempLocalFile});
    }).then(() => {
        console.log('Converting file to ' + tempLocalJPEGFile);
        return spawn('convert', ['-verbose', '-density', '150', tempLocalFile, '-crop', '450x450+270+230', tempLocalJPEGFile]);
    }).then(() => {
        console.log('Uploading file to ' + JPEGFilePath);
        return bucket.upload(tempLocalJPEGFile, {destination: JPEGFilePath});
    }).then(() => {
        fs.unlinkSync(tempLocalJPEGFile);
        fs.unlinkSync(tempLocalFile);
    });
});*/
