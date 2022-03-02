const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllReviewOfAProduct, deleteReviewOfAProduct, getAdminProducts } = require('../controllers/productcontroller');
const { isAuthenticatedUser, authorized } = require('../middleware/auth');
const router = express.Router();

router.route('/products').get(getAllProducts);
router.route('/admin/product/new').post(isAuthenticatedUser, authorized("admin"), createProduct);
router.route('/admin/products').get(isAuthenticatedUser, authorized("admin"), getAdminProducts);
router.route('/admin/product/:id').put(isAuthenticatedUser, authorized("admin"), updateProduct).delete(isAuthenticatedUser, authorized("admin"), deleteProduct);
router.route('/product/:id').get(getProductDetails);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getAllReviewOfAProduct).delete(isAuthenticatedUser, deleteReviewOfAProduct)


module.exports = router