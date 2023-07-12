import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { domain } from '../../../domain.js'
import placeholderPic from '../../../images/placeholder-pic.png';
import './StagingJoiner.css'

function StagingJoiner() {
    let navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState({})
    const [teamCount, setTeamCount] = useState(0)
    const [teamInfo, setTeamInfo] = useState([])

    const accessCode = location.state.accessCode;

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
                    console.log(data.error);
                    navigate('/');
                }
            })
    }

    function startHeartbeat() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET',
        }
        fetch(`${domain}/api/orgaccesscode/${accessCode}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data.status === 'success') {
                    if (data.members.length != teamCount) {
                        setTeamInfo(data.members)
                        setTeamCount(teamCount + 1)
                    }
                    if (data.orgid != '') {
                        navigate(`/createprofile/${data.orgid}`)
                        window.location.reload(false)
                    }
                }
            })
        window.setInterval(() => {
            fetch(`${domain}/api/orgaccesscode/${accessCode}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data.status === 'success') {
                    if (data.members.length != teamCount) {
                        setTeamInfo(data.members)
                        setTeamCount(teamCount + 1)
                    }
                    if (data.orgid != '') {
                        navigate(`/createprofile/${data.orgid}`)
                        window.location.reload(false)
                    }
                }
            })
        }, 4000);
    }

    useEffect(() => {
        getUserInfo()
        startHeartbeat()
    }, [])

    return (
        <div className='stagingjoiner'>
            <div className='stagingjoiner-message'>
                <p>Please make sure everyone in the team has joined the workplace</p>
            </div>
            
            <div className='stagingjoiner-accesscode'>
                <p>{accessCode}</p>
            </div>
            <div className='stagingjoiner-members'>
            {
                teamInfo.map((m) => {
                    return(
                        <div key={m._id} className='stagingjoiner-member'>
                            {m.profilePic == '' ? <img src={placeholderPic} /> : <img src={m.profilePic} /> }
                            <p>{m.firstName} {m.lastName.charAt(0)}.</p>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default StagingJoiner