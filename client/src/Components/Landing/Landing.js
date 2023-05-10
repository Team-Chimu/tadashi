import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { domain } from '.././../domain.js'
import logo from '../../images/logo.png';
import './Landing.css';

function Landing() {

    // hook to redirect
    let navigate = useNavigate();

    // calls /api/users/self endpoint
    // navigates to /home if user is authenticated
    function checkAuth() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/users/self`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('successfully logged in');
                    navigate('/home');
                } else {
                    console.log(data.error)
                }
            })
    }

    // calls checkAuth() on load to navigate to /home
    useEffect(() => {
        checkAuth();
    }, [])

    return (
        <div className='landing'>
            <h2>Welcome to</h2>
            <div className='landing-imgbackground'>
                <img src={logo}/>
            </div>
            <div className='landing-title'>
                <h1>Chimu</h1>
                <h3>Teams in Motion</h3>
            </div>
            
            <div className='landing-buttons'>
                <button className='landing-buttons-signin' onClick={() => navigate('/signin')}>sign in</button>
                <button className='landing-buttons-signup' onClick={() => navigate('/signup')}>sign up</button>
            </div>

        </div>
    )

}

export default Landing