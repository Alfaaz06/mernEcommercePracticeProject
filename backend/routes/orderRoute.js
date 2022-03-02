const express = require('express');
const { newOrder, getUserOrder, getMyOrder, getAllOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const router = express.Router();
const { isAuthenticatedUser, authorized } = require('../middleware/auth');

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getUserOrder);
router.route("/orders/me").get(isAuthenticatedUser, getMyOrder);
router.route("/admin/orders").get(isAuthenticatedUser, authorized("admin"), getAllOrder);
router.route("/admin/orders/:id").put(isAuthenticatedUser, authorized("admin"), updateOrder).delete(isAuthenticatedUser, authorized("admin"), deleteOrder);


module.exports = router;