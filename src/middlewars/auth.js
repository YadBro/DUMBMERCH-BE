const jwt   = require('jsonwebtoken');
const { unAuthorizeCode, badRequestCode } = require('../statuscode');

exports.auth    = async (req, res, next) =>{
    try {
        const authHeader    = req.header('Authorization');
        const token         = authHeader && authHeader.split(' ')[1];
        console.log(token, "TOKEN LOH");
        if (!token){
            res.status(401).send({
                status  : unAuthorizeCode.statusData,
                message : 'Access Denied!'
            });
        }else{
            const SECRET_KEY    = process.env.SECRET_KEY;
            const verified      = jwt.verify(token, SECRET_KEY);
            req.user    = verified;

            return next();
        }
    } catch (error) {
        console.log(error);
        res.status(badRequestCode.statusCode).send({
            status  : error.name,
            message : error.message
        });
    }


}