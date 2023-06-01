import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../domain.js';
import './CreateProfile.css'

function CreateProfile() {

    let { id } = useParams();

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
                    setUserInfo({
                        email: data.email,
                        displayName: data.displayName,
                        userType: data.userType,
                        admin: data.admin,
                        orgs: data.orgs,
                        id : data._id,
                        standing : data.standing,
                        major : data.major,
                        MBTI : data.MBTI,
                        phone : data.phone,
                        workstyle : data.workstyle
                    })
                    // console.log('loaded user information');
                    // console.log(data)
                } else {
                    // console.log(data.error);
                    navigate('/');
                }
            })
    }

    useEffect(() => {
        getUserInfo();
        getQuestionsInfo();
    }, [])

    // these questions can be made somewhere else later
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    function getQuestionsInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/userprofile/questions`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setQuestions(data.questions.questions)
                }
            })
    }


    function createProfile() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orgid: id, userid: userInfo.id, questions: questions, answers: answers})
        }
        fetch(`${domain}/api/userprofile/create`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    // console.log('successfully created user profile')
                    if (userInfo.standing == undefined) updateProfile()
                    navigate('/home')
                } else {
                    // console.log(data.error);
                }
            })
    }

    function updateProfile() {
        const requestOptions = {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ standing: standing, major: major, MBTI: mbti, phone: phone, workstyle: workstyle })
        }
        fetch(`${domain}/api/users/information/${userInfo.id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    // console.log('successfully updated profile')
                } else {
                    // console.log(data.error);
                }
            })
    }

    const [standing, setStanding] = useState('')
    const [major, setMajor] = useState('')
    const [mbti, setMbti] = useState('')
    const [phone, setPhone] = useState('')
    const [workstyle, setWorkstyle] = useState('')

    const [questionNum, setQuestionNum] = useState(0)
    const [flag, setFlag] = useState(0)

    const [markDone, setMarkDone] = useState(false)

    function nextQuestion(a = false, b = null) {
        if (document.querySelector('.createprofile-input').value == '') return
        setQuestionNum(questionNum + 1)
        document.querySelector('.createprofile-input').value = ''
        setProgress(progress + 1)
        if (b != null) {
            setAnswers(arr => [...arr, b])
        }
        if (a) {
            setMarkDone(true)
        }
    }

    function prevQuestionAccount() {
        if (questionNum != 0) {
            setQuestionNum(questionNum - 1)
            document.querySelector('.createprofile-input').value = ''
            setProgress(progress - 1)
        }
    }

    function prevQuestionProfile() {
        if (questionNum != 5) {
            setQuestionNum(questionNum - 1)
            document.querySelector('.createprofile-input').value = ''
            let temp = answers
            temp.pop();
            setAnswers(temp)
            setProgress(progress - 1)
        }
    }

    useEffect(() => {
        if (markDone) {
            createProfile()
        } 
    }, [answers])

    function accountQuestions() {
        if (userInfo.standing == undefined) {
            if (questionNum == 0) {
                return(
                    <div className='createprofile-inputfields'>
                        <h3>What is your Standing?</h3>
                        <input type='text' placeholder='standing' onChange={e => setStanding(e.target.value)} className='createprofile-input'/>
                        <div className='createprofile-buttons'>
                            <button onClick={prevQuestionAccount} className='createprofile-buttons-back'>Back</button>
                            <button onClick={() => nextQuestion()} className='createprofile-buttons-next'>Next</button>
                        </div> 
                    </div>
                )
            } else if (questionNum == 1) {
                return(
                    <div className='createprofile-inputfields'>
                        <h3>What is your major?</h3>
                        <input type='text' placeholder='major' onChange={e => setMajor(e.target.value)} className='createprofile-input'/>
                        <div className='createprofile-buttons'>
                            <button onClick={prevQuestionAccount} className='createprofile-buttons-back'>Back</button>
                            <button onClick={() => nextQuestion()} className='createprofile-buttons-next'>Next</button>
                        </div>
                        
                    </div>
                )
            } else if (questionNum == 2) {
                return(
                    <div className='createprofile-inputfields'>
                        <h3>What is your MBTI?</h3>
                        <input type='text' placeholder='MBTI' onChange={e => setMbti(e.target.value)} className='createprofile-input'/>
                        <div className='createprofile-buttons'>
                            <button onClick={prevQuestionAccount} className='createprofile-buttons-back'>Back</button>
                            <button onClick={() => nextQuestion()} className='createprofile-buttons-next'>Next</button>
                        </div>
                        
                    </div>
                )
            } else if (questionNum == 3) {
                return(
                    <div className='createprofile-inputfields'>
                        <h3>What is your phone number?</h3>
                        <input type='text' placeholder='phone number' onChange={e => setPhone(e.target.value)} className='createprofile-input'/>
                        <div className='createprofile-buttons'>
                            <button onClick={prevQuestionAccount} className='createprofile-buttons-back'>Back</button>
                            <button onClick={() => nextQuestion()} className='createprofile-buttons-next'>Next</button>
                        </div>
                        
                    </div>
                )
            } else if (questionNum == 4) {
                return(
                    <div className='createprofile-inputfields'>
                        <h3>What is your workstyle?</h3>
                        <input type='text' placeholder='workstyle' onChange={e => setWorkstyle(e.target.value)} className='createprofile-input'/>
                        <div className='createprofile-buttons'>
                            <button onClick={prevQuestionAccount} className='createprofile-buttons-back'>Back</button>
                            <button onClick={() => nextQuestion()} className='createprofile-buttons-next'>Next</button>
                        </div>
                        
                    </div>
                )
            }
        } else {
            if (flag == 0) setFlag(1)
            return(
                <></>
            )
        }
    }

    function groupQuestions() {
        if (questionNum >= 5) {
            let i = questionNum - 5
            let isLastQuestion = i == questions.length - 1
            return (
                <div className='createprofile-inputfields'>
                    <h3>{questions[questionNum-5]}</h3>
                    <input type='text' placeholder='answer' className='createprofile-input' id={'createprofile-'+i}/>
                    <div className='createprofile-buttons'>
                        <button onClick={prevQuestionProfile} className='createprofile-buttons-back'>Back</button>
                        <button onClick={() => nextQuestion(isLastQuestion, document.getElementById('createprofile-'+i).value)} className='createprofile-buttons-next'>
                            {isLastQuestion ? 'Submit' : 'Next'}
                        </button>
                    </div>    
                </div>
            )
        } else {
            return(
                <></>
            )
        }
    }

    useEffect(() => {
        if (flag == 1) {
            setQuestionNum(5)
            setTotal(total - 5)
        }
    },[flag])

    useEffect(() => {
        setTotal(questions?.length + 5)
    }, [questions])

    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState()

    return (
        <div className='createprofile'>
            <div className='createprofile-progressbar'>
                <div className='createprofile-progressborder'>
                    <div style={{ width: `${Math.trunc(progress/total*100)}%` }}></div>
                </div>
                <p>{Math.trunc(progress/total*100)}%</p>
            </div>
            {accountQuestions()}
            {groupQuestions()}
        </div>
        
    )
}

export default CreateProfile