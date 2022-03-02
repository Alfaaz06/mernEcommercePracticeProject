import React from 'react';
import Carousel from "react-material-ui-carousel";
import './ProductDetails.css'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import { ReviewCard } from '../ReviewCard.js';
import { useEffect } from 'react';
import Loader from '../layout/Loader';
import { useAlert } from 'react-alert';
import { MetaData } from '../MetaData';
import { useState } from 'react';
import { addItemToCart } from '../../actions/cartAction';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core'
import {Rating} from '@material-ui/lab'
import { NEW_REVIEW_RESET } from '../../constants/productConstants';

export const ProductDetails = ({ match }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { product, loading, error } = useSelector((state) => state.productDetails)
    const {success,error:reviewError} = useSelector((state)=>state.newReview)

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);


    const increaseQuantity = () => {
        if (product.Stock <= quantity) return;
        const qty = quantity + 1;
        setQuantity(qty);
    }

    const decreaseQuantity = () => {
        if (1 >= quantity) return;
        const qty = quantity - 1;
        setQuantity(qty);
    }

    const addToCartHandler = () => {
        dispatch(addItemToCart(match.params.id, quantity));
        alert.success("Item add to Cart");
    }

    const reviewSubmitHandler=()=>{
        const myForm =new FormData();
        myForm.set("rating",rating);
        myForm.set("comment",comment);
        myForm.set("productId",match.params.id)

        dispatch(newReview(myForm))
        setOpen(false);
    }

    const submitReviewToggle=()=>{
        open ? setOpen(false) : setOpen(true);
    }

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({type:NEW_REVIEW_RESET});
        }
        dispatch(getProductDetails(match.params.id))
    }, [dispatch, match.params.id, alert, error,reviewError,success]);

    const options = {
        size:"large",
        value: product.ratings,
        readOnly:true,
        precision:0.5
    }

    return <>
        {loading ? <Loader /> : (<>

            <MetaData title={`${product.name} -ECOMMERCE`} />
            <div className="ProductDetails">

                <div>
                    <Carousel>
                        {product.images && product.images.map((item, index) => (
                            <img src={item.url} alt={`${index} slide`} key={item.url} className="CarouselImage" />
                        ))}
                    </Carousel>
                </div>

                <div>
                    <div className="detailsBlock1">
                        <h2>{product.name}</h2>
                        <p>Product #{product._id}</p>
                    </div>
                    <div className="detailsBlock2">
                        <Rating  {...options} />
                        <span>({product.numOfReviews} Reviews)</span>
                    </div>
                    <div className="detailsBlock3">
                        <h1>{`₹${product.price}`}</h1>
                        <div className="detailsBlock3-1">
                            <div className="detailsBlock3-1-1">
                                <button onClick={decreaseQuantity}>-</button>
                                <input type="number" value={quantity} readOnly />
                                <button onClick={increaseQuantity}>+</button>
                            </div>
                            <button disabled={product.Stock < 1 ? true : false} onClick={addToCartHandler}>Add to Cart</button>
                        </div>

                        <p>
                            Status : <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                {product.Stock < 1 ? "OutofStock" : "InStock"}
                            </b>
                        </p>
                    </div>
                    <div className="detailsBlock4">
                        Description : <p>{product.description}</p>
                    </div>

                    <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
                </div>
            </div>
            <h3 className="reviewsHeading">REVIEWS</h3>
            <Dialog aria-labelledby='"simple-dialog-title' open={open} onClose={submitReviewToggle}>
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent className='submitDialog'>
                    <Rating onChange={(e) => setRating(e.target.value)} value={rating} size="large" />
                    <textarea className='submitDialogTextArea' cols="30" rows="5" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                </DialogContent>
                <DialogActions>
                    <Button onClick={submitReviewToggle} color="secondary" >Cancel</Button>
                    <Button onClick={reviewSubmitHandler} color="primary">Submit</Button>
                </DialogActions>
            </Dialog>
            {product.reviews && product.reviews[0] ? (
                <div className="reviews">
                    {product.reviews && product.reviews.map((review) => <ReviewCard review={review} />)}
                </div>) : (
                <p className="noReviews">No Reviews Yet</p>
            )}
        </>)}
    </>
};
