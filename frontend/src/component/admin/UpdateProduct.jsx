import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { MetaData } from '../MetaData';
import './NewProduct.css'
import {clearErrors,updateProduct,getProductDetails} from '../../actions/productAction'
import {AccountTree,Description,Storage,Spellcheck,AttachMoney} from "@material-ui/icons"
import { Sidebar } from './Sidebar';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import { Button } from '@material-ui/core';

export const UpdateProduct = ({history,match}) => {
    const categories = ['Apple', 'Laptop', 'Mobile', 'Food'];
    const dispatch=useDispatch();
    const alert=useAlert();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagePreview, setimagePreview] = useState([]);

    const {loading,error:updateError,isUpdated}=useSelector((state)=>state.product)

    const {error,product}=useSelector((state)=>state.productDetails)

    const productId=match.params.id;


    useEffect(() => {
        if(product && product._id !==productId ){
            dispatch(getProductDetails(productId))
        }else{
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setCategory(product.category);
            setStock(product.Stock);
            setOldImages(product.images);
        }
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(updateError){
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if( isUpdated ){
            alert.success("Product updated Successfully");
            history.push("/admin/products");
            dispatch({type:UPDATE_PRODUCT_RESET});
        }
    }, [dispatch,error,alert,history,isUpdated,productId,product,updateError]);

    const createSubmitFormHandler=(e)=>{
        e.preventDefault();
        const myForm=new FormData();
        myForm.set("name",name);
        myForm.set("price",price);
        myForm.set("description",description);
        myForm.set("category",category)
        myForm.set("Stock",Stock);
        images.forEach((image)=>{
            myForm.append("images",image);
        });
        dispatch(updateProduct( productId, myForm));
    }

    const createProductImageChange = (e)=>{
        const files=Array.from(e.target.files);
        setImages([]);
        setimagePreview([]);
        setOldImages([]);
        files.forEach((file)=>{
            const reader=new FileReader();
            reader.onload=()=>{
                if(reader.readyState===2){
                    setimagePreview((old)=>[...old,reader.result]);
                    setImages((old)=>[...old,reader.result]);
                }
            }
            reader.readAsDataURL(file);
        })
    }

   

    
  return <>
  <MetaData title="Update Product" />
  <div className="dashboard">
      <Sidebar/>
      <div className="newProductContainer">
          <form className="createProductForm" encType='multipart/form-data' onSubmit={createSubmitFormHandler} >
              <h1>Create Product</h1>
              <div>
                  <Spellcheck/>
                  <input type="text" placeholder='Product Name' required value={name} onChange={(e)=>setName(e.target.value)} />
              </div>
              <div>
                  <AttachMoney/>
                  <input type="number" placeholder='Price' required value={price} onChange={(e)=>setPrice(e.target.value)} />
              </div>
              <div>
                  <Description/>
                  <textarea placeholder='Product Description' value={description} onChange={(e)=>setDescription(e.target.value)} cols="30" rows="1"></textarea>
              </div>
              <div>
                  <AccountTree/>
                  <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                      <option value="">Choose Category</option>
                      {categories.map((cate)=>(
                          <option key={cate} value={cate}>
                              {cate}
                          </option>
                      ))}
                  </select>
              </div>
              <div>
                  <Storage/>
                  <input type="number" placeholder='Stock' value={Stock} required onChange={(e)=>setStock(e.target.value)} />
              </div>
              <div id='createProductFromFile'>
                  <input type="file" name='avatar' accept='image/*' onChange={createProductImageChange} multiple />
              </div>

              <div id="createProductFormImage">
                  {oldImages && oldImages.map((image,index)=>(
                      <img src={image.url} key={index} alt="Old Product Preview" />
                  ))}
              </div>

              <div id="createProductFormImage">
                  {imagePreview.map((image,index)=>(
                      <img src={image} key={index} alt="Product Preview" />
                  ))}
              </div>
              <Button type="submit" id="createProductBtn" disabled={loading?true:false} >Update Product </Button>
          </form>
      </div>
  </div>
  </>;
};
