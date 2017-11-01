'use strict';

const { Router } = require('express');
const router = Router();

const { postAvatar } = ('../controllers/userCtrl')

router.patch('/user/avatar', postAvatar)
module.exports = router;