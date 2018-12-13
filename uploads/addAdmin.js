const bcrypt = require('../services/bcrypt');

const hashPassword = bcrypt.create('admin');

console.log(hashPassword);