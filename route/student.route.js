const express = require('express');
const router = express.Router();

//middleware 
const tokenChecker = require('../middleware/tokenChecker');
//controller
const student = require('../controller/student.controller');


router.get('/:studentId/classes', tokenChecker.verify, student.getClasses);
router.get('/:studentId/classes/:classId/survey', tokenChecker.verify, student.getSurvey);
router.put('/:studentId/classes/:classId/survey', tokenChecker.verify, student.updateSurvey)

module.exports = router;