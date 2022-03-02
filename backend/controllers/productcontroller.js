const Product = require("../modles/productmodel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");
const asyncErrors = require("../middleware/asyncError");
const cloudinary = require('cloudinary');


//Create a product -- Admin Route
exports.createProduct = asyncErrors(async(req, res, next) => {
    let images = [];
    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images
    }

    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        })

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })

    }

    req.body.images = imagesLink;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    });
});

//GET ALL PRODUCT

exports.getAllProducts = asyncErrors(async(req, res, next) => {

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    // const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);     to remove pagination

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);


    products = await apiFeature.query.clone();
    res.status(201).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    });
});


//GET ALL PRODUCT ADMIN

exports.getAdminProducts = asyncErrors(async(req, res, next) => {
    const products = await Product.find();
    res.status(201).json({
        success: true,
        products,
    });
});


//GET A PRODUCT

exports.getProductDetails = asyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not found", 404))
    }

    res.status(200).json({
        success: true,
        product
    });
});

//Update Product --Admin Routes

exports.updateProduct = asyncErrors(async(req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not found", 404))
    }

    let images = [];
    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images
    }

    if (images !== undefined) {
        for (let i = 0; i < product.images.length; i++)
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)

        const imagesLink = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            })

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        }
        req.body.images = imagesLink
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    });
});

//DELETE PRODUCT --ADMIN

exports.deleteProduct = asyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not found", 404))
    }

    for (let i = 0; i < product.images.length; i++)
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfullly "
    })

});

//create a new review 

exports.createProductReview = asyncErrors(async(req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString() == req.user._id)
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);

        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }
    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating
    })
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    })

})

//Get all reviews of a product

exports.getAllReviewOfAProduct = asyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new ErrorHandler("Product Not found", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

//delete review

exports.deleteReviewOfAProduct = asyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product Not found", 404))
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = avg / reviews.length;
    if (!ratings) ratings = 0;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, {
        run: true,
        runValidators: true,
        useFindAndModify: false,
    });


    res.status(200).json({
        success: true,
    });
});