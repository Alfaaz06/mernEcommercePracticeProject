import React from 'react';
import { DataGrid } from '@material-ui/data-grid'
import './MyOrders.css'
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, myOrders } from '../../actions/orderAction';
import Loader from '../layout/Loader';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Typography } from '@material-ui/core';
import { MetaData } from '../MetaData';
import {Launch} from '@material-ui/icons'
import { useEffect } from 'react';

export const MyOrders = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error, orders } = useSelector((state) => state.myOrders)
    const { user } = useSelector((state) => state.user);

    const columns = [
        { field: "id", headerName: "Order Id", minWidth: 170, flex: 1 },
        { field: "status", headerName: "Order Id", minWidth: 150, flex: 0.5 },
        { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 115, flex: 0.3 },
        { field: "amount", headerName: "Amount", type: "number", minWidth: 150, flex: 0.5 },
        {
            field: "actions", headerName: "Action", type: "number", minWidth: 115, flex: 0.3, sortable: false, renderCell: (params) => {
                return (
                    <Link to={`/order/${params.getValue(params.id, "id")}`}>
                        <Launch />
                    </Link>
                );
            }
        }
    ];

    const rows = [];

    orders && orders.forEach((item, index) => {
        rows.push({
            itemsQty: item.orderItems.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice,
        })
    });

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(myOrders())
    }, [dispatch, alert, error]);


    return <div>
        <MetaData title={`${user.name}`} />
        {loading ? (<Loader />) : (<>
            <div className="myOrdersPage">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className='myOrdersTable'
                    autoHeight
                />
                <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
            </div>
        </>
        )}
    </div>;
};
