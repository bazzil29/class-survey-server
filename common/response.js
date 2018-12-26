module.exports = {

    success: (res, data, message) => {
        return res.status(200).send({
            success: true,
            data: data,
            message: message
        })
    },

    false: (res, message) => {
        return res.status(401).send({
            success: false,
            message: message
        })
    }
}