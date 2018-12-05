const router = require('express').Router();

const token = require('../middleware/tokenChecker');

const admin = require('../controller/admin.controller');

router.put('/students/:studentId', token.verify, admin.updateUser);
router.put('/teachers/:teacherid', token.verify, admin.updateUser);
router.post('/students', token.verify);
router.post('/teacher', token.verify);
router.get('/classes', token.verify, admin.getClasses);
router.post('/classes', token.verify, admin.addClass);


module.exports = router;
