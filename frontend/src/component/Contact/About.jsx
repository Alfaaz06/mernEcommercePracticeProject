import React from 'react'
import instagram from '../../images/instagram.png'
import facebook from '../../images/facebook.png'
import youtube from '../../images/youtube.png'
import './Contact.css'
import { MetaData } from '../MetaData'

export const About = () => {
  return <>
  <MetaData title={'About Ecommerce'}></MetaData>
  <div className="container1">
      <h1>This is just a practice project of Mern Development</h1>
      <div className="contactData">
          <img src={instagram} alt="instagram" />
          <img src={facebook} alt="facebook"/>
          <img src={youtube} alt="youtube"/>
      </div>
  </div>
  </>
}
