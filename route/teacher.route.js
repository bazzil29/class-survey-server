const express = require('express');
const router = express.Router();

const tokenChecker = require('../middleware/tokenChecker');

const identify = require('../middleware/identify');

//controller
const teacher = require('../controller/teacher.controller');

//classes of teacher
router.get('/:userId/classes', tokenChecker.teacher, identify.verify, teacher.getClasses);
router.post('/:userId/classes', tokenChecker.teacher, identify.verify, teacher.addClass);
router.delete('/:userId/classes', tokenChecker.teacher, identify.verify, teacher.deleteClass);

//survey of each class
router.get('/:userId/classes/:classId/survey', tokenChecker.teacher, identify.verify, teacher.getSurvey)


module.exports = router;