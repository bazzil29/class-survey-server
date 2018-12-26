const express = require('express');
const router = express.Router();

//middleware 
const tokenChecker = require('../middleware/tokenChecker');
const identify = require('../middleware/identify');
//controller
const student = require('../controller/student.controller');

router.get('', tokenChecker.student, student.getStudents);
//classes of student
router.get('/:userId/classes', tokenChecker.student, identify.verify, student.getClasses);
router.post('/:userId/classes', tokenChecker.student, identify.verify, student.addClass);
router.delete('/:userId/classes/:classId', tokenChecker.student, identify.verify, student.deleteClass);

//survey of class 
router.get('/:userId/classes/:classId/survey', tokenChecker.student, identify.verify, student.getSurvey);
router.put('/:userId/classes/:classId/survey', tokenChecker.student, identify.verify, student.updateSurvey)



module.exports = router;