
import React from 'react'
import { Link } from 'react-router-dom'
import './PageNotFound.css'

export const PageNotFound = () => {
  return (
    <div className='PageNotFound'>
        <h1 className='ErrorHeader'>PAGE NOT FOUND</h1>
        <Link to="/" className='ToPage'>Home</Link>
        </div>
  )
}
