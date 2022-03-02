import { Typography } from '@material-ui/core';
import React from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { CheckoutSteps } from './CheckoutSteps';
import { MetaData } from './MetaData';
import { CreditCard, VpnKey, Event } from '@material-ui/icons'
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios';
import './Payment.css'
import { useRef } from 'react';
// import { clearErrors } from '../actions/userAction';
import {createOrder,clearErrors} from '../actions/orderAction'
import { useEffect } from 'react';

export const Payment = ({ history }) => {

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));


    const dispatch = useDispatch();
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder );

    const order={
        shippingInfo,
        orderItems : cartItems,
        itemsPrice:orderInfo.subtotal,
        taxPrice:orderInfo.tax,
        shippingPrice:orderInfo.shippingCharge,
        totalPrice:orderInfo.totalPrice
    }


    const paymentData={
        amount:Math.round(orderInfo.totalPrice*100)
    }


    const submitHandler = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;

        try {
            const config = { headers: { "Content-Type": "application/json", } };

            const { data } = await axios.post('/api/v1/payment/process',paymentData,config);

            const client_secret = data.client_secret;

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country
                        }
                    }
                }
            });

            if (result.error) {
                payBtn.current.disabled = false;
                alert.error(result.response.data.message)
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo={
                        id:result.paymentIntent.id,
                        status:result.paymentIntent.status
                    }
                    
                    dispatch(createOrder(order))
                    history.push("/success");
                } else {
                    alert.error("There's some error while processing your payment");
                }
            }
        } catch (error) {
            payBtn.current.disabled = false;
            alert.error(error.response.data.message);
        }
    };

    useEffect(() => {
      if(error){
          alert.error(error);
          dispatch(clearErrors());
      }
    }, [dispatch,error,alert]);
    



    return <>
        <MetaData title="Payment" />
        <CheckoutSteps activeStep={2} />
        <div className="paymentContainer">
            <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                <Typography>Card Info</Typography>
                <div>
                    <CreditCard />
                    <CardNumberElement className='paymentInput' />
                </div>
                <div>
                    <Event />
                    <CardExpiryElement className='paymentInput' />
                </div>
                <div>
                    <VpnKey />
                    <CardCvcElement className='paymentInput' />
                </div>
                <input type="submit" value={`Pay- ₹${orderInfo && orderInfo.totalPrice}`} ref={payBtn} className="paymentFormBtn" />
            </form>
        </div>
    </>;
};
