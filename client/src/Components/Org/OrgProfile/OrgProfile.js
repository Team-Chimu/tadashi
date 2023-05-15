import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { domain } from '../../../domain.js';
import placeholderImg from '../../../images/placeholder-pic.png';
import mail from '../../../images/mail.png';
import phone from '../../../images/phone.png';
import './OrgProfile.css'

function OrgProfile() {

    const [userInfo, setUserInfo] = useState({})
    const [questionsInfo, setQuestionsInfo] = useState({})
    const [teamInfo, setTeamInfo] = useState({})
    const [orgInfo, setOrgInfo] = useState({})

    const cookies = new Cookies();

    const navigate = useNavigate();
    let { id } = useParams();
    let { uid } = useParams();

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

    function getQuestionsInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/userprofile/${id}/${uid}`, requestOptions)
        .then(res => res.json())
        .then(data => {
            setQuestionsInfo(data)
        })
    }

    function getTeammateInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/users/${uid}`, requestOptions)
        .then(res => res.json())
        .then(data => {
            setTeamInfo(data)
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
                    setOrgInfo(data)
                } else {
                    // console.log(data.error)
                }
            })
    }

    function viewedTeam() {

        /*
            if i've already seen everyone:
                return
            else if i haven't seen everyone yet:
                return
            else:
                run api
        */

        let myCookie = cookies.get(userInfo._id)
        let myCookieArr;
        if (myCookie == undefined) {
            myCookieArr = []
        } else {
            myCookieArr = myCookie.split('|')
        }

        if (orgInfo.viewed.includes(userInfo._id)) {
            navigate(`/org/${id}`)
            return;
        } else if (myCookieArr.length != orgInfo.members.length - 1) {
            navigate(`/org/${id}`)
            return
        }
        const requestOptions = {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: userInfo._id })
        }
        fetch(`${domain}/api/org/${id}/viewed`, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            navigate(`/org/${id}`)
        })
    }

    useEffect(() => {
        getUserInfo();
        getTeammateInfo();
        getQuestionsInfo();
        getOrgInfo();
    }, [])

    return (
        <div className='orgprofile'>
            
            <div>
                
                <div className='orgprofile-header'>
                    {teamInfo.profilePic == '' ? <img src={placeholderImg} /> : <img src={teamInfo.profilePic} /> }
                    <h1>{teamInfo.firstName} {teamInfo.lastName}</h1>
                </div>
                
                <div className='orgprofile-about'>
                    <h1 className='orgprofile-sectionlabel'>About:</h1>
                    <div className='orgprofile-about-card'>
                        <p>MBTI: {teamInfo.MBTI}</p>
                        <p>Major: {teamInfo.major}</p>
                        <p>{teamInfo.workstyle}</p>
                        <p>{teamInfo.standing}</p>
                        <p>Class of 2025</p>
                        <p>Golfing</p>
                    </div>
                </div> 

                <div className='orgprofile-contacts'>
                    <h1 className='orgprofile-sectionlabel'>Contacts:</h1>
                    <div className='orgprofile-contacts-card'>
                        <div>
                            <img src={mail} className='orgprofile-contacts-card-mail'/>
                            <img src={phone} className='orgprofile-contacts-card-phone'/>
                        </div>
                        <div>
                            <p>{teamInfo.email}</p>
                            <p>{teamInfo.phone}</p>
                        </div>
                    </div>
                </div>

                <div className='orgprofile-icebreakers'>
                    <h1 className='orgprofile-sectionlabel'>Icebreaker Questions:</h1>
                    {
                        questionsInfo.questions?.map((q, i) => (
                            <div key={i} className='orgprofile-icebreakers-card'>
                                <p className='orgprofile-icebreakers-question'>{q}</p>
                                <p className='orgprofile-icebreakers-answer'>{questionsInfo.answers.at(i)}</p>  
                            </div>
                        ))
                    }
                </div>
                {/* <button onClick={printThings}>test</button> */}
                <button onClick={viewedTeam}>I have read their profile</button>
            </div>
        </div>
    )
}

export default OrgProfile