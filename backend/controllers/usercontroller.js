const ErrorHandler = require("../utils/errorhandler");
const User = require("../modles/userModel");
const asyncErrors = require("../middleware/asyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//REGISTER A USER
exports.registerUser = asyncErrors(async(req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale"
    })


    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
        role,
    });

    sendToken(user, 200, res);
});


//LOGIN USER

exports.loginUser = asyncErrors(async(req, res, next) => {
    const { email, password } = req.body;

    //Checking if User has given email and password

    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or Password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or Password", 401));
    }

    sendToken(user, 200, res);

});

//Logut User

exports.logout = asyncErrors(async(req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});

//Forgot Password 
exports.forgetPassword = asyncErrors(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new ErrorHandler("User not found", 404));
    //get password token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If this request was not made by you then, please ignore it.`

    try {

        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
})

//Reset Password
exports.resetPassword = asyncErrors(async(req, res, next) => {

    //creating hash token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password token is invalid or has been expired", 401));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
});

//get user details 

exports.getUserDetails = asyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//update user password 


exports.updatePassword = asyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 401))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords doesn't match", 400))
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
})

//update user profile

exports.updateProfile = asyncErrors(async(req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }





    if (req.body.avatar !== "") {
        const user = await User.findByIdAndUpdate(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        })
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        user
    })
})

//Get all users (admin)

exports.getAllUsers = asyncErrors(async(req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

//get details of single user (admin)

exports.getAUser = asyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`No user exists with id: ${req.params.id}`), 401)
    }

    res.status(200).json({
        success: true,
        user
    })
})

//update role --admin

exports.updateUserRole = asyncErrors(async(req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true
    })
})

//DELETE USER  --ADMIN

exports.deleteUser = asyncErrors(async(req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`No user exists with Id: ${req.params.id}`));
    }

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})