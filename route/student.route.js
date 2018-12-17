const express = require('express');
const router = express.Router();

//middleware 
const tokenChecker = require('../middleware/tokenChecker');
const identify = require('../middleware/identify');
//controller
const student = require('../controller/student.controller');


router.get('/:userId/classes', tokenChecker.student, identify.verify, student.getClasses);
router.get('/:userId/classes/:classId/survey', tokenChecker.student, identify.verify, student.getSurvey);

router.post('/:userId/classes', tokenChecker.student, identify.verify, student.addClass);
router.delete('/:userId/classes', tokenChecker.student, identify.verify, student.deleteClass);

router.put('/:userId/classes/:classId/survey', tokenChecker.student, identify.verify, student.updateSurvey)

module.exports = router;