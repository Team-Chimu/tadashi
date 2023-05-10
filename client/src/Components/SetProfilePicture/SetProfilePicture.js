import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { domain } from '../../domain.js';
import axios from 'axios';
import placeholderImg from '../../images/placeholder-pic.png';
import './SetProfilePicture.css';

function SetProfilePicture() {

    // hook to redirect
    let navigate = useNavigate();

    // contains user information
    const [userInfo, setUserInfo] = useState({})
    const [sendingImage, setSendingImage] = useState('');
    const [displayingImage, setDisplayingImage] = useState(null);
    const [flag, setFlag] = useState(0)

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
                    console.log('loaded user information');
                    console.log(data)
                } else {
                    console.log(data.error);
                    navigate('/');
                }
            })
    }

    function setProfilePic() {
        const requestOptions = {
            withCredentials: true,
            method: 'PUT',
        }
        if (flag == 1) {
            try {
                axios.put(`${domain}/api/users/setpic`, {image: sendingImage}, requestOptions)
                .then(res => {
                    console.log(res.data)
                    navigate('/home')
                    window.location.reload(false)
                    // setTimeout(() => {
                        
                    // }, 250);
                })
            } catch(e) {
                console.log(e)
            }
        } else {
            console.log('no changes')
        }
    }

    function formatImage(myFile) {
        setFlag(1)
        setDisplayingImage(URL.createObjectURL(myFile))
        let reader = new FileReader()
        reader.readAsDataURL(myFile)
        reader.addEventListener("load", () => {
            setSendingImage(reader.result)
        })
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    useEffect(() => {
        if (userInfo.profilePic !== "") {
            fetch(userInfo.profilePic)
            .then(res => res.blob())
            .then(data => {
                if (data.type == 'image/jpeg') {
                    setDisplayingImage(URL.createObjectURL(data))
                }
                
            })
        }
        
    }, [userInfo])


    return (
        <div className='setprofilepicture'>
            {displayingImage == null ? <img src={placeholderImg}/> : <img src={displayingImage}/> }
            <h2>Add profile picture</h2>
            <label>
                <input type="file" accept='image/*' onChange={e => formatImage(e.target.files[0])}/>
                Choose from library
            </label>
            <button onClick={setProfilePic}>Save image</button>
            <h3 onClick={() => {navigate('/home')
            window.location.reload(false)}}>Skip</h3>
        </div>
    )
}

export default SetProfilePicture