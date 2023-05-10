import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { domain } from '../../../domain.js'
import placeholderPic from '../../../images/placeholder-pic.png';
import './StagingCreator.css'

function StagingCreator() {

    let navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState({})
    
    const [teamCount, setTeamCount] = useState(0)
    const [teamInfo, setTeamInfo] = useState([])

    const courseTitle = location.state.courseTitle;
    const quarterOffered = location.state.quarterOffered;
    const name = location.state.name;
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

    function createOrg() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseTitle: courseTitle, quarterOffered: quarterOffered, name: name, accessCode: accessCode })
        }
        fetch(`${domain}/api/org/create`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.status === 'success') {
                    console.log('successfully created org');
                    navigate(`/createprofile/${data.orgid}`)
                    window.location.reload(false)
                } else {
                    console.log('unable to create org');
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
                console.log(data)
                if (data.status === 'success') {
                    if (data.members.length != teamCount) {
                        setTeamInfo(data.members)
                        setTeamCount(teamCount + 1)
                    }
                }
            })
        window.setInterval(() => {
            fetch(`${domain}/api/orgaccesscode/${accessCode}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.status === 'success') {
                    if (data.members.length != teamCount) {
                        setTeamInfo(data.members)
                        setTeamCount(teamCount + 1)
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
        <div className='stagingcreator'>
            <div className='stagingcreator-message'>
                <p>Please make sure everyone in the team has joined the workplace</p>
            </div>
            
            <div className='stagingcreator-accesscode'>
                <p>{accessCode}</p>
            </div>
            <div className='stagingcreator-members'>
            {
                teamInfo.map((m) => {
                    return(
                        <div key={m._id} className='stagingcreator-member'>
                            {m.profilePic == '' ? <img src={placeholderPic} /> : <img src={m.profilePic} /> }
                            <p>{m.firstName} {m.lastName.charAt(0)}.</p>
                        </div>
                    )
                })
            }
            </div>
            <button onClick={createOrg}>create group</button>
        </div>
    )
}

export default StagingCreator