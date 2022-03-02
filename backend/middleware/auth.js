const ErrorHandler = require("../utils/errorhandler");
const asyncError = require("./asyncError");
const User = require("../modles/userModel");
const jwt = require("jsonwebtoken");


exports.isAuthenticatedUser = asyncError(async(req, res, next) => {
    const { token } = req.cookies;
    // console.log(token);
    if (!token) {
        return next(new ErrorHandler("Please login to access this page", 401));
    }

    const decodeDATA = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodeDATA.id);
    next();
});

exports.authorized = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}