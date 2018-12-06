const router = require('express').Router();

const token = require('../middleware/tokenChecker');

const admin = require('../controller/admin.controller');

const multer = require('multer');

const xlxsFilter = function (req, file, cb) {
    // accept xlxs only
    if (!file.originalname.match(/\.(xlsx)$/)) {
        return cb(new Error('Only xlxs files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ dest: 'uploads', fileFilter: xlxsFilter });

router.put('/students/:studentId', token.verify, admin.updateUser);
router.put('/teachers/:teacherid', token.verify, admin.updateUser);
router.post('/students', token.verify, admin.getStudents);
router.post('/teacher', token.verify);
router.get('/classes', token.verify, admin.getClasses);
router.post('/classes', token.verify, upload.single('xlsx'), admin.addClass);

module.exports = router;


