import React from 'react';
import "./Footer.css"
import playStore from "../../images/android.png";
import iosStore from "../../images/ios.png";
import instagram from "../../images/instagram.png";
import facebook from "../../images/facebook.png";
import youtube from "../../images/youtube.png";


export const Footer = () => {
  return <>

  <footer id='footer'>
    <div className="leftFooter">
      <h4>DOWNLOAD OUR APP</h4>
      <p>Download our app for Android and Ios mobile phones</p>
      <img src={playStore} alt="playstore"  />
      <img src={iosStore } alt="iosStore"
       />
    </div>

    <div className="midFooter">
      <h1>ECOMMERCE</h1>
      <p>High Quality is our first priority</p>
      <p>Copyrights 2022 &copy;</p>
    </div>

    <div className="rightFooter">
      <h4>Follow Us</h4>
      <a href="http://instagram.com./_.arcane06._"><img src={instagram} alt="instagram" /></a>
      <a href="http://instagram.com./_.arcane06._"><img src={youtube} alt="youtube"/></a>
      <a href="http://instagram.com./_.arcane06._"><img src={facebook} alt="facebook"/></a>
    </div>
    
  </footer>
  </>;
};
