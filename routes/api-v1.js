var express = require('express');
var router = express.Router();
var BillResource = require('../controllers/bill-resource')


router.get('/', (req, res, next) => {
  res.send('api V1');
});

/* bills routes */
router.get('/bills', (req, res, next) => {
  return BillResource.index(req, res);
});
router.get('/bills/:billId', (req, res, next) => {
  return BillResource.show(req, res);
});
router.post('/bills', (req, res, next) => {
  return BillResource.store(req, res);
});
router.put('/bills/:billId', (req, res, next) => {
  return BillResource.update(req, res);
});
router.delete('/bills/:billId', (req, res, next) => {
  return BillResource.delete(req, res);
});

module.exports = router;
