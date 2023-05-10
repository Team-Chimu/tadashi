import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { domain } from '../../../domain.js'
import './CreateOrg.css'


function CreateOrg() {

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
                        id : data._id
                    })
                    console.log('loaded user information');
                    console.log(data)
                } else {
                    console.log(data.error);
                    navigate('/');
                }
            })
    }

    const [courseTitle, setCourseTitle] = useState('');
    const [quarterOffered, setQuarterOffered] = useState('');
    const [name, setName] = useState('');

    function newAccessCode() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ })
        }
        fetch(`${domain}/api/orgaccesscode/create`, requestOptions)
        .then(res => res.json())
        .then(data => {
            navigate(`/stagingcreator`, {state: {courseTitle: courseTitle, quarterOffered: quarterOffered, name: name, accessCode: data.accessCode}, replace: false})
        })
    }

    function deleteAccessCodeAndMakeNewAccessCode() {
        const requestOptions = {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ })
        }
        fetch(`${domain}/api/orgaccesscode/delete`, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            newAccessCode()
        })
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    const [questionNum, setQuestionNum] = useState(0)

    function inputFields() {
        if (questionNum == 0) {
            return(
                <div className='createorg-inputfields'>
                    <h3>Enter the course title</h3>
                    <input type='text' placeholder='course title' onChange={e => setCourseTitle(e.target.value)} className='createorg-input'/>
                    <button onClick={nextQuestion}>next</button>
                </div>
            )
        } else if (questionNum == 1) {
            return(
                <div className='createorg-inputfields'>
                    <h3>Enter the quarter offered</h3>
                    <input type='text' placeholder='quarter offered' onChange={e => setQuarterOffered(e.target.value)} className='createorg-input' />
                    <button onClick={nextQuestion}>next</button>
                </div>
            )
        } else {
            return(
                <div className='createorg-inputfields'>
                    <h3>Enter your group name</h3>
                    <input type='text' placeholder='name' onChange={e => setName(e.target.value)} className='createorg-input' />
                    <button onClick={deleteAccessCodeAndMakeNewAccessCode}>submit</button>
                </div>
            )
        }
    }

    function nextQuestion() {
        setQuestionNum(questionNum + 1)
        document.querySelector('.createorg-input').value = ''
    }

    return (
        <div className='createorg'>
            {inputFields()}
        </div>
    )
}

export default CreateOrg