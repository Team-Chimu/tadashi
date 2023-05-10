import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { domain } from '../../domain.js';
import './Org.css'
import edit from '../../images/edit.png'
import placeholderPic from '../../images/placeholder-pic.png'
import greenCheck from '../../images/green-check.png'


function Org() {

    const cookies = new Cookies();

    let { id } = useParams();

    // hook to redirect
    let navigate = useNavigate();

    // contains user information
    const [userInfo, setUserInfo] = useState({})
    const [orgInfo, setOrgInfo] = useState({})
    const [displayContents, setDisplayContents] = useState(false)

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
                    // this is to check if the user has filled out the userprofile
                    fetch(`${domain}/api/userprofile/${id}/${data._id}`, requestOptions)
                        .then(res2 => res2.json())
                        .then(data2 => {
                            if (data2.status === 'success') {
                                navigate(`/org/${id}`)
                                setDisplayContents(true)
                            } else {
                                navigate(`/createprofile/${id}`)
                            }
                        })

                } else {
                    console.log(data.error);
                    navigate('/');
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
                    setOrgInfo(data)
                } else {
                    console.log(data.error)
                }
            })
    }

    const [teamAgreementExists, setTeamAgreementExists] = useState(false);

    function getTeamAgreement() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/teamagreement/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setTeamAgreementExists(true)
                } else {
                    console.log(data.error)
                }
            })
    }

    const [pulseInfo, setPulseInfo] = useState({});
    const [pulseDone, setPulseDone] = useState(false);
    const [pulseCount, setPulseCount] = useState(0);
    const [iDidMyPulse, setIDidMyPulse] = useState(false)
    function getPulseInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/pulse/${id}/${orgInfo.weekNumber}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setPulseInfo(data)
                    let totalPeopleThatDidTheirPulse = data.pulseResult.length
                    if (totalPeopleThatDidTheirPulse == orgInfo.members.length) {
                        setPulseDone(true)
                    }

                    setPulseCount(totalPeopleThatDidTheirPulse)
                    for (let i = 0 ; i < totalPeopleThatDidTheirPulse; i++) {
                        let uid = data.pulseResult.at(i).userid
                        if (uid == userInfo._id) {
                            setIDidMyPulse(true)
                        }
                    }
                } else {
                    console.log(data.error)
                }
            })
    }


    
    const [ready1, setReady1] = useState(false)
    function isReady1() {
        // test later
        if (orgInfo.members != undefined) {
            if (orgInfo.members?.length == orgInfo.viewed?.length) {
                    setReady1(true)
                }
        }
        
    }

    const [ready2, setReady2] = useState(false)
    function isReady2() {
        // check if there is a team agreement
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/teamAgreement/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setReady2(true)
                }
            })
    }

    // maybe try and make the text smaller later
    function displayName(firstName, lastInit) {
        let text = firstName + " " + lastInit
        if (text.length > 8) {
            text = text.substring(0, 6) + "..."
        }
        return(
            <p>{text}</p>
        )
    }

    function handleProfileClick(memberId) {
        let myCookie = cookies.get(userInfo._id)
        let myCookieArr;
        if (myCookie == undefined) {
            myCookieArr = []
        } else {
            myCookieArr = myCookie.split('|')
        }
        if (!myCookieArr.includes(memberId)) {
            myCookieArr.push(memberId)
        }
        let result = myCookieArr.join('|')
        cookies.set(userInfo._id, result, {path: '/'})
        navigate(`/org/orgprofile/${id}/${memberId}`)

    }
    function displayMembers() {
        let myCookie = cookies.get(userInfo._id)
        let myCookieArr;
        if (myCookie == undefined) {
            myCookieArr = []
        } else {
            myCookieArr = myCookie.split('|')
        }
        return (
            <div className='org-teammembers'>
                <h2 className='org-subtitle'>Team Members</h2>
                <div className='org-line' />
                <div className='org-members'>
                    {
                        orgInfo.members?.map((member) => {   
                            if (member._id !== userInfo._id ) {
                                return (
                                    <div key={member._id} onClick={() => handleProfileClick(member._id)}>
                                        {
                                            ready1 ? 
                                            <div style={{ border : '3px solid #3CCD2F' }}>
                                                {member.profilePic == '' ? <img src={placeholderPic} /> : <img src={member.profilePic} /> }
                                            </div>
                                            :
                                            <div style={myCookieArr.includes(member._id) ? { border : '3px solid #3CCD2F' } : { border : '3px solid orange' }}>
                                                {member.profilePic == '' ? <img src={placeholderPic} /> : <img src={member.profilePic} /> }
                                            </div>

                                        }
                                        {displayName(member.firstName, member.lastName.charAt(0))}                          
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div> 
        )
    }

    function displayTeamAgreement() {
        return(
            <div className='org-teamagreement'>
                <h2 className='org-subtitle'>Team Agreement</h2>
                <div className='org-line' />
                {/* 
                    if team agreement not completed:
                        yellow complete team agreement
                    else if there is a problem in the pulse && it was not reviewed:
                        red check team agreement
                    else:
                        yellow view team agreement with check mark
                */}
                {
                    !teamAgreementExists ? <button onClick={() => navigate(`/org/teamagreement/${id}`)} disabled={!ready1} className='org-button'>Complete Team Agreement</button>
                    :   false ? <p>there is a problem with the pulse</p>
                    :   <button onClick={() => navigate(`/org/teamagreement/${id}`)} disabled={!ready1} className='org-button'>
                            View Team Agreement
                            <img src={greenCheck} className='org-check'/>
                        </button>
                }
                
            </div>
        )
    }

    function displayPulse() {
        return(
            <div className='org-pulse'>
                <h2 className='org-subtitle'>Pulse</h2>
                <div className='org-line' />
                {/*
                    if team agreement doesn't exist:
                        green button take pulse
                    else if this week's pulse is not completed
                        if i completed the pulse:
                            green button pulse taken: week n, check img n/membercount
                        else:
                            green button take pulse: week n, n/membercount
                    else:
                        green button pulse taken: week n, check img n/membercount
                        green button this week's pulse status bar, view week n pulse results
                */}
                {
                    !teamAgreementExists ? <button disabled={true} className='org-button'><p>Take Pulse: Week {orgInfo.weekNumber}</p> ({pulseCount}/{orgInfo.members.length})</button>
                    :   !pulseDone ? 
                            iDidMyPulse ? 
                            <button onClick={() => navigate(`/org/pulse/${id}`)} disabled={!ready2} className='org-button'>
                                <p>Pulse Taken: Week {orgInfo.weekNumber}</p> 
                                <div>
                                    <img src={greenCheck} className='org-check'/>
                                    ({pulseCount}/{orgInfo.members.length})
                                </div>
                                
                            </button>
                            :
                            <button onClick={() => navigate(`/org/pulse/${id}`)} disabled={!ready2} className='org-button'>
                                <p>Take Pulse: Week {orgInfo.weekNumber}</p>
                                ({pulseCount}/{orgInfo.members.length})
                            </button>
                    :   
                    <>
                        <button onClick={() => navigate(`/org/pulse/${id}`)} disabled={!ready2} className='org-button'>
                            <p>Pulse Completed: Week {orgInfo.weekNumber}</p>
                            <div>
                                <img src={greenCheck} className='org-check'/>
                                ({pulseCount}/{orgInfo.members.length})
                            </div>
                        </button>
                        <div className='org-pulse-info'>
                            <div>
                                <p>This Week</p>
                                {displayDistribution()}
                            </div>
                            <p>View the week {orgInfo.weekNumber} Pulse Results</p>
                        </div>
                    </>
                }
                
            </div>
        )
    }

    function displayDistribution() {
        let answersArr = pulseInfo.pulseResult
        let members = orgInfo.members
        if (answersArr != undefined && members != undefined) {
            let totalPoints = members.length
            let red = 0;
            let yellow = 0;
            let green = 0;
            answersArr.forEach((a) => {
                a.answers.forEach((b) => {
                    if (b == 1) {
                        red++
                    } else if (b == 4) {
                        green++
                    } else {
                        yellow++
                    }
                })
            })
            
            return(
                <div className='org-pulse-resultsbar'>
                    <div className='org-pulse-resultsbar-red' style={{ width: `${Math.trunc(red/totalPoints*100)}%` }}></div>
                    <div className='org-pulse-resultsbar-yellow' style={{ width: `${Math.trunc(yellow/totalPoints*100)}%` }}></div>
                    <div className='org-pulse-resultsbar-green' style={{ width: `${Math.trunc(green/totalPoints*100)}%` }}></div>
                </div>
            )
        }
    }

    function displayPriority() {
        if (!ready1) {
            return(
                <>
                    {displayMembers()}
                    {displayTeamAgreement()}
                    {displayPulse()}
                </>
            )
        } else if (!ready2) {
            return(
                <>    
                    {displayTeamAgreement()}
                    {displayPulse()}
                    {displayMembers()}
                </>
            )
        } else {
            return(
                <>    
                    {displayPulse()}
                    {displayTeamAgreement()}
                    {displayMembers()}
                </>
            )
        }
        
    }

    useEffect(() => {
        getUserInfo();
        getOrgInfo();
        getTeamAgreement();
    }, [])

    useEffect(() => {
        isReady1();
        isReady2();
        getPulseInfo();
    }, [orgInfo])

    if (displayContents) {
        return (
            <div className='org'>
                <div className='org-header'>
                    {/* will change this h2 to an input field later */}
                    <h2>{orgInfo.name}</h2>
                    <img src={edit} />
                </div>
                {displayPriority()}
            </div>
        )
    } else {
        return (
            <h1>Loading</h1>
        )
    }
}

export default Org