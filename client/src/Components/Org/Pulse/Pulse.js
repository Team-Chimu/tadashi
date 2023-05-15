import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../../domain.js';
import check from '../../../images/check.png';
import './Pulse.css'


function Pulse() {

    let { id } = useParams();
    let navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({})
    const [orgInfo, setOrgInfo] = useState({})

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
                    // console.log(data.error);
                    navigate('/');
                }
            })
    }

    const [pulseDone, setPulseDone] = useState(false);
    function getPulseInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/pulse/${id}/${orgInfo.weekNumber}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    let totalPeopleThatDidTheirPulse = data.pulseResult.length
                    if (totalPeopleThatDidTheirPulse == orgInfo.members.length) {
                        setPulseDone(true)
                    }
                } else {
                    // console.log(data.error)
                }
            })
    }

    function getOrgInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/org/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    // console.log('successfully got org info');
                    setOrgInfo(data)
                } else {
                    // console.log(data.error)
                }
            })
    }

    function displayWeeks() {
        let weeks = []
        for (let i = orgInfo.weekNumber; i > 0; i--) {
            weeks.push(i)
        }
        return(
            weeks.map((e) => {
                if (e == orgInfo.weekNumber && !pulseDone) {
                    return(
                        <div className='pulse-weeks' key={e} onClick={() => navigate(`${e}`)} style={{backgroundColor:'#00585551'}}>
                            <p style={{color:'black'}}>Week {e}</p>
                        </div>
                    )
                } else {
                    return(
                        <div className='pulse-weeks' key={e} onClick={() => navigate(`${e}`)} style={{backgroundColor:'#005855c4'}}>
                            <p>Week {e}</p>
                            <img src={check}/>
                        </div>
                    )
                }
            })
        )
    }

    useEffect(() => {
        getUserInfo();
        getOrgInfo();
    }, [])

    useEffect(() => {
        getPulseInfo();
    }, [orgInfo])

    return (
        <div className='pulse'>
            <div className='pulse-header'>
                <h1>Pulse</h1>
            </div>
            {displayWeeks()}
        </div>
    )
}

export default Pulse