import React from 'react';
import './Cart.css'
import { CartItemCard } from "./CartItemCard.jsx"
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart,removeItemFromCart } from '../../actions/cartAction';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart'
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

export const Cart = ({history}) => {

    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);

    const increaseQuantity = (id, quantity ,stock)=>{
        
        if(stock<=quantity) return;
        
        const newQty = quantity+1;
        
        dispatch(addItemToCart(id,newQty));
    }

    const deccreaseQuantity = (id, quantity ,stock)=>{
        if(1>=quantity) return;
        const newQty = quantity-1;
        dispatch(addItemToCart(id,newQty));
    }

    const deleteItemFromCart=(id)=>{
        dispatch(removeItemFromCart(id))
    }

    const checkOutHandler=()=>{
        history.push("/login?redirect=shipping")
    }



    return <>
    {cartItems.length===0? (<div className='emptyCart'>
        <RemoveShoppingCartIcon/>
        <Typography>Add products to your cart</Typography>
        <Link to="/products">View Product</Link>
    </div>) :(<>
        <div className="cartPage">
            <div className="cartHeader">
                <p>Product</p>
                <p>Quantity</p>
                <p>Subtotal</p>
            </div>

            {cartItems && cartItems.map((item) => (<div className="cartContainer" key={item.product}>
                <CartItemCard item={item} deleteItemFromCart={deleteItemFromCart}/>
                <div className='cartInput'>
                    <button  onClick={()=>deccreaseQuantity(item.product ,item.quantity,item.stock)} >-</button>
                    <input type="number" value={item.quantity} readOnly />
                    <button onClick={()=>increaseQuantity(item.product ,item.quantity,item.stock)} >+</button>
                </div>
                <p className="cartSubtotal">
                    {`₹${item.quantity * item.price}`}
                </p>
            </div>))}

            <div className="cartGrossProfit">
                <div></div>
                <div className="cartGrossProfitBox">
                    <p>Gross Total</p>
                    <p>{`₹${cartItems.reduce(
                        (acc,item) => acc+item.quantity*item.price,0
                    )}`}</p>
                </div>
                <div></div>
                <div className='checkOutBtn'>
                    <button onClick={checkOutHandler}>Check Out</button>
                </div>
            </div>
        </div>
    </>)}
    </>
};
