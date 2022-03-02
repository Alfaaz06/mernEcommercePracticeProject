const express = require('express');
const { registerUser, loginUser, logout, forgetPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getAUser, updateUserRole, deleteUser } = require('../controllers/usercontroller');
const { isAuthenticatedUser, authorized } = require('../middleware/auth');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/admin/users").get(isAuthenticatedUser, authorized("admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorized("admin"), getAUser).put(isAuthenticatedUser, authorized("admin"), updateUserRole).delete(isAuthenticatedUser, authorized("admin"), deleteUser);



module.exports = router;