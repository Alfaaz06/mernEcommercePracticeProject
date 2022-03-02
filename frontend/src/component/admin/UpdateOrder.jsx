import { Button, Typography } from '@material-ui/core';
import { AccountTree } from '@material-ui/icons';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getOrderDetails, clearErrors, updateOrder } from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import Loader from '../layout/Loader';
import { MetaData } from '../MetaData';
import { Sidebar } from './Sidebar';
import './UpdateOrder.css'


export const UpdateOrder = ({ history, match }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const [status, setStatus] = useState("");
    const { order, error, loading } = useSelector((state) => state.orderDetails)
    const { error: updateError, isUpdated } = useSelector((state) => state.order)
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (updateError) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Order Updated Successfully");
            dispatch({ type: UPDATE_ORDER_RESET });
        }
        dispatch(getOrderDetails(match.params.id))
    }, [dispatch, error, alert, match.params.id, updateError, isUpdated])

    const processOrder = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("status", status)

        dispatch(updateOrder(match.params.id, myForm));
    }

    return <>{loading ? (<Loader />) : (<>
        <MetaData title="Update Product" />
        <div className="dashboard">
            <Sidebar />
            <div className="newProductContainer">
                <div className="confirmOrderPage"
                style={{display:order.orderStatus==="Delivered"?"block":"grid"}}
                >
                    <div>
                        <div className="confirmShippingArea">
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
                                    <span>{order.shippingInfo && `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</span>
                                </div>
                            </div>
                            <Typography>Payment</Typography>
                        <div className="orderDetailContainerBox">
                            <div>
                                <p>Payment Status</p>
                                <span className={order.paymentInfo && order.paymentInfo.status === "succeeded" ? "greenColor" : "redColor"}>
                                    {order.paymentInfo && order.paymentInfo.status === "succeeded" ? "PAID" : 'NOT PAID'}
                                </span>
                            </div>

                            <div>
                                <p>Amount:</p>
                                <span>{order.totalPrice && order.totalPrice}</span>
                            </div>
                        </div>
                        <Typography>Order Status</Typography>
                        <div className="orderDetailContainerBox">
                            <div>
                                <p>Status : </p>
                                <span
                                    className={
                                        order.orderStatus && order.orderStatus === "Delivered" ? "greenColor" : "redColor"
                                    }
                                >
                                    {order.orderStatus && order.orderStatus}
                                </span>
                            </div>
                        </div>
                        </div>
                        <div className="confirmCartItem">
                            <Typography>Your Cart Items:</Typography>
                            <div className="confirmCartItemContainer">
                                {order.orderItems && order.orderItems.map((item) => (
                                    <div key={item.product}>
                                        <img src={item.image} alt="Product" />
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        <span>{`Quantity x Price :  ${item.quantity * item.price}`}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={{display:order.orderStatus==="Delivered"?"none":"block"}}>
                        <form className="updateProductForm" encType='multipart/form-data' onSubmit={processOrder} >
                            <h1>Process Order</h1>
                            <div>
                                <AccountTree />
                                <select onChange={(e) => setStatus(e.target.value)}>
                                    <option value="">Choose Category</option>
                                    {order.orderStatus==="Processing"&&(<option value="Shipped">Shipped</option>)}
                                    {order.orderStatus==="Shipped"&&(<option value="Delivered">Delivered</option>)}
                                </select>
                            </div>
                            <Button type="submit" id="updateProductBtn" disabled={loading ? true : false || status === "" ? true : false} >Process</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>)}</>
    // <CheckoutSteps activeStep={1} />

};
