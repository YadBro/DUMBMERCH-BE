const { user, profile, product } =  require('../../models');
const { success, badRequestCode, notFoundCode, unAuthorizeCode, conflictCode, internalServerCode }   = require('../statuscode');





exports.addUser = async (req, res) =>{
    try {
        const {name, email} = await user.create(req.body, {
        });
        res.send({
            status  : "success",
            data    : {
                user    : {
                    name,
                    email,
                    token   : "asda@DASDSADADWRE"
                }
            }
        });
    } catch (error) {
        res.status(500).send({
            status  : error?.name,
            message : error?.message
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await user.findAll({
            include     : [
                {
                model       : profile,
                as          : 'profile',
                attributes  : {
                    exclude : ['createdAt', 'updatedAt', 'idUser']
                    }
                },
                {
                model       : product,
                as          : 'products',
                attributes  : {
                    exclude : ['createdAt', 'updatedAt', 'idUser']
                    }
                }
            ],
            attributes  : {
                exclude : ['createdAt', 'updatedAt', 'password']
            }
        });
        res.send({
            status  : "success",
            data    : {
                users
            }
        })
    } catch (error) {
        res.status(500).send({
            status  : error?.name,
            message : error?.message
        });
    }
}


exports.getUser = async (req, res) => {
    try {
        const id    = req.params.id;
        const users = await user.findOne({
            where       : {
                id
            },
            include     : [
                {
                model       : profile,
                as          : 'profile',
                attributes  : {
                    exclude : ['createdAt', 'updatedAt', 'idUser']
                    }
                },
                {
                model       : product,
                as          : 'products',
                attributes  : {
                    exclude : ['createdAt', 'updatedAt', 'idUser']
                    }
                }
            ],
            attributes  : {
                exclude : ['createdAt', 'updatedAt', 'password']
            }
        });
        res.send({
            status  : "success",
            data    : {
                users
            }
        })
    } catch (error) {
        res.status(500).send({
            status  : error?.name,
            message : error?.message
        });
    }
}



exports.getUsersSellerProduct = async (req, res) => {
    try {
        const users = await user.findAll({
            include     : [
                {
                model       : product,
                as          : 'products',
                attributes  : {
                    exclude : ['createdAt', 'updatedAt', 'idUser']
                    }
                }
            ],
            where       : {
                status  : 'seller'
            },
            attributes  : {
                exclude : ['createdAt', 'updatedAt', 'password']
            }
        });
        res.send({
            status  : "success",
            data    : {
                users
            }
        })
    } catch (error) {
        res.status(500).send({
            status  : error?.name,
            message : error?.message
        });
    } v                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
}


exports.getUsersBuyerProduct = async (req, res) => {
    try {
        const users = await user.findAll({
            include     : [
                {
                model       : product,
                as          : 'products',
                attributes  : {
                    exclude : ['createdAt', 'updatedAt', 'idUser']
                    }
                }
            ],
            where       : {
                status  : 'buyer'
            },
            attributes  : {
                exclude : ['createdAt', 'updatedAt', 'password']
            }
        });
        res.send({
            status  : "success",
            data    : {
                users
            }
        });
    } catch (error) {
        res.status(500).send({
            status  : error?.name,
            message : error?.message
        });
    }
}


exports.getProfile   = async (req, res) =>{
    try {
        const {id}          = req.params;
        const dataProfile   = await profile.findOne({
            where : {
                id
            }
        });
        res.status(200).send({
        status  : "success",
        data    : {
            profile : dataProfile
        }
        });
    } catch (error) {
        res.status(500).send({
            status  : error?.name,
            message : error?.message
        });
    }
}
exports.updateProfile   = async (req, res) =>{
    try {
        let data        = req.body;
        delete data.name;
        const image     = req.file?.filename;
        data = {
            ...data,
            image
        }
        const {id}          = req.params;
        const dataProfile   = await profile.update(data, {
            where : {
                id
            }
        });
        res.status(200).send({
        status  : "success",
        data    : {
            profile : dataProfile
        }
        });
    } catch (error) {
        res.status(500).send({
            status  : error?.name,
            message : error?.message
        });
    }
}

exports.addProfile   = async (req, res) =>{
    try {
        const data          = req.body;
        const dataProfile   = await profile.create(data);
        res.status(200).send({
        status  : "success",
        data    : {
            profile : dataProfile
        }
        });
    } catch (error) {
        res.status(500).send({
            status  : error?.name,
            message : error?.message
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id    = req.params.id;
        const data = req.body;
        const users = await user.update(data, {
            where       : {
                id
            },
            attributes  : {
                exclude : ['createdAt', 'updatedAt', 'password']
            }
        });
        res.send({
            status  : "success",
            data    : {
                users
            }
        })
    } catch (error) {
        res.status(500).send({
            status  : error?.name,
            message : error?.message
        });
    }
}
