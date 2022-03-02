import { Typography } from '@material-ui/core';
import React from 'react';
import { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearErrors, getOrderDetails } from '../../actions/orderAction';
import Loader from '../layout/Loader';
import { MetaData } from '../MetaData';
import './OrderDetails.css'

export const OrderDetails = ({ match }) => {
    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const dispatch = useDispatch();
    const alert = useAlert();

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getOrderDetails(match.params.id))
    }, [dispatch, error, alert, match.params.id])



    return <>
        {loading ? (<Loader />) : (<>
            <MetaData title="Order Details" />
            <div className="orderDetailPage">
                <div className='orderDetailContainer'>
                    <h1 className="h1">Order #{order && order._id}</h1>

                    <Typography>Shipping Info</Typography>

                    <div className="orderDetailContainerBox">
                        <div>
                            <p>Name:</p>
                            <span>{order.user && order.user.name}</span>
                        </div>
                        <div>
                            <p>Phone:</p>
                            <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
                        </div>
                        <div>
                            <p>Address:</p>
                            <span>{order.shippingInfo&&`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</span>
                        </div>
                    </div>
                    <Typography>Payment</Typography>
                    <div className="orderDetailContainerBox">
                        <div>
                            <p className={order.paymentInfo && order.paymentInfo.status === "succeeded" ? "greenColor" : "redColor"}>
                                {order.paymentInfo && order.paymentInfo.status === "succeeded" ? "PAID" : 'NOT PAID'}
                            </p>
                        </div>

                        <div>
                            <p>Amount:</p>
                            <span>{order.totalPrice && order.totalPrice}</span>
                        </div>
                    </div>
                    <div className="orderDetailContainerBox">
                        <div>
                            <p
                                className={
                                    order.orderStatus && order.orderStatus === "Delivered" ? "greenColor" : "redColor"
                                }
                            >
                                {order.orderStatus && order.orderStatus}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="orderDetailCartItem">
                    <Typography>Ordered Items:</Typography>
                    <div className="orderDetailCartItemContainer">
                        {order.orderItems && order.orderItems.map((item) => (
                            <div key={item.product}>
                                <img src={item.image} alt="Product" />
                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                <span>{`Quantity x Price :  ${item.quantity*item.price}`}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>)}
    </>; 
};
