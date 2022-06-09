const { success, badRequestCode, notFoundCode, unAuthorizeCode, conflictCode, internalServerCode }   = require('../statuscode');
const { product, user, category, productCategory } = require('../../models');
const Joi   = require('joi');


let successCode;
let statusData;
let message;

exports.addProduct = async (req, res) => {
    try {
        let data = req.body;
        let products;
        const image = req.file.filename;
        data    = {
            ...data,
            image
        }

        // VALIDATING
        const schema = Joi.object({
            title   : Joi.string().required(),
            decs    : Joi.string().min(10).required(),
            price   : Joi.required(),
            image   : Joi.string().required(),
            qty     : Joi.required(),
            idUser  : Joi.required(),
            category     : Joi.required()
        });

        const validateData  = schema.validate(data);
        const { value }     = validateData;

        if (validateData?.error) {
            successCode = badRequestCode.statusCode;
            statusData  = validateData.error?.name;
            message     = validateData.error?.message;
            products    = value;
        }else {
            const existProducts = await product.findOne({
                where   : {
                    title   : value?.title
                }
            });
            // CHECK IF TITLE is EXIST
            if ( value.title === existProducts?.title ) {
                successCode = conflictCode.statusCode;
                statusData  = conflictCode.statusData;
                message     = conflictCode.message;
                products    = value;
            }else{
                
                // CREATE A NEW PRODUCT
                const newProducts   = await product.create(value);
                
                products = await product.findOne({
                    where   : {
                        title  : value.title
                    },
                    include : {
                        model   : user,
                        as      : 'user',
                        attributes  : {
                            exclude : ['createdAt', 'updatedAt', 'password']
                        }
                    },
                    attributes  : {
                        exclude : ['createdAt', 'updatedAt', 'idUser']
                    }
                });
                successCode = success.statusCode;
                statusData  = success.statusData;
                message     = success.message;
            }
        }
        products    = JSON.parse(JSON.stringify(products));
        res.status(successCode).send({
            status  : statusData,
            data    : {
                product    : {
                    ...products,
                    image   : process.env.PATH_FILE+products.image
                }
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


exports.getProducts = async (req, res) => {
    try {
        const allProducts = await product.findAll({
            include     : {
                model   : category,
                as      : 'categories',
                through : {
                    model   : productCategory,
                    as      : 'bridge',
                    attributes  : {
                        exclude : ['createdAt', 'updatedAt']
                    }
                },
                attributes  : {
                    exclude : ['createdAt', 'updatedAt']
                }
            },
            attributes  : {
                exclude : ['idUser', 'createdAt', 'updatedAt']
            }
        });
        successCode = success.statusCode;
        statusData  = success.statusData;
        message     = success.message;
        res.status(successCode).send({
            status  : statusData,
            data    : {
                products    : allProducts
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


exports.detailProducts  = async (req, res) => {
    try {
        let productDetails;
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
            productDetails  = value;
        }else{
            const isProductExist  = await product.findOne({
                include     : {
                    model       : user,
                    as          : "user",
                    attributes  : {
                        exclude : ["createdAt", "updatedAt", "password"]
                    }
                },
                where       : {
                    id  : value.id
                },
                attributes  : {
                    exclude : ['idUser', 'createdAt', 'updatedAt']
                }
            });
            
            if (isProductExist){
                successCode = success.statusCode;
                statusData = success.statusData;
                message = success.message;
                productDetails = isProductExist
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
                product : productDetails
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

exports.updateProduct  = async (req, res) => {
    try {
        let updateProduct;

        // VALIDATING
        const id    = req.params.id;
        let data    = req.body;
        const image = req.file?.filename;
        data    = {
            id,
            image,
            ...data
        }
        const schema    = Joi.object({
            id      : Joi.number().required(),
            title   : Joi.string(),
            decs    : Joi.string(),
            price   : Joi.number().min(1),
            image   : Joi.string(),
            category: Joi.number(),
            qty     : Joi.number().min(1),
            idUser  : Joi.number()
        });

        const validateData  = schema.validate(data);
        const { value }     = validateData;

        // CHECK ERROR
        if (validateData?.error) {
            successCode     = badRequestCode.statusCode;
            statusData      = validateData.error?.name;
            message         = validateData.error?.message;
            updateProduct   = value;
        }else {

            const existId   = await product.findOne({
                where       : {
                    id  : value.id
                },
                attributes  : {
                    exclude : ['idUser', 'createdAt', 'updatedAt']
                }
            });

            if (existId) {
                updateProduct   = existId;

                // UPDATE A PRODUCT
                const updateProducts = await product.update(value, {
                    where   : {
                        id   : value?.id
                    }
                });
                successCode     = success.statusCode;
                statusData      = success.statusData;
                message         = success.message;

            }else{
                successCode = notFoundCode.statusCode;
                statusData  = notFoundCode.statusData;
                message     = notFoundCode.message;
            }
        }

        res.status(successCode).send({
            status  : statusData,
            data    : {
                product    : updateProduct
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


exports.deleteProduct   = async (req, res) => {
    try {
        let deletedProduct;
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
            deletedProduct  = value;
        }else {

            const existId   = await product.findOne({
                where       : {
                    id  : value.id
                },
                attributes  : {
                    exclude : ['idUser', 'createdAt', 'updatedAt']
                }
            });

            if (existId) {
                
                // DELETED A PRODUCT
                const updateProducts = await product.destroy({
                    where   : {
                        id   : value?.id
                    }
                });
                successCode     = success.statusCode;
                statusData      = success.statusData;
                message         = success.message;
                deletedProduct  = updateProducts;

            }else{
                successCode = notFoundCode.statusCode;
                statusData  = notFoundCode.statusData;
                message     = notFoundCode.message;
            }
        }

        res.status(successCode).send({
            status  : statusData,
            data    : {
                product    : deletedProduct
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