module.exports = {
    verify: (survey) => {
        if (1) {
            let tmp = true;
            survey.group_fields.forEach(element => {
                element.fields.forEach(e => {
                    if (e.value < 1 || e.value > 5)
                        tmp = false;
                })
            });
            return tmp;
        }
        return false;
    }
}