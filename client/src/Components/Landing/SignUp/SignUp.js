import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { domain } from '../../../domain.js'
import './SignUp.css';

function SignUp() {

    // hook to redirect
    let navigate = useNavigate();

    // variables for email, password, and name
    // values are update when text fields change
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('user')

    // calls /login/signup endpoint
    // if there are no conflicts, signs up user,
    // logs user in, and redirects to home page
    function signUp() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password, firstName: firstName, lastName: lastName, usertype: userType })
        }
        if (password == confirmPassword) {
            fetch(`${domain}/login/signup`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('successfully signed up and signed in')
                    navigate('/profilepic');
                } else {
                    console.log(data.error);
                }
            })
        } else {
            console.log("passwords don't match")
        }
        
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
                    console.log('already logged in');
                    navigate('/home');
                } else {
                    console.log(data.error)
                }
            })
    }

    useEffect(() => {
        checkAuth();
    }, [])

    return (
        <div className='signup'>
            <div className='signup-text'>
                <h2>Welcome!</h2>
                <h2>Please sign up to continue.</h2>
            </div>
            <div className='signup-inputs'>
                <input type='text' placeholder='First Name' onChange={e => setFirstName(e.target.value)} />
                <input type='text' placeholder='Last Name' onChange={e => setLastName(e.target.value)} />
                <input type='text' placeholder='Email' onChange={e => setEmail(e.target.value)} />
                <input type='text' placeholder='Password' onChange={e => setPassword(e.target.value)} />
                <input type='text' placeholder='Confirm Password' onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <button onClick={signUp}>Next</button>
        </div>
    )
}

export default SignUp