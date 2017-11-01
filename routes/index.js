'use strict';

const { Router } = require('express');
const router = Router();

// landing page
router.get('/', (req, res, next) => {
  res.render('index');
});

// route modules
router.use(require('./authRoute'));

module.exports = router;
