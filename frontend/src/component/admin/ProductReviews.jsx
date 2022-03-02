import { DataGrid } from '@material-ui/data-grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./ProductReview.css";
import { useAlert } from 'react-alert';
import { Button } from '@material-ui/core';
import { MetaData } from '../MetaData';
import { Delete,Star } from '@material-ui/icons';
import { Sidebar } from './Sidebar';
import { useEffect } from 'react';
import { getAllReviews, clearErrors, deleteReviews } from '../../actions/productAction';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import { useState } from 'react';

export const ProductReviews = ({ history }) => {
    const dispatch = useDispatch();
    const { error: deleteError, isDeleted } = useSelector((state) => state.review);
    const { error, reviews,loading } = useSelector((state) => state.productReviews);
    const alert = useAlert();

    const [productId, setProductId] = useState("")

    const productReviewSubmitHandler=(e)=>{
        e.preventDefault();
        dispatch(getAllReviews(productId));
    }

    useEffect(() => {
        if(productId.length===24){
            dispatch(getAllReviews(productId));
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success('Review Deleted Successfully');
            history.push('/admin/reviews')
            dispatch({ type: DELETE_REVIEW_RESET })
        }
    }, [dispatch, alert, error, history, isDeleted, deleteError,productId]);

    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReviews(reviewId,productId));
    }


    const columns = [
        { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.7 },
        { field: "user", headerName: "User", minWidth: 200, flex: 0.6 },
        { field: "comment", headerName: "Comment", minWidth: 350, flex: 1 },
        { field: "rating", headerName: "Ratings", type: "number", minWidth: 180, flex: 0.4 },
        {
            field: "action", headerName: "Action", type: "number", sortable: false, minWidth: 100, flex: 0.3, renderCell: (params) => {
                return (<>
                    <Button onClick={() => deleteReviewHandler(params.getValue(params.id, "id"))}><Delete /></Button>
                </>)
            }
        }
    ]

    const rows = [];

    reviews && reviews.forEach((item) => {
        rows.push({
            id: item._id,
            rating: item.rating,
            comment: item.comment,
            user: item.name
        })
    });

    return <>
        <MetaData title={`All Reviews -Admin`} />
        <div className="dashboard">
            <Sidebar />
            <div className="productReviewContainer">
                <form className="productReviewForm" encType='multipart/form-data' onSubmit={productReviewSubmitHandler} >
                    <h1 className='productReviewFormHeading'>All Reviews</h1>
                    <div>
                        <Star />
                        <input type="text" placeholder='Product Id' required value={productId} onChange={(e) => setProductId(e.target.value)} />
                    </div>
                    <Button type="submit" id="createProductBtn" disabled={loading ? true : false || productId === "" ? true : false} >Search </Button>
                </form>
               {reviews&&reviews.length>0?(
                    <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className='productListTable' autoHeight />
               ):(<h1>No Reviews are present</h1>)}
            </div>
        </div>
    </>;
};
