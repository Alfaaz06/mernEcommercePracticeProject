import { DataGrid } from '@material-ui/data-grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./productList.css";
import  {clearErrors,getAdminProducts,deleteProduct} from "../../actions/productAction"
import { useAlert } from 'react-alert';
import { Button } from '@material-ui/core';
import { MetaData } from '../MetaData';
import { Delete, Edit } from '@material-ui/icons';
import { Sidebar } from './Sidebar';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';

export const ProductList = ({history}) => {
    const dispatch=useDispatch();
    const {error,products}=useSelector((state)=>state.products);
    const {error:deleteError, isDeleted}=useSelector((state)=>state.product)
    const alert = useAlert();

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(deleteError){
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if(isDeleted){
            alert.success('Product Deleted Successfully');
            history.push('/admin/dashboard')
            dispatch({type:DELETE_PRODUCT_RESET})
        }
        dispatch(getAdminProducts());
    }, [dispatch,alert,error,history,isDeleted,deleteError]);

    const deleteProductHandler=(id)=>{
        dispatch(deleteProduct(id));
    }
    

    const columns=[
        {field:"id",headerName:"Product ID", minWidth:200,flex:0.5},
        {field:"name",headerName:"Name", minWidth:150,flex:0.5},
        {field:"stock",headerName:"Stock", type: "number"  , minWidth:150,flex:0.3},
        {field:"price",headerName:"Price", type: "number"  , minWidth:100,flex:0.5},
        {field:"action",headerName:"Action", type: "number",sortable:false, minWidth:150,flex:0.3,renderCell:(params)=>{
            return(<>
            <Link to={`/admin/product/${params.getValue(params.id,"id")}`}><Edit/></Link>
            <Button onClick={()=>deleteProductHandler(params.getValue(params.id,"id"))}><Delete/></Button>
            </>)
        }}
    ]

    const rows=[];
    
    products && products.forEach((item) => {
        rows.push({
            id:item._id,
            stock:item.Stock,
            price:item.price,
            name:item.name
        })
    });

  return <>
  <MetaData title={`All products -Admin` }/>
  <div className="dashboard">
      <Sidebar/>
      <div className="productListContainer">
          <h1 className="productListHeading">ALL PRODUCTS</h1>

          <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className='productListTable' autoHeight  />
      </div>
  </div>
  </>;
};
