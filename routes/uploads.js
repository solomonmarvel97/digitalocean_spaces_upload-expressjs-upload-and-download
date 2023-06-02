const express = require('express');
const router = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const AWS = require('aws-sdk');

let space = new AWS.S3({
  //Get the endpoint from the DO website for your space
  endpoint: process.env.DO_SPACES_ENDPOINT,
  useAccelerateEndpoint: false,
  //Create a credential using DO Spaces API key (https://cloud.digitalocean.com/account/api/tokens)
  credentials: new AWS.Credentials(process.env.DO_SPACES_KEY, process.env.DO_SPACES_SECRET, null)
});

//Name of your bucket here
const bucketName = process.env.DO_BUCKET_NAME;

/* Upload file */
router.post('/upload', upload.single('file'), function(req, res, next) {
  
  console.log(req.query)
  
  // configure single upload parameter
  const uploadParameters = {
    Bucket: bucketName,
    ContentType: req.query.content_type,
    Body: req.file.buffer,
    ACL: req.query.acl,
    Key: req.query.file_name
  };
  
  // configure single space upload
  space.upload(uploadParameters, function (error, data) {
    if (error){
      console.error(error);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});


// GET / -> Returns the object item as binary using the filename
router.get('/:fileName', function (req, res, next) {
  // configure download parameters
  let downloadParameters = {
    Bucket: bucketName,
    Key: req.params.fileName
  };
  
  // get space object item as binary object
  space.getObject(downloadParameters, function(error, data) {
    if (error){
      console.error(error);
      res.sendStatus(500);
      return;
    }
    res.contentType(data.ContentType);
    res.end(data.Body, 'binary');
  });
});

module.exports = router;
