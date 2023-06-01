import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../domain.js'
import './Navbar.css'
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Navbar() {

  const navigate = useNavigate();

  const currentPath = window.location.pathname

  const blacklistedPaths = ['/']
  const nonAuthPahts = ['/signin', '/signup']

  function goToLanding() {
    navigate('/')
  }

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

  if (!blacklistedPaths.includes(currentPath)) {
    if (nonAuthPahts.includes(currentPath)) {
      return (
        <div className='navbar'>
          <ArrowBackIcon onClick={goToLanding} className='navbar-icon'/>
        </div>
      )
    } else {
      return (
        <div className='navbar'>
          <ArrowBackIcon onClick={goHome} className='navbar-icon'/>
          <LogoutIcon onClick={signOut} className='navbar-icon'/>
        </div>
      )
    }
    
  }
  
}

export default Navbar