import React from 'react';
import { CgMouse } from 'react-icons/cg';
import "./Home.css"
import {ProductCard} from "./Product/ProductCard.jsx"
import {MetaData} from "../component/MetaData"
import {clearErrors, getProduct} from "../actions/productAction"
import {useSelector,useDispatch} from 'react-redux'
import { useEffect } from 'react';
import Loader from './layout/Loader';
import { useAlert } from 'react-alert';

export const Home = ({match}) => {

    const dispatch = useDispatch();
    const alert=useAlert();
    const {loading,error,products} = useSelector((state)=>state.products)
    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(match.params.id));
    }, [dispatch,match.params.id,error,alert]);
    
  return <>
  {loading ? (<Loader/>):(<><MetaData title="ECOMMERCE" />
    <div className="banner">
        <h2>Welcome to Ecommerce</h2>
        <h1>FIND ALL YOU WANT</h1>
        
        <a href="#container">
            <button>
                Scroll<CgMouse/>
            </button>
        </a>
    </div>
    <h2 className="homeHeading">Featured Prodcuts</h2>
    <div className="container" id="container">
        {products&&products.map((product)=><ProductCard product = {product}/>)}
    </div></>)}
  </>
};
