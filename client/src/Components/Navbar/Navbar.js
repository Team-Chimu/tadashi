import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../domain.js'
import './Navbar.css'
import backArrow from '../../images/back-arrow.png'

function Navbar() {

  const navigate = useNavigate();

  const blacklistedPaths = ['/']

  function goHome() {
    navigate('/home')
    window.location.reload(false)
  }

  function signOut() {
    const requestOptions = {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }
    fetch(`${domain}/login/signout`, requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                // console.log('successfully signed out');
                navigate('/');
            } else {
                // console.log('unable to sign out');
            }
        })
  }

  function testing() {
    console.log(window.location.pathname)
  }

  if (!blacklistedPaths.includes(window.location.pathname)) {
    return (
      <div className='navbar'>
        <img src={backArrow} onClick={window.location.pathname == '/home' ? signOut : goHome} />
      </div>
    )
  }
  
}

export default Navbar