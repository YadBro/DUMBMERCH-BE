const { success, badRequestCode, notFoundCode, unAuthorizeCode, conflictCode, internalServerCode }   = require('../statuscode');
const { category, user, product, productCategory } = require('../../models');
const Joi   = require('joi');


let successCode;
let statusData;
let message;

exports.addCategory = async (req, res) => {
    try {
        const data  = req.body;
        let categories;


        // VALIDATING
        const schema = Joi.object({
            name    : Joi.string().required(),
        });

        const validateData  = schema.validate(data);
        const { value }     = validateData;

        if (validateData?.error) {
            successCode = badRequestCode.statusCode;
            statusData  = validateData.error?.name;
            message     = validateData.error?.message;
            categories    = value;
        }else {
            const existCategories = await category.findOne({
                where   : {
                    name    : value?.name
                }
            });
            // CHECK IF CATEGORY NAME is EXIST
            if ( value.name === existCategories?.name ) {
                successCode = conflictCode.statusCode;
                statusData  = conflictCode.statusData;
                message     = conflictCode.message;
                categories  = value;
            }else{
                
                // CREATE A NEW PRODUCT
                const newCategory   = await category.create(value);
                
                categories = await category.findOne({
                    where   : {
                        name    : value.name
                    },
                    attributes  : {
                        exclude : ['createdAt', 'updatedAt']
                    }
                });
                successCode = success.statusCode;
                statusData  = success.statusData;
                message     = success.message;
            }
        }

        res.status(successCode).send({
            status  : statusData,
            data    : {
                category  : categories
            },
            message
        });
    } catch (error) {
        statusData  = error.name || internalServerCode.statusData;
        message     = error.message || internalServerCode.message;
        res.status(internalServerCode.statusCode).send({
            status  : statusData,
            data    : {},
            message
        });
    }
}


exports.getCategories   = async (req, res) => {
    try {
        const allCategories = await category.findAll({
            attributes  : {
                exclude : ['createdAt', 'updatedAt']
            }
        });

        successCode = success.statusCode;
        statusData  = success.statusData;
        message     = success.message;

        res.status(successCode).send({
            status  : statusData,
            data    : {
                categories  : allCategories
            },
            message
        });

    } catch (error) {
        statusData  = error.name;
        message     = error.message;
        res.status(internalServerCode.statusCode).send({
            status  : statusData,
            data    : {},
            message
        });
    }
}


exports.detailCategory  = async (req, res) => {
    try {
        let categoryDetail;
        const data      = req.params;
        const schema    = Joi.object({
            id  : Joi.number().required()
        });
        
        // VALIDATING DATA
        const validateData  = schema.validate(data);
        const {value}   = validateData;
        if (validateData?.error){
            successCode     = badRequestCode.statusCode;
            statusData      = validateData.error?.name;
            message         = validateData.error?.message;
            categoryDetail  = value;
        }else{
            const isCategoryExist   = await category.findOne({
                where       : {
                    id  : value.id
                },
                attributes  : {
                    exclude : ['createdAt', 'updatedAt']
                }
            });
            
            if (isCategoryExist){
                successCode = success.statusCode;
                statusData = success.statusData;
                message = success.message;
                categoryDetail = isCategoryExist
            }else{
                successCode = notFoundCode.statusCode;
                statusData = notFoundCode.statusData;
                message = notFoundCode.message;
            }
        }

        // RESPONSE
        res.status(successCode).send({
            status  : statusData,
            data    : {
                category    : categoryDetail
            },
            message
        });

    } catch (error) {
        statusData  = error.name || internalServerCode.statusData;
        message     = error.message || internalServerCode.message;
        res.status(internalServerCode.statusCode).send({
            status  : statusData,
            data    : {},
            message
        });
    }
}

exports.updateCategory  = async (req, res) => {
    try {
        let updatedCategory;

        // VALIDATING
        const id    = req.params.id;
        let data    = req.body;
        console.log(data);
        data    = {
            id,
            ...data
        }

        const schema    = Joi.object({
            id      : Joi.number().required(),
            name    : Joi.string().required()
        });
        
        const validateData  = schema.validate(data);
        const { value }     = validateData;
        
        // CHECK ERROR
        if (validateData?.error) {
            successCode     = badRequestCode.statusCode;
            statusData      = validateData.error?.name;
            message         = validateData.error?.message;
            updatedCategory  = value;
        }else {
            const existId   = await category.findOne({
                where       : {
                    id  : value.id
                },
                attributes  : {
                    exclude : ['createdAt', 'updatedAt']
                }
            });

            if (existId) {
                // UPDATE A CATEGORY
                const updatecategory = await category.update(value, {
                    where   : {
                        id  : value?.id
                    }
                });
                

                successCode     = success.statusCode;
                statusData      = success.statusData;
                message         = success.message;
                updatedCategory   = value;

            }else{
                successCode = notFoundCode.statusCode;
                statusData  = notFoundCode.statusData;
                message     = notFoundCode.message;
            }
        }

        res.status(successCode).send({
            status  : statusData,
            data    : {
                category    : updatedCategory
            },
            message
        });
    } catch (error) {
        statusData  = error.name || internalServerCode.statusData;
        message     = error.message || internalServerCode.message;
        res.status(internalServerCode.statusCode).send({
            status  : statusData,
            data    : {},
            message
        });
    }
}


exports.deleteCategory   = async (req, res) => {
    try {
        let deletedCategory;
        let data        = req.params;
        
        // VALIDATING
        const schema    = Joi.object({
            id      : Joi.number().required(),
        });

        const validateData  = schema.validate(data);
        const { value }     = validateData;

        // CHECK ERROR
        if (validateData?.error) {
            successCode     = badRequestCode.statusCode;
            statusData      = validateData.error?.name;
            message         = validateData.error?.message;
            deletedCategory  = value;
        }else {

            const existId   = await category.findOne({
                where       : {
                    id  : value.id
                },
                attributes  : {
                    exclude : ['idUser', 'createdAt', 'updatedAt']
                }
            });

            if (existId) {
                
                // DELETED A PRODUCT
                const updateCategories = await category.destroy({
                    where   : {
                        id   : value?.id
                    }
                });
                successCode     = success.statusCode;
                statusData      = success.statusData;
                message         = success.message;
                deletedCategory  = updateCategories;

            }else{
                successCode = notFoundCode.statusCode;
                statusData  = notFoundCode.statusData;
                message     = notFoundCode.message;
            }
        }

        res.status(successCode).send({
            status  : statusData,
            data    : {
                category    : deletedCategory
            },
            message
        });
    } catch (error) {
        statusData  = error.name || internalServerCode.statusData;
        message     = error.message || internalServerCode.message;
        res.status(internalServerCode.statusCode).send({
            status  : statusData,
            data    : {},
            message
        });
    }
}