const { user }  = require('../../models');
const Joi       = require('joi');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const { success, badRequestCode, notFoundCode, unAuthorizeCode, conflictCode, internalServerCode }   = require('../statuscode');

let successCode;


exports.register = async (req, res) =>{
    try {
        // GET DATA
        req.body.status = "buyer";
        const data      = req.body;
        let addUser;
        let message;
        
        
        // VALIDATION DATA
        const schema = Joi.object({
            name        : Joi.string().required(),
            email       : Joi.string().email().required(),
            password    : Joi.string().min(6).required(),
            status      : Joi.string().required()
        });
        
        let validateData    = schema.validate(data);
        const {value}       = validateData;
        if (validateData?.error){

            statusData  = validateData.error.name;
            successCode = badRequestCode.statusCode;
            message     = validateData.error.message;
            addUser     = value;
            
        }else{
            // HASHING PASSWORD
            const salt              = await bcrypt.genSalt(10);
            const hashedPassword    = await bcrypt.hash(value.password, salt);
            const validData         = {
                ...value,
                password    : hashedPassword
            }

            // CHECK EMAIL
            const isRegistered   = await user.findOne({
                attributes   : {
                    exclude : ['password','createdAt', 'updatedAt']
                },
                where       : {
                    email   : data.email
                },
            });

            if (isRegistered){
                successCode = conflictCode.statusCode;
                statusData  = conflictCode.statusData;
                message     = "Your email in input has been registered!";

            }else{

                statusData  = success.statusData;
                successCode = success.statusCode;
                message     = success.message;
                addUser   = await user.create(validData);
            }

        }
        
        res.status(successCode).send({
            status  :   statusData,
            data    :   {
                user    :   {
                    id      : addUser?.id,
                    name    : addUser?.name,
                    email   : addUser?.email
                }
            },
            message
        });

    } catch (error) {

        res.status(internalServerCode.statusCode).send({
            status  :   error?.name,
            message :   error?.message
        });

    }
}

exports.login = async (req, res) => {
    const SECRET_KEY    = process.env.SECRET_KEY;
    try {
        const data      = req.body;
        let token;
        let existUser;
        let message;
        
        const schema    = Joi.object({
            email       : Joi.string().email().required(),
            password    : Joi.string().min(6).required()
        });

        // VALIDATION
        const validateData  = schema.validate(data);

        if (validateData?.error) {
            statusData  = validateData.error.name;
            successCode = badRequestCode.statusCode;
            message     = validateData.error.message;
        }else {

            // CHECK USER
            existUser   = await user.findOne({
                attributes   : {
                    exclude : ['createdAt', 'updatedAt']
                },
                where       : {
                    email   : data.email
                },
            });
            
            if (!existUser) {

                successCode = notFoundCode.statusCode;
                message     = "The email is not registered!";
                statusData  = notFoundCode.statusData;

            }else{
                const { password, id }   = existUser;
                const passwordMatched    = await bcrypt.compare(data.password, password);
                
                if (passwordMatched){
                    statusData  = success.statusData;
                    successCode = success.statusCode;
                    message = success.message;
                    
                    // TOKEN
                    token   = jwt.sign(id, SECRET_KEY);
                }else{
                    successCode = badRequestCode.statusCode;
                    statusData  = badRequestCode.statusData;
                    message     = "There was a problem with your login."
                }
            }
            
        }

        res.status(successCode).send({
            status  : statusData,
            data    : {
                user    : {
                    name    : existUser?.name, 
                    email   : existUser?.email,
                    status  : existUser?.status,
                    id      : existUser?.id,
                    token
                }
            },
            message
        });

    } catch (error) {
        res.status(internalServerCode.statusCode).send({
            status  :   error?.name,
            message :   error?.message
        });
    }
}



exports.checkAuth   = async (req, res) => {
    try {
        const id        = req.user;
        const dataUser  = await user.findOne({
            where       : {
                id
            },
            attributes  : {
                exclude : ['createdAt', 'updatedAt', 'password']
            }
        });
        if (!dataUser) {
            res.status(404).send({
                status  : 'failed'
            });
        }

        res.status(200).send({
            status  : 'success...',
            data    : {
                user    : {
                    id      : dataUser.id,
                    name    : dataUser.name,
                    email   : dataUser.email,
                    status  : dataUser.status
                }
            }
        });
    } catch (error) {
        res.status(500).send({
            status  : 'failed',
            message : error?.message
        })
    }
}