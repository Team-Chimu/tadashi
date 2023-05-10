import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../../../domain.js';
import smallLogo from '../../../../images/small-logo.png';
import './PulseResponse.css'

function PulseResponse() {

    let { id } = useParams();
    let { week } = useParams();
    let navigate = useNavigate();
    
    const [userInfo, setUserInfo] = useState({})
    const [orgInfo, setOrgInfo] = useState({})
    const [pulseInfo, setPulseInfo] = useState({})
    const [pulseStatus, setPulseStatus] = useState(2)
    const [questions, setQuestions] = useState([
        'The workload is equitably distributed?', 
        'The team is communicative and responsive?', 
        'All members of your team regularly participate in meetings?',
        'Team morale and energy is going well',
        'The project is progressing'
    ])
    const [shortQuestions, setShortQuestions] = useState([
        'Workload', 
        'Communication', 
        'Participation',
        'Morale & Energy',
        'Progress'
    ])
    const [answers, setAnswers] = useState([])

    const [hasProblem, setHasProblem] = useState(false)
    const [problemCatagory, setProblemCatagory] = useState([])

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

    function getOrgInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/org/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    // console.log(data)
                    setOrgInfo(data)
                } else {
                    console.log(data.error)
                }
            })
    }

    function getPulseInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/pulse/${id}/${week}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setPulseInfo(data)
                    console.log(data)
                } else {
                    console.log(data.error);
                }
            })
    }

    function createPulse() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questions: questions, answers: answers, week: week })
        }
        fetch(`${domain}/api/pulse/create/${id}/${userInfo._id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.location.reload(false)
                } else {
                    console.log(data.error);
                }
            })
    }

    function handleSubmit() {
        let content = []
        for (let i = 0; i < questions.length; i++) {
            for (let j = 0; j < 4; j++) {
                let buttonthingy = document.getElementById('pulseresponse-input-' + j + '-' + i);
                if (buttonthingy.checked) {
                    content.push(buttonthingy.value)
                }
            }
        }
        setAnswers(content)
    }

    function displayQuestions() {
        return(
            questions?.map((q, i) => {
                return(
                    <div className='pulseresponse-question' key={i}>
                        <h2>{q}</h2>
                        <div>
                            <div className='pulseresponse-radiobox'><input type='radio' id={'pulseresponse-input-0-' + i} value={1} name={'thingies' + i} /><div></div></div>
                            <div className='pulseresponse-radiobox'><input type='radio' id={'pulseresponse-input-1-' + i} value={2} name={'thingies' + i} /><div></div></div>
                            <div className='pulseresponse-radiobox'><input type='radio' id={'pulseresponse-input-2-' + i} value={3} name={'thingies' + i} /><div></div></div>
                            <div className='pulseresponse-radiobox'><input type='radio' id={'pulseresponse-input-3-' + i} value={4} name={'thingies' + i} /><div></div></div>
                        </div>
                    </div>
                    
                )
            })
        )
    }

    function displayDistribution(answerIndex) {
        let answersArr = pulseInfo.pulseResult
        let members = orgInfo.members
        if (answersArr != undefined && members != undefined) {
            let totalPoints = members.length
            let red = 0;
            let yellow = 0;
            let green = 0;
            answersArr.forEach((e) => {
                let answer = e.answers.at(answerIndex)
                if (answer == 1) {
                    red++
                    if (!problemCatagory.includes(answerIndex)) {
                        let temp = problemCatagory
                        temp.push(answerIndex)
                        setProblemCatagory(temp)
                    }
                    if (hasProblem == false) {
                        setHasProblem(true)
                    }
                } else if (answer == 4) {
                    green++
                } else {
                    yellow++
                }
            })
            
            return(
                <div className='pulseresponse-resultsbar'>
                    <div className='pulseresponse-resultsbar-red' style={{ width: `${Math.trunc(red/totalPoints*100)}%` }}></div>
                    <div className='pulseresponse-resultsbar-yellow' style={{ width: `${Math.trunc(yellow/totalPoints*100)}%` }}></div>
                    <div className='pulseresponse-resultsbar-green' style={{ width: `${Math.trunc(green/totalPoints*100)}%` }}></div>
                </div>
            )
        }
    }

    useEffect(() => {
        getUserInfo();
        getPulseInfo();
        getOrgInfo();
    }, [])

    useEffect(() => {
        if (answers.length == questions.length) {
            createPulse()
        }
    }, [answers])

    useEffect(() => {
        let info = pulseInfo.pulseResult
        let members = orgInfo.members
        console.log(pulseStatus)
        if (info != undefined && members != undefined) {
            if (info.length == members.length) {
                setPulseStatus(0)
                return
            }
        }
        
        if (info?.length == 0) {
            setPulseStatus(2)
        }

        info?.forEach(e => {
            if (e.userid == userInfo?._id) {
                setPulseStatus(1)
                return
            } else {
                setPulseStatus(2)
            }
        });
    }, [orgInfo])

    // make 3 if else to check for 
    if (pulseStatus == 0) {
        return (
            <div className='pulseresponse-results'>
                <h1>Week {week}</h1>
                <h1>Pulse Results:</h1>
                <div className='pulseresponse-results-bars'>
                    {
                        shortQuestions.map((e, i) => {
                            return(
                                <div key={i}>
                                    <h2>{e}</h2>
                                    {displayDistribution(i)}
                                </div>
                            )
                        })
                    }
                </div>
                <div className='pulseresponse-results-weeklyreport'>
                    <h2>Weekly Report:</h2>
                    {
                        // find some way to get which bars are not doing good
                        hasProblem ?
                        <p>
                            Please review 
                            {problemCatagory.map((e, i) => {
                                let result = ` ${shortQuestions.at(e)}`
                                if (i == problemCatagory.length - 1) {
                                    result += ' '
                                } else {
                                    if (i + 1 == problemCatagory.length - 1) {
                                        result += ' and'
                                    } else {
                                        result += ','
                                    }
                                }
                                return(
                                    <React.Fragment key={i}>
                                        {result}
                                    </React.Fragment>
                                )
                            })}
                            as a group in the team agreement.
                        </p>
                        :
                        <p>
                            Overall, it appears that your group is on the right track
                            and doing well. Keep it up!
                        </p>
                    }
                </div>
                {
                    hasProblem ?
                    <button style={{ backgroundColor : '#F44B37' }} onClick={() => navigate(`/org/teamagreement/${id}`)}>Take me to the Team Agreement</button>
                    :
                    <button style={{ backgroundColor : '#1f9a42b4' }} onClick={() => navigate(`/org/${id}`)}>Dismiss</button>
                }
            </div>
        )
    } else if (pulseStatus == 1) {
        return (
            <div className='pulseresponse-waiting'>
                <div className='pulseresponse-waiting-header'>
                    <div>
                        <img src={smallLogo} />
                        <p>Chimu</p>
                    </div>
                    <h2>Pulse Completed</h2>
                    <p>Your response has been recorded.</p>
                </div>
                <div className='pulseresponse-waiting-buttons'>
                    <div className='pulseresponse-waiting-button1' onClick={() => navigate(`/org/pulse/${id}`)}>
                        <h2>Go back to Pulse</h2>
                    </div>
                    <div onClick={() => navigate(`/org/${id}`)}>
                        <h2>Go to Dashboard</h2>
                    </div>
                </div>
            </div>
        )
    } else if (pulseStatus == 2) {
        return (
            <div className='pulseresponse-questions'>
                <h1>Week {week}</h1>
                <h1>Pulse Questions:</h1>
                <h2>How are you feeling about your team?</h2>
                {displayQuestions()}
                <button onClick={handleSubmit}>Finish</button>
            </div>
        )
    } else {
        return (
            <div>
                <h1>PulseResponse</h1>
                <h2>Loading</h2>
            </div>
        )
    }
    
}

export default PulseResponse