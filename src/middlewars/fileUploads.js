const multer = require("multer");
const { badRequestCode } = require("../statuscode");

exports.uploadFile = (imageFile) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads");
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
        }
    });

//File extension
    const fileFilter = function (req, file, cb) {
        if (file.fieldname === imageFile) {
            if (!file.originalname.match(/\.(jpg|JPG|png|PNG|jpeg|JPEG)$/)) {
                req.fileValidationError = {
                message: "Only image files are allowed"
                }
                return cb(new Error("Only image file are allowed"), false)
            }
        }
        cb(null, true)
    }

    //size file
    const sizeInMB = 2
    const maxSize = sizeInMB * 1000 * 1000

    // generate configuration multer
    const upload = multer({
        storage,
        fileFilter,
        limits: {
        fileSize: maxSize
        }
    }).single(imageFile);


    // middleware handler
    return (req, res, next) => {
        upload(req, res, function (err) {
        if(req.file){

            // check jika validation gagal
            if (req.fileValidationError) {
                return res.status(badRequestCode.statusCode).send(req.fileValidationError);
            }

            //check jika tidak ada yang di submit
            if (!req.file && !err) {
                return res.status(badRequestCode.statusCode).send({
                message: "please select a file to upload"
                });
            }

            // check jika ukurannya melebihi limit
            if (err) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(badRequestCode.statusCode).send({
                        message: "Max size file 10MB"
                    })
                }

                return res.status(badRequestCode.statusCode).send(err);
            }

            return next();
        }
        else{
            return next();
        }
    });
    }
};