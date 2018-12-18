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

router.get('/students', token.admin, admin.getStudents);
router.get('/students/:userId', token.admin, admin.getUser);
router.put('/students/:userId', token.admin, admin.updateUser);
router.post('/students', token.admin, upload.any(), admin.addStudent);
router.post('/students/file', token.admin, upload.any(), admin.addFileStudent);
router.delete('/students/:userId', token.admin, admin.deleteStudent);

router.get('/teachers', token.admin, admin.getTeachers);
router.put('/teachers/:userId', token.admin, admin.updateUser);
router.post('/teachers', token.admin, upload.any(), admin.addTeacher);
router.post('/teachers/file', token.admin, upload.any(), admin.addFileTeacher);
router.delete('/teachers/:userId', token.admin, admin.deleteTeacher);


router.get('/classes', token.admin, admin.getClasses);
router.post('/classes/file', token.admin, upload.any(), admin.addClass);

module.exports = router;


