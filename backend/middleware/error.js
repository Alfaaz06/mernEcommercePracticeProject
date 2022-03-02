const ErrorHandler = require("../utils/errorhandler");


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    //Mongoose duplicate key error .. when emails are not unique

    if (err.code === 11000) {
        const message = `${Object.keys(err.keyValue)} already exists`
        err = new ErrorHandler(message, 400);
    }

    //Wrong JWT error

    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, try agaiin`;
        err = new ErrorHandler(message, 400);
    }

    //JWT expire error

    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token has expired, try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};