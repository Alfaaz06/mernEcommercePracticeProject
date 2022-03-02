import React from 'react';
import './Header.css'
import { SpeedDial, SpeedDialAction } from "@material-ui/lab"
import { useState } from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { Backdrop } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard'
import PersonIcon from '@material-ui/icons/Person'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ListAltIcon from '@material-ui/icons/ListAlt'
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import {logout} from '../../actions/userAction'

import { useDispatch, useSelector } from 'react-redux';

export const UserOptions = ({ user }) => {

    const history = useHistory();
    const alert=useAlert();
    const dispatch = useDispatch();
    const {cartItems} = useSelector((state)=>state.cart)

    const options = [
        {icon : <ListAltIcon/>,name:"Orders",func:orders},
        {icon:<PersonIcon/>,name:"Profile",func:account},
        {icon:<ShoppingCartIcon style={{color:cartItems.length>0?"tomato":"unset"}}/>,name:`Cart(${cartItems.length})`,func:toCart},
        {icon: <ExitToAppIcon/>,name:"Logout",func:logoutUser}
    ];

    if(user.role==="admin"){
        options.unshift({icon : <DashboardIcon/>,name:"Dashboard",func:dashboard})
    }

    function dashboard(){
        history.push("/admin/dashboard");
    }

    function orders(){
        history.push("/orders");
    }

    function account(){
        history.push("/account");
    }

    function toCart(){
        history.push("/cart")
    }

    function logoutUser(){
        dispatch(logout());
        alert.success("Logout Successfully");
        history.push("/")
    }

    const [open, setOpen] = useState(false);
    return <>
    <Backdrop open={open} style={{zIndex:"10"}} />
        <SpeedDial
            ariaLabel='SpeedDial tooltip example'
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            style={{zIndex:"11"}}
            open={open}
            direction="down"
            className='speedDial'
            icon={
                <img
                    className='speedDailIcon'
                    src={user.avatar.url ? user.avatar.url : "/profile2.jpg"}
                    alt="Profile"
                />
            }
        >
            
         {options.map((item)=>(
             <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} onClick={item.func}   />
         ))}

        </SpeedDial>
    </>;
};
