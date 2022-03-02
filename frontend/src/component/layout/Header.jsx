import React from 'react';
import {ReactNavbar} from "overlay-navbar"
import logo from "../../images/logo2.png";

const options = {
  burgerColorHover:"tomato",
     logo,
     logoWidth : "15vmax",
     logoHeight:"15vmax",
     navColor1:"rgba(90,90,90,0.6)",
     logoHoverSize:"10px",
     logoHoverColor:"#eb4034",
     link1Text : "Home",
     link2Text : "Product",
     link3Text : "Contact",
     link4Text : "About",
     link1Url : "/",
     link2Url:"/products",
     link3Url : "/contact",
     link4Url : "/about",
     link1Size : "1.5vmax",
     link1Margin : "1vmax",
     profileIconUrl:"/login",
     cartIconUrl:"/cart",
     contactIconUrl:"/contact",
     nav1justifyContent:"flex-end",
     nav2justifyContent:"flex-end",
     nav3justifyContent:"flex-start",
     nav4justifyContent:"flex-start",
     link1ColorHover : "#eb4034",
     profileIconColor:"rgba(35,35,35,0.8)",
     searchIconColor:"rgba(35,35,35,0.8)",
     cartIconColor:"rgba(35,35,35,0.8)",
     cartIconColorHover:"1vmax",
}

export const Header = () => {
  return <><ReactNavbar
  {...options}
     />
     </>;
};
