let path = require('path');
var exec = require('child_process').exec;

dodelete = (target) => {
    new Promise((res, rel) => {
        let targertpath = path.join(__dirname, '../', 'uploads', target);
        let commond = `  rm -rf  ${targertpath}  `;
        console.log('object', commond);
        exec(commond, function (err, out) {
            console.log(out);
            res();
            err && rel(err);
        });
    });
};

module.exports = dodelete;

// console.log('__dirname', __dirname)
