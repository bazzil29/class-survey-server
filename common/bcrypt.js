const bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);


module.exports = {
    create: (value) => bcrypt.hashSync(value, salt),
    verify: (plainText, hash) => bcrypt.compareSync(plainText, hash)
}