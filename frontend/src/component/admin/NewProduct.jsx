import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { MetaData } from '../MetaData';
import './NewProduct.css'
import {clearErrors,createProduct} from '../../actions/productAction'
import {AccountTree,Description,Storage,Spellcheck,AttachMoney} from "@material-ui/icons"
import { Sidebar } from './Sidebar';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import { Button } from '@material-ui/core';

const categories = ['Apple', 'Laptop', 'Mobile', 'Food'];

export const NewProduct = ({history}) => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const {loading,error,success}=useSelector((state)=>state.newProduct)

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagePreview, setimagePreview] = useState([]);

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
        dispatch(createProduct(myForm));
    }

    const createProductImageChange = (e)=>{
        const files=Array.from(e.target.files);
        setImages([]);
        setimagePreview([]);
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

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(success){
            alert.success("Product Created Successfully");
            history.push("/admin/dashboard");
            dispatch({type:NEW_PRODUCT_RESET});
        }
    }, [dispatch,error,alert,history,success]);
    

    
  return <>
  <MetaData title="Create Product" />
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
                  <select onChange={(e)=>setCategory(e.target.value)}>
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
                  {imagePreview.map((image,index)=>(
                      <img src={image} key={index} alt="Product Preview" />
                  ))}
              </div>
              <Button type="submit" id="createProductBtn" disabled={loading?true:false} >Create Product </Button>
          </form>
      </div>
  </div>
  </>;
};
