const fs = require('fs');
const url = require('url');
const path = require('path');
const express = require('express');
const router = express.Router();

const rootData = require('./rootData');
const { responseData, formName } = require('./responseData');

const metadata = fs.readFileSync(path.resolve(__dirname, 'metadata.xml'), 'utf8')

function fullUrl(req, { subpath, hash }) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: path.join(req.originalUrl, subpath).replace(/\\/g, '/'),
    hash,
  });
}

router.get('/', function(req, res, next) {
  res.set('OData-Version', '4.0');
  res.type('json');
  res.send({
    "@odata.context": fullUrl(req, { subpath: '$metadata' }),
    "value": rootData,
  });
});

router.get('/([\$])metadata', function(req, res, next) {
  res.type('application/xml');
  res.send(metadata.trim());
});

router.get('/Responses-*', function(req, res, next) {
  res.type('json');
  res.send({
    "@odata.context": fullUrl(req, { subpath: '$metadata', hash: `#Responses: ${formName}` }).replace('/Responses-00000000-0000-0000-0000-000000000000', ''),
    "value": responseData,
  });
});

module.exports = router;
