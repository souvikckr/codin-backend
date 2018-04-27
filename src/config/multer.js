const multer = require('multer');
const { uploads } = require('./vars');

const storage = multer.diskStorage({
    destination: uploads.path,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.gz$/)) {
        return cb(new Error('Only compressed files are allowed!'), false);
    }
    return cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
});

const single = upload.single(uploads.incoming);

module.exports = (req, res) => new Promise((resolve, reject) => {
    single(req, res, (err) => {
        if (err) {
            return reject(err);
        }
        return resolve();
    });
});
