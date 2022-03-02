const Order = require("../modles/orderModel");
const Product = require("../modles/productmodel");
const ErrorHandler = require("../utils/errorhandler");
const asyncErrors = require("../middleware/asyncError");

exports.newOrder = asyncErrors(async(req, res, next) => {

    const { shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order
    });
});

//get  order details of any user 
exports.getUserOrder = asyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("No order found", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
});

//get my orders -- orders of user logged in
exports.getMyOrder = asyncErrors(async(req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
        success: true,
        orders,
    });
});

//get all orders --admin

exports.getAllOrder = asyncErrors(async(req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    });
});

//UPDATE ORDER STATUS  --ADMIN

exports.updateOrder = asyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("No order found", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Order has already been delivered", 400));
    }

    order.orderItems.forEach(async(ordered) => {
        await updateStock(ordered.product, ordered.quantity);
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async(o) => {
            await updateStock(o.product, o.quantity);
        })
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
});

//UPDATE THE STOCK

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

//DELETE ORDER

exports.deleteOrder = asyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("No order found", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});