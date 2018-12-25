const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

//import router
const userRoute = require("./route/user.route");
const teacherRoute = require('./route/teacher.route');
const studentRoute = require('./route/student.route');
const adminRoute = require('./route/admin.route');

const app = express();
const server = require('http').Server(app);

const port = 5000;

//connet database

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/class-survey-database');
// mongoose.connect('mongodb://admin:a123456@ds045507.mlab.com:45507/class-survey-database');

// Cross Origin Error
app.get('/', (req, res) => {
    res.json("HI ban");
})
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
//user route
app.use('/users', userRoute);
//teacher route
app.use('/teachers', teacherRoute);
//student route
app.use('/students', studentRoute);
//admid route
app.use('/admins', adminRoute);


// server.listen(5000, () => {
//     console.log('Listening on port ' + 3000);
// });
server.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || port, () => {
    console.log('Listening on port ' + port);
});

module.exports = app;