import React, { useState } from 'react';
import { MetaData } from './MetaData';
import './Search.css'

export const Search = ({history}) => {

    const [keyword,setKeyword]  = useState(" ");

    const searchSubmitHandler = (e)=>{
        e.preventDefault();
        if (keyword.trim()) {
            history.push(`/products/${keyword}`)
        } else {
            history.push(`/products`)
        }
    }


  return <>
  <MetaData title='Search a product -ECOMMERCE' />
  <form className="searchBox" onSubmit={searchSubmitHandler}>
      <input type="text" className='search' placeholder='Search a product...' onChange={(e)=>setKeyword(e.target.value)} />
      <input type="submit" className='submit' value="Search" />
  </form>
  </>;
};
