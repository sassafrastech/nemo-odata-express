var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('root');
});

router.get('/([\$])metadata', function(req, res, next) {
  res.send('$metadata');
});

router.get('/id', function(req, res, next) {
  res.send('id');
});

module.exports = router;
