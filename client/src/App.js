import './App.css';
import Navbar from './Components/Navbar/Navbar.js';
import Landing from './Components/Landing/Landing.js';
import SignUp from './Components/Landing/SignUp/SignUp.js';
import SignIn from './Components/Landing/SignIn/SignIn.js';
import SetProfilePicture from './Components/SetProfilePicture/SetProfilePicture.js';
import Home from './Components/Home/Home.js';
import Org from './Components/Org/Org.js';
import CreateProfile from './Components/CreateProfile/CreateProfile.js';
import CreateJoinOrg from './Components/CreateJoinOrg/CreateJoinOrg.js';
import CreateOrg from './Components/CreateJoinOrg/CreateOrg/CreateOrg.js';
import JoinOrg from './Components/CreateJoinOrg/JoinOrg/JoinOrg.js';
import StagingCreator from './Components/Staging/StagingCreator/StagingCreator.js';
import StagingJoiner from './Components/Staging/StagingJoiner/StagingJoiner.js';
import OrgProfile from './Components/Org/OrgProfile/OrgProfile.js';
import PageNotFound from './Components/PageNotFound/PageNotFound.js';
import TeamAgreement from './Components/Org/TeamAgreement/TeamAgreement.js';
import Pulse from './Components/Org/Pulse/Pulse.js';
import PulseResponse from './Components/Org/Pulse/PulseResponse/PulseResponse.js';
import { Route, Routes } from 'react-router';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/signin' element={ < SignIn /> } />
                <Route path='/signup' element={ <SignUp /> } />
                <Route path='/profilepic' element={ <SetProfilePicture /> } />
                <Route path='/home' element={<Home />} />
                <Route path='/createjoinorg' element={< CreateJoinOrg /> }/>
                <Route path='/createorg' element={<CreateOrg /> }/>
                <Route path='/joinorg' element={<JoinOrg /> } />
                <Route path='/stagingcreator' element={<StagingCreator />} />
                <Route path='/stagingjoiner' element={<StagingJoiner />} />
                <Route path='/org/:id' element={<Org /> } />
                <Route path='/org/orgprofile/:id/:uid' element={ <OrgProfile /> } />
                <Route path='/org/teamagreement/:id' element={ <TeamAgreement /> } />
                <Route path='/org/pulse/:id' element={ <Pulse /> } />
                <Route path='/org/pulse/:id/:week' element={ <PulseResponse /> } />
                <Route path='/createprofile/:id' element={<CreateProfile /> } />
                <Route path='*' element={<PageNotFound />} />
            </Routes>
            <Navbar />
        </div>
    );
}

export default App;
