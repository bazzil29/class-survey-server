var XLSX = require('xlsx');

// var workbook = XLSX.readFile('ds_tai_khoan_sinh_vien.xlsx');

// var workbook = XLSX.readFile('ds_tai_khoan_canbo.xlsx');

// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));

module.exports = {
    classFile: (filename) => {

        var workbook = XLSX.readFile(filename);

        var worksheet = workbook.Sheets['DSLMH'];

        var id = worksheet['C9'].v;
        var name = worksheet['C10'].v;
        var count_credit = worksheet['F9'].v;
        var place = worksheet['F8'].v;
        var students = [];
        var teacher = {
            id: worksheet['E7'].v,
            name: worksheet['C7'].v
        }

        var headers = {
            '0': 'stt',
            '1': 'id',
            '2': 'name',
            '3': 'date_of_birth',
            '4': 'base_class',
            '5': 'note'
        }

        try {
            if (worksheet['A1'].v !== 'STT') {
                for (let R = 11; ; R++) {
                    if (worksheet[XLSX.utils.encode_cell({ c: 0, r: R })]) {
                        for (let C = 0; C <= 4; C++) {
                            let cell_addr = { c: C, r: R };

                            if (!students[R - 10])
                                students[R - 10] = {};

                            students[R - 10][headers[C]] = worksheet[XLSX.utils.encode_cell(cell_addr)].v.trim();
                        }
                    } else break;

                }

                students.shift();

                var result = {
                    id: id,
                    name: name,
                    teacher: teacher,
                    count_credit: count_credit,
                    place: place,
                    students: students
                };

                return result;
            } else {
                return null
            }
        } catch (err) {
            console.log(err);
            return null;
        }


    },

    teacherFile: (filename) => {
        const workbook = XLSX.readFile(filename);

        const worksheet = workbook.Sheets['Sheet1'];
        const teachers = [];

        const headers = {
            '0': 'stt',
            '1': 'id',
            '2': 'password',
            '3': 'name',
            '4': 'email'
        }
        try {
            if (worksheet['A1'].v === 'STT' && !worksheet['F1']) {
                for (let R = 1; ; R++) {
                    if (worksheet[XLSX.utils.encode_cell({ c: 0, r: R })]) {
                        for (let i = 0; i < 5; i++) {
                            if (!teachers[R - 1])
                                teachers[R - 1] = {};

                            teachers[R - 1][headers[i]] = worksheet[XLSX.utils.encode_cell({ c: i, r: R })].v.trim()
                        }
                    } else {
                        break;
                    }
                }
                return teachers === [] ? null : teachers;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    },

    studentFile: (filename) => {
        const workbook = XLSX.readFile(filename);

        const worksheet = workbook.Sheets['Sheet1'];
        const students = [];

        const headers = {
            '0': 'stt',
            '1': 'id',
            '2': 'password',
            '3': 'name',
            '4': 'email',
            '5': 'base_class'
        }
        try {
            if (worksheet['A1'].v === 'STT' && worksheet['F1'].v === 'Khóa đào tạo') {
                for (let R = 1; ; R++) {
                    if (worksheet[XLSX.utils.encode_cell({ c: 0, r: R })]) {
                        for (let i = 0; i < 6; i++) {
                            if (!students[R - 1])
                                students[R - 1] = {};

                            students[R - 1][headers[i]] = worksheet[XLSX.utils.encode_cell({ c: i, r: R })].v.trim();
                        }
                    } else {
                        break;
                    }
                }
                return students === [] ? null : students;
            } else {
                return null;
            }
        } catch (err) {
            return null
        }
    }
}

