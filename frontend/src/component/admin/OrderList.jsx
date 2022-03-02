import { DataGrid } from '@material-ui/data-grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./productList.css";
import { useAlert } from 'react-alert';
import { Button } from '@material-ui/core';
import { MetaData } from '../MetaData';
import { Delete, Edit } from '@material-ui/icons';
import { Sidebar } from './Sidebar';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import { clearErrors,deleteOrder, getAllOrders } from '../../actions/orderAction';

export const OrderList = ({history}) => {
    const dispatch=useDispatch();
    const {error,orders}=useSelector((state)=>state.allOrders);
    const {error:deleteError, isDeleted}=useSelector((state)=>state.order)
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
            alert.success(' Order Deleted Successfully');
            history.push('/admin/orders')
            dispatch({type:DELETE_ORDER_RESET})
        }
        dispatch(getAllOrders());
    }, [dispatch,alert,error,history,isDeleted,deleteError]);

    const deleteOrderHandler=(id)=>{
        dispatch(deleteOrder(id));
    }
    

    const columns=[
        { field: "id", headerName: "Order Id", minWidth: 200, flex: 1 },
        { field: "status", headerName: "Order Status", minWidth: 150, flex: 1 },
        { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 100, flex: 0.8 },
        { field: "amount", headerName: "Amount", type: "number", minWidth: 150, flex: 0.6 },
        {field:"action",headerName:"Action", type: "number",sortable:false, minWidth:150,flex:0.6,renderCell:(params)=>{
            return(<>
            <Link to={`/admin/order/${params.getValue(params.id,"id")}`}><Edit/></Link>
            <Button onClick={()=>deleteOrderHandler(params.getValue(params.id,"id"))}><Delete/></Button>
            </>)
        }}
    ]

    const rows=[];
    
    orders && orders.forEach((item) => {
        rows.push({
            id:item._id,
            itemsQty:item.orderItems.length,
            amount:item.totalPrice,
           status:item.orderStatus
        })
    });

  return <>
  <MetaData title={`All orders -Admin` }/>
  <div className="dashboard">
      <Sidebar/>
      <div className="productListContainer">
          <h1 className="productListHeading">ALL ORDERS</h1>

          <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick className='productListTable' autoHeight  />
      </div>
  </div>
  </>;
};
