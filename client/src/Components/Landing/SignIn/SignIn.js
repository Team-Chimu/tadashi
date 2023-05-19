import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { domain } from '../../../domain.js'
import './SignIn.css';

function SignIn() {
    // hook to redirect
    let navigate = useNavigate();

    // variables for email, password, and name
    // values are update when text fields change
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    // calls /login/signin endpoint
    // if information is correct, signs user in
    // and calls checkAuth()
    function signIn() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password })
        }
        fetch(`${domain}/login/signin`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    checkAuth();
                } else {
                    // comment out later
                    console.log(data.error);
                }
            })
    }

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
                    // console.log('already logged in');
                    navigate('/home');
                    window.location.reload(false)
                } else {
                    // console.log(data.error)
                }
            })
    }

    useEffect(() => {
        checkAuth();
    }, [])

    return (
        <div className='signin'>
            <div className='signin-text'>
                <h2>Sign In</h2>
            </div>
            <div className='signin-inputs'>
                <input type='text' placeholder='email' onChange={e => setEmail(e.target.value)} />
                <input type='text' placeholder='password' onChange={e => setPassword(e.target.value)} />
            </div>
            <button onClick={signIn}>Sign in</button>
        </div>
    )
}

export default SignIn