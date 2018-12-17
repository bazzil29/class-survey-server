module.exports = {
    verify: (req, res, next) => {
        const { userId } = req.params;
        const { _id, role_id } = req.body;
        if (userId === _id || role_id === 1) {
            next();
        }
        else {
            res.send({
                success: false,
                message: "User can't access this!"
            })
        }
    }
}