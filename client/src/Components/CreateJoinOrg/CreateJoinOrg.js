import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { domain } from '../../domain.js';
import './CreateJoinOrg.css'

function CreateJoinOrg() {


    let navigate = useNavigate();

    // contains user information
    const [userInfo, setUserInfo] = useState({})

    // calls /api/users/self endpoint
    // to get and set user information
    // navigates to / if user is not authenticated
    function getUserInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/users/self`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setUserInfo(data)
                } else {
                    navigate('/');
                }
            })
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    return (
        <div className='createjoinorg'>
            <div className='createjoinorg-text'>
                <h2>Hello, {userInfo.firstName}!</h2>
            </div>
            <div className='createjoinorg-buttons'>
                <button onClick={() => navigate('/createorg')} className='createjoinorg-buttons-create'>Create Group</button>
                <button onClick={() => navigate('/joinorg')} className='createjoinorg-buttons-join'>Join Group</button>
            </div>
            
        </div>
    )
}

export default CreateJoinOrg