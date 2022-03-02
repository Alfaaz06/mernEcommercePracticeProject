import React from 'react';
import {CheckCircle} from '@material-ui/icons'
import './Success.css'
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';

export const Success = () => {
  return <>
  <div className="orderSuccess">
      <CheckCircle />
      <Typography>You order has been placed successfully!</Typography>
      <Link to="/orders">View Orders</Link>
    </div>
  </>;
};
