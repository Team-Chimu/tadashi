import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { domain } from '../../../domain.js'
import './JoinOrg.css'


function JoinOrg() {

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

  const [accessCode, setAccessCode] = useState('');

  function joinOrgHandler() {
    const requestOptions = {
      credentials: 'include',
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessCode: accessCode })
    }
    fetch(`${domain}/api/orgaccesscode/join`, requestOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('valid access code')
            navigate('/stagingjoiner', {state: {accessCode: accessCode}, replace: false})
            //window.location.reload(false)
        } else if (data.error == 'code does not exist') {
            console.log('access code has expired or does not exist')
        } else {
            console.log('unable to join org');
        }
    })
  }

  useEffect(() => {
      getUserInfo();
  }, [])

  return (
    <div className='joinorg'>
        <div className='joinorg-inputfields'>
            <h3>Enter the access code</h3>
            <input type='text' placeholder='access code' onChange={e => setAccessCode(e.target.value)} id='joinorg-input' />
            <button onClick={joinOrgHandler}>submit</button>
        </div>
    </div>
  )
}

export default JoinOrg