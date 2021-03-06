import React from 'react';
import {Sidebar} from './Sidebar.jsx'
import './Dashboard.css'
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import {Doughnut,Line} from 'react-chartjs-2'
import {useEffect} from 'react';
import  {getAdminProducts} from "../../actions/productAction"
import {useSelector,useDispatch} from 'react-redux'
// eslint-disable-next-line
import Chart from 'chart.js/auto'
import { getAllOrders } from '../../actions/orderAction.js';
import { getAllUsers } from '../../actions/userAction.js';

export const Dashboard = () => {
  const dispatch=useDispatch();

  const {products} = useSelector((state)=>state.products)
  const {orders} = useSelector((state)=>state.allOrders)
  const {users} = useSelector((state)=>state.allUsers)


  let outOfStock = 0;

  products && products.forEach((item) => {
    if (item.Stock===0) {
      outOfStock+=1;
    }
  });

  useEffect(() => {
   dispatch(getAdminProducts());
   dispatch(getAllOrders());
   dispatch(getAllUsers());
  }, [dispatch]);
  
let totalAmount=0;

orders&&orders.forEach((item)=>{
  totalAmount+=item.totalPrice;
})


  const doughnutState={
    labels:["Out of Stock","Instock"],
    datasets:[
      {
        backgroundColor:["#00A6B4","#6800B4"],
        hoverBackgroundColor:["rgb(197,72,89)"],
        data:[outOfStock,products.length-outOfStock] 
      }
    ]
  }

  const lineState={
    labels:["Initial Amount", "Amount Earned"],
    datasets:[
      {
        label: "TOTAL AMOUNT",
        backgroundColor : ['tomato'],
        hoverBackgroundColor:["rgb(107,72,49)"],
        data:[0,totalAmount]
      }
    ]
  }

  return <>
 <div className="dashboard">
  <Sidebar/>
  <div className="dashboardContainer">
    <Typography component="h1">Dashboard</Typography>
    <div className="dashboardSummary">
      <div>
        <p>
          Total Amount <br/> ₹{totalAmount}
        </p>
      </div>
      <div className="dashboardSummaryBox2">
        <Link to="/admin/products">
          <p>Product</p>
          <p>{products && products.length}</p>
        </Link>
        <Link to="/admin/orders">
          <p>Orders</p>
          <p>{orders && orders.length}</p>
        </Link>
        <Link to="/admin/users">
          <p>Users</p>
          <p>{users && users.length}</p>
        </Link>
      </div>
    </div>
    <div className="lineChart">
      <Line data={lineState}/>
    </div>
    <div className="doughnutChart">
      <Doughnut data={doughnutState}  />
    </div>
  </div>
  </div>
  </>;
};
