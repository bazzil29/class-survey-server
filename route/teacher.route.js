const express = require('express');
const router = express.Router();

const tokenChecker = require('../middleware/tokenChecker');

const identify = require('../middleware/identify');

//controller
const teacher = require('../controller/teacher.controller');


router.get('/:userId/classes', tokenChecker.teacher, identify.verify, teacher.getClasses);
router.get('/:userId/classes/:classId/survey', tokenChecker.teacher, identify.verify, teacher.getSurvey)

router.post('/:userId/classes', tokenChecker.teacher, identify.verify, teacher.addClass);

router.delete('/:userId/classes', tokenChecker.teacher, identify.verify, teacher.deleteClass);

module.exports = router;