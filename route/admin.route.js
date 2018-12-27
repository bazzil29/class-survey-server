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
router.post('/students', token.admin, admin.addStudent);
router.post('/students/file', token.admin, upload.any(), admin.addFileStudent);
router.delete('/students/:userId', token.admin, admin.deleteStudent);

router.get('/teachers', token.admin, admin.getTeachers);
router.get('/teachers/:userId', token.admin, admin.getUser);
router.put('/teachers/:userId', token.admin, admin.updateUser);
router.post('/teachers', token.admin, admin.addTeacher);
router.post('/teachers/file', token.admin, upload.any(), admin.addFileTeacher);
router.delete('/teachers/:userId', token.admin, admin.deleteTeacher);


router.get('/classes', token.admin, admin.getClasses);
router.get('/classes/:classId/survey', token.admin, admin.getSurvey);
router.put('/classes/:classId/survey', token.admin, admin.updateSurvey);
router.delete('/classes/:classId/survey', token.admin, admin.deleteSurvey);
router.post('/classes/file', token.admin, upload.any(), admin.addClass);


router.get('/templates', token.admin, admin.getSurveyTemplates);
router.post('/templates', token.admin, admin.addTemplate);
router.get('/templates/:templateId', token.admin, admin.getSurveyTemplate);
router.put('/templates/:templateId', token.admin, admin.updateTemplate);
router.put('/templates/:templateId/toUse', token.admin, admin.makeUseTemplate);

router.put('/reset', token.admin, admin.reset)

module.exports = router;


