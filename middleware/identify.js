const response = require("../common/response");
module.exports = {
    verify: (req, res, next) => {
        const { userId } = req.params;
        const { _id, role_id } = req.body;
        if (userId === _id || role_id === 1) {
            next();
        }
        else {
            response.false(res, "User can't access this!");
        }
    }
}