import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../../domain.js';
import edit from '../../../images/edit-grey.png';
import x from '../../../images/x.png';
import useAutosizeTextArea from '../../../Tools/useAutosizeTextArea.js';
import './TeamAgreement.css'

function TeamAgreement() {
    let { id } = useParams();
    let navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({})

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

    const [teamGoals, setTeamGoals] = useState('')
    const [meetingTimes, setMeetingTimes] = useState('')
    const [communicationChannels, setCommunicationChannels] = useState('')
    const [pulse, setPulse] = useState({});

    let weekTable = {
        '1' : 'Monday',
        '2' : 'Tuesday',
        '3' : 'Wednesday',
        '4' : 'Thursday' ,
        '5' : 'Friday',
        '6' : 'Saturday',
        '7' : 'Sunday'
    }

    function createTeamAgreement() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orgid: id, teamGoals: teamGoals, meetingTimes: meetingTimes, communicationChannels: communicationChannels, pulse: pulse })
        }
        fetch(`${domain}/api/teamAgreement/create`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    navigate(`/org/${id}`)
                } else {
                    // console.log(data.error);
                }
            })
    }

    function updateTeamAgreement() {
        const requestOptions = {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orgid: id, teamGoals: teamGoals, meetingTimes: meetingTimes, communicationChannels: communicationChannels, pulse: pulse })
        }
        fetch(`${domain}/api/teamAgreement/edit`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    navigate(`/org/${id}`)
                } else {
                    // console.log(data.error);
                }
            })
    }

    const [hasTeamAgreementInfo, setHasTeamAgreementInfo] = useState(false)

    function getTeamAgreement() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/teamAgreement/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setHasTeamAgreementInfo(true)
                    setTeamGoals(data.teamGoals)
                    setCommunicationChannels(data.communicationChannels)
                    setMeetingTimes(data.meetingTimes)
                    setPulse(data.pulse)
                }
            })
    }

    const [temp1, setTemp1] = useState("")
    const temp1Ref = useRef(null)
    const temp1Ref2 = useRef(null)
    useAutosizeTextArea(temp1Ref.current, temp1)
    useEffect(() => {
        setTemp1(teamGoals)
    }, [teamGoals])
    const [isEditingTeamNorms, setIsEditingTeamNorms] = useState(false)
    function editTeamNorms() {
        function handleSave() {
            setTeamGoals(document.getElementById('teamagreement-teamnorms-input').value)
            setIsEditingTeamNorms(false)
        }
        return(
            <>
                <div className='teamagreement-input-back'>
                    <textarea ref={temp1Ref} 
                                id='teamagreement-teamnorms-input' 
                                className='teamagreement-input-textarea' 
                                defaultValue={teamGoals} 
                                onChange={e => setTemp1(e.target.value)} 
                                style={{ height : temp1Ref2.current?.clientHeight }}/>
                </div>
                <div className='teamagreement-input-button'>
                    <button onClick={handleSave}>Save</button>
                </div>
            </>
        )  
        
    }

    const [temp2, setTemp2] = useState("")
    const temp2Ref = useRef(null)
    const temp2Ref2 = useRef(null)
    useAutosizeTextArea(temp2Ref.current, temp2)
    useEffect(() => {
        setTemp2(communicationChannels)
    }, [communicationChannels])
    const [isEditingCommunicationChannels, setIsEditingCommunicationChannels] = useState(false)
    function editCommunicationChannels() {
        function handleSave() {
            setCommunicationChannels(document.getElementById('teamagreement-communicationchannels-input').value)
            setIsEditingCommunicationChannels(false)
        }
        return(
            <>
                <div className='teamagreement-input-back'>
                    <textarea ref={temp2Ref}
                        id='teamagreement-communicationchannels-input' 
                        className='teamagreement-input-textarea' 
                        defaultValue={communicationChannels}
                        onChange={e => setTemp2(e.target.value)}
                        style={{ height : temp2Ref2.current?.clientHeight }} />
                </div>
                <div className='teamagreement-input-button'>
                    <button onClick={handleSave}>Save</button>
                </div>
            </>
        )  
    }

    const [temp3, setTemp3] = useState("")
    const temp3Ref = useRef(null)
    const temp3Ref2 = useRef(null)
    useAutosizeTextArea(temp3Ref.current, temp3)
    useEffect(() => {
        setTemp3(meetingTimes)
    }, [meetingTimes])
    const [isEditingMeetingTimes, setIsEditingMeetingTimes] = useState(false)
    function editMeetingTimes() {
        function handleSave() {
            setMeetingTimes(document.getElementById('teamagreement-meetingtimes-input').value)
            setIsEditingMeetingTimes(false)
        }
        return(
            <>
                <div className='teamagreement-input-back'>
                    <textarea ref={temp3Ref}
                        id='teamagreement-meetingtimes-input' 
                        className='teamagreement-input-textarea' 
                        defaultValue={meetingTimes}
                        onChange={e => setTemp3(e.target.value)}
                        style={{ height : temp3Ref2.current?.clientHeight }} />
                </div>
                <div className='teamagreement-input-button'>
                    <button onClick={handleSave}>Save</button>
                </div>
            </>
        )  
    }

    const [pulseDay, setPulseDay] = useState(1)
    const [pulseTime, setPulseTime] = useState('00:00')
    const [isEditingPulse, setIsEditingPulse] = useState(false)
    function editPulse() {
        function handleSave() {
            let timeArr = pulseTime.split(':')
            setPulse({
                weekday : pulseDay,
                hour : timeArr[0], 
                minute : timeArr[1]
            })
            setIsEditingPulse(false)
        }
        return(
            <>
                <div className='teamagreement-input-back'>
                    <p className='teamagreement-pulse'>Every: </p>
                    <select className='teamagreement-dayinput' onChange={e => setPulseDay(e.target.value)}>
                        {
                            Object.values(weekTable).map((d, i) => (
                                <option key={i + 1} value={i + 1}>{d}</option>
                            ))
                        }
                    </select>
                    <input type="time" className='teamagreement-timeinput' onChange={e => setPulseTime(e.target.value)}></input>
                </div>
                <div className='teamagreement-input-button'>
                    <button onClick={handleSave}>Save</button>
                </div>
            </>
        )  
    }

    function displayPulse() {
        let weekDay = weekTable[pulse.weekday]
        let hour = parseInt(pulse.hour)
        let minute = pulse.minute
        let ampm = 'AM';
        if (hour == 0) {
            hour += 12
        }
        if (hour > 12) {
            hour -= 12
            ampm = 'PM'
        }
        return(
            <p className='teamagreement-pulse'>Every: {weekDay} {hour}:{minute} {ampm}</p>
        )
    }

    function parseStringToList(bigString) {
        if (bigString == null) return;
        let result = []
        let curr = ''
        for (let i = 0; i < bigString.length; i++) {
            curr += bigString.at(i);
            if (bigString.at(i) == '\n') {
                result.push(curr)
                curr = ''
            }
        }
        result.push(curr)
        return(
            <>
                {
                    result.map((item, i) => {
                        if (item == '\n') {
                            return(
                                <br key={i}/>
                            )
                        } else {
                            return(
                                <p key={i}>{item}</p>
                            )
                        }
                        
                    })
                }
            </> 
        )
    }

    const [signed, setSigned] = useState('')

    useEffect(() => {
        getUserInfo();
        getTeamAgreement();
    }, [])

    return (
        <div className='teamagreement'>
            <div>
                <div className='teamagreement-header'>
                    <h1>Team Agreement</h1>
                    {
                        !hasTeamAgreementInfo ? 
                        <p>
                        Please fill out each section to complete the team agreement.
                        Once you are done, you must enter your signature to continue.
                        </p>
                        :
                        <></>
                    }
                    
                </div>

                <div className='teamagreement-input' >
                    <div className='teamagreement-input-header'>
                        <h2>Team Norms</h2>
                        <img src={!isEditingTeamNorms ? edit : x} onClick={() => setIsEditingTeamNorms(!isEditingTeamNorms)}/>
                    </div>
                    {
                        !isEditingTeamNorms ?
                            teamGoals.length == 0 ? 
                                <></>
                                :
                                <div className='teamagreement-input-back'>
                                    <div ref={temp1Ref2} className='teamagreement-input-content'>
                                        {parseStringToList(teamGoals)}
                                    </div>
                                </div>
                        :
                        editTeamNorms()
                    }     
                </div>
                
                <div className='teamagreement-input'>
                    <div className='teamagreement-input-header'>
                        <h2>Communication Channels</h2>
                        <img src={!isEditingCommunicationChannels ? edit : x} onClick={() => setIsEditingCommunicationChannels(!isEditingCommunicationChannels)}/>
                    </div>
                    {
                        !isEditingCommunicationChannels ?
                            communicationChannels.length == 0 ?
                                <></>
                                :
                                <div className='teamagreement-input-back'>
                                    <div ref={temp2Ref2} className='teamagreement-input-content'>
                                        {parseStringToList(communicationChannels)}
                                    </div>
                                </div>
                                
                        :
                        editCommunicationChannels()
                    }
                </div>
                
                <div className='teamagreement-input'>
                    <div className='teamagreement-input-header'>
                        <h2>Meeting Times</h2>
                        <img src={!isEditingMeetingTimes ? edit : x} onClick={() => setIsEditingMeetingTimes(!isEditingMeetingTimes)}/>
                    </div>
                    {
                        !isEditingMeetingTimes ?
                            meetingTimes.length == 0 ?
                                <></>
                                :
                                <div className='teamagreement-input-back'>
                                    <div ref={temp3Ref2} className='teamagreement-input-content'>
                                        {parseStringToList(meetingTimes)}
                                    </div>
                                </div>
                                
                        :
                        editMeetingTimes()
                    }
                </div>
                
                <div className='teamagreement-input'>
                    <div className='teamagreement-input-header'>
                        <h2>Pulse</h2>
                        <img src={!isEditingPulse ? edit : x} onClick={() => setIsEditingPulse(!isEditingPulse)}/>
                    </div>
                    {
                        !isEditingPulse ?
                            pulse.weekday == null ?
                                <></>
                                :
                                <div className='teamagreement-input-back'>
                                    {displayPulse()}
                                </div>
                        :
                        editPulse()
                    }
                </div>
                <div className='teamagreement-signature'>
                    <p>Enter Your Signature Here:</p>
                    <div className='teamagreement-signature-input'>
                        <textarea onChange={e => setSigned(e.target.value)}/>
                    </div>
                </div>
                
                <button onClick={!hasTeamAgreementInfo ? createTeamAgreement : updateTeamAgreement} 
                        className='teamagreement-submit'
                        disabled={signed == '' ? true : false}>
                    I agree and abide by this team agreement
                </button>
            </div>

            
            
        </div>
    )
}

export default TeamAgreement