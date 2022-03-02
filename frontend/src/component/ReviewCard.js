import React from 'react';
import {Rating} from '@material-ui/lab'
import profilePng from '../images/profile2.jpg'

export const ReviewCard = ({review}) => {

    const options = {
        size: "large",
        value: review.rating,
        readOnly:true,
        precision:0.5
    }
  return <>
  <div className="reviewCard">
      <div className="imageprofile">
      <img src={profilePng} alt="user" />
      </div>
      <p>{review.name}</p>
      <Rating {...options} />
      <span>{review.comment}</span>
  </div>
  </>
};
