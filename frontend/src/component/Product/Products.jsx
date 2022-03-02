import React, { useState } from 'react';
import './Products.css'
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getProduct } from "../../actions/productAction"
import Loader from "../layout/Loader"
import { ProductCard } from "./ProductCard"
import { useEffect } from 'react';
import Pagination from 'react-js-pagination';
import { Slider } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { useAlert } from 'react-alert';
import { MetaData } from '../MetaData';

const categories = ['Apple', 'Laptop', 'Mobile', 'Food'];

export const Products = ({ match }) => {

  const dispatch = useDispatch();
  const alert=useAlert();

  const [currentPage, setCurrentPage] = useState(1);

  const [price, setPrice] = useState([0, 20000]);

  const [category, setCategory] = useState();

  const [ratings, setRatings] = useState(0);

  const { products, loading, error, productsCount, resultPerPage, filteredProductsCount } = useSelector((state) => state.products);

  const keyword = match.params.keyword;

  const setCurrentPageNo = (e) => {
    setCurrentPage(e)
  }

  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);
  }

  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category,ratings));
  }, [dispatch, keyword, currentPage, price, category,ratings,alert,error]);

  let count = filteredProductsCount;

  return <>
    {loading ? <Loader /> : (<>
    <MetaData title='PRODUCTS  -ECOMMERCE'/>
      <h1 className="productHeading">Products</h1>
      <div className="products">
        {products && products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {<div className="filterbox">
        <Typography>Price</Typography>
        <Slider value={price}
          onChange={priceHandler}
          valueLabelDisplay='auto'
          aria-labelledby='range-slider'
          min={0}
          max={20000}
        />

        <Typography>Categories</Typography>
        <ul className="categoryBox">
          {categories.map((category) => (
            <li className='categorylink' key={category} onClick={() => setCategory(category)}>{category}</li>
          ))}
        </ul>

        <fieldset>
          <Typography component="legend">Ratings Above</Typography>
          <Slider 
              value={ratings}
              onChange={(e,newRating)=>{
                setRatings(newRating);
              }}
              aria-labelledby="continuous-slider"
              min={0}
              max={5}
              valueLabelDisplay='auto'
          />
        </fieldset>

      </div>}

      {resultPerPage < count && (
        <div className="paginationBox">
          <Pagination activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productsCount}
            onChange={setCurrentPageNo}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="First"
            lastPageText="Last"
            itemClass='page-item'
            linkClass='page-link'
            activeClass='pageItemActive'
            activeLinkClass='pageLinkActive'
          />
        </div>
      )}

    </>)}
  </>;
};
