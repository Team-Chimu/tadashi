import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { domain } from '../../domain.js';
import addTeam from '../../images/add-team.png';
import placeholderImg from '../../images/placeholder-pic.png';
import './Home.css';

function Home() {

    // hook to redirect
    let navigate = useNavigate();

    // contains user information
    const [userInfo, setUserInfo] = useState({})
    
    let counter = 3;
    const colors = {
        1: '#FF8139',
        2: '#FFE481',
        3: '#9EECC8',
    }

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
                    if (data.orgs.length == 0) {
                        navigate('/createjoinorg')
                    }
                } else {
                    // console.log(data.error);
                    navigate('/');
                }
            })
    }

    // calls /login/signout endpoint
    // logs out the user and redirects back to /

    function loadOrgPageHandler(key) {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/userprofile/${key}/${userInfo._id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.error === 'profile not created') {
                    navigate(`/org/${key}`)
                } else {
                    fetch(`${domain}/api/org/${key}`, requestOptions)
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'success') {
                            memberDoneCount(key, data)
                        } else {
                            // console.log(data.error)
                        }
                    })
                }
            }) 
    }

    function memberDoneCount(key, data) {
        let memberCount = data.members.length
        let count = 0;
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        let membersArr = data.members
        for (let i = 0; i < membersArr.length; i++) {
            let uid = membersArr.at(i)._id
            fetch(`${domain}/api/userprofile/${key}/${uid}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    count++
                    if (count == memberCount) {
                        navigate(`/org/${key}`)
                        window.location.reload(false)
                    }
                }
            })
        }
    }

    // load user info when page is loaded
    useEffect(() => {
        getUserInfo();
    }, [])

    // admin view. currently here for placeholder purposes
    if (userInfo.userType === "admin") {
        return (
            <div>
                <h1>Home</h1>
                <h2>Hello, {userInfo.displayName} ({userInfo.userType})</h2>
            </div>
        )
    // normal user view
    } else if (userInfo.userType === "user") {
        return (
            <div className='home'> 
                <div className='home-header'>
                    <h2>Hello, {userInfo.firstName}</h2>
                    <img src={userInfo.profilePic == '' ? placeholderImg : userInfo.profilePic } onClick={() => navigate('/profilepic')}/>
                </div>
                
                <div className='home-teamcards'>
                    {
                        userInfo.orgs.map((item) => {        
                            return (
                                <div className='home-teamcard' key={item._id._id} onClick={() => loadOrgPageHandler(item._id._id)} style={{backgroundColor: colors[counter == 3 ? counter = 1 : ++counter]}}>
                                    <p className='home-teamcard-name'>{item._id.name}</p>
                                    <p className='home-teamcard-quarteroffered'>{item._id.quarterOffered}</p>
                                </div>
                            )
                        })
                    }
                    <div className='home-teamcard' onClick={() => navigate('/createjoinorg')} style={{backgroundColor: colors[counter == 3 ? counter = 1 : ++counter]}} >
                        <img src={addTeam}></img>
                    </div>
                </div>
            </div>
        )
    } else {
        <div>
            <h1>ayo something ain't right</h1>
        </div>
    }
    
}

export default Home