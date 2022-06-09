const express = require('express');
const { register, login, checkAuth } = require('../controllers/auth');
const { addCategory, getCategories, detailCategory, updateCategory, deleteCategory } = require('../controllers/category');
const { addProduct, getProducts, detailProducts, updateProduct, deleteProduct } = require('../controllers/product');
const { addTransaction, getTransactions, notification, detailTransaction } = require('../controllers/transaction');
const { getUsers, getUsersSellerProduct, getUsersBuyerProduct, getUser, updateProfile, getProfile, addProfile, updateUser } = require('../controllers/user');

const { auth }  = require('../middlewars/auth');
const { uploadFile } = require('../middlewars/fileUploads');
require('dotenv').config();
const router    = express.Router();

router.post('/register', register);
router.post('/login', login);

// USERS
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateUser);
router.get('/users/seller', getUsersSellerProduct);
router.get('/users/buyer', getUsersBuyerProduct);

// PROFILES
router.get('/profiles/:id', getProfile);
router.patch('/profiles/:id', uploadFile('image'), updateProfile);
router.post('/profiles', addProfile);


// PRODUCTS
router.get('/products', getProducts);
router.get('/products/:id',detailProducts);
router.post('/products', uploadFile('image'), addProduct);
router.patch('/products/:id', uploadFile('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

// CATEGORIES
router.get('/categories', getCategories);
router.get('/categories/:id', detailCategory);
router.post('/categories', addCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// TRANSACTIONS
// router.get('/transactions',getTransactions);
router.get('/transactions/:idBuyer', detailTransaction);
router.post('/transactions', auth, addTransaction);

router.post("/notification", notification);
router.get('/check-auth', auth, checkAuth);

module.exports = router;