let path = require('path');
var exec = require('child_process').exec;

dodelete = (target) => {
    new Promise((res, rel) => {
        let targertpath = path.join(__dirname, '../', 'uploads', target);
        let commond = `  rm -rf  ${targertpath}  `;
        console.log('object', commond);
        exec(commond, (err, out) => {
            if (err) {
                throw err;
            }
            res(out);
        });
    });
};

module.exports = dodelete;

