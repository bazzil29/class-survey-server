module.exports = {
    verify: (survey) => {
        if (survey.create_at !== survey.modify_at) {
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