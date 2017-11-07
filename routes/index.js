'use strict';

const { Router } = require('express');
const router = Router();

// landing page
router.get('/', (req, res, next) => {
  res.render('index');
});

// route modules
router.use(require('./authRoute'));
router.use(require('./gameRoute'));
router.use(require('./messageRoute'));
router.use(require('./questionRoute'));
router.use(require('./userRoute'));

module.exports = router;
