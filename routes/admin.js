import express from 'express';
var router = express.Router();

/*
    body:
    {
        SUPER_SECRET_PASSWORD
    }
*/

router.get('/currentweek', async (req, res) => {
    try {
        let orgs = await req.db.Org.find()

        if (orgs.length == 0) {
            res.json({
                status: 'error',
                error: 'no orgs found'
            });
            return
        }

        let currentWeek = orgs[0].weekNumber
        
        res.json({
            status: 'success',
            currentWeek: currentWeek
        })
        return
    } catch (e) {
        res.json({
            status: 'error',
            error: 'error'
        });
    }
})

router.put('/updateweek', async (req, res) => {
    if (process.env.SUPER_SECRET_PASSWORD != req.body.SUPER_SECRET_PASSWORD) {
        res.json({
            status: 'error',
            message: 'you are not Nam-ho'
        })
        return
    }
    try {

        let orgs = await req.db.Org.find()
        if (orgs.length == 0) {
            res.json({
                status: 'error',
                error: 'no orgs found'
            });
            return
        }
        
        let weekNum = req.body.updatedWeek
        
        await req.db.Org.updateMany(
            {},
            {weekNumber : weekNum}
        )

        res.json({
            status: 'success',
        })
    } catch (e) {
        res.json({
            status: 'error',
            error: 'error'
        });
    }
})

router.post('/questions', async (req, res) => {
    if (process.env.SUPER_SECRET_PASSWORD != req.body.SUPER_SECRET_PASSWORD) {
        res.json({
            status: 'error',
            message: 'you are not Nam-ho'
        })
        return
    }
    try {
        await req.db.Questions.deleteMany()

        await req.db.Questions.create({
            questions: req.body.questions
        });

        res.json({
            status: 'success',
        })
    } catch (e) {
        res.json({
            status: 'error',
            error: 'error'
        });
    }
})

router.delete('/boom', async (req, res) => {
    if (process.env.SUPER_SECRET_PASSWORD != req.body.SUPER_SECRET_PASSWORD) {
        res.json({
            status: 'error',
            message: 'you are not Nam-ho'
        })
        return
    }
    try {
        // delete users
        await req.db.User.deleteMany();

        // delete userProfiles
        await req.db.UserProfile.deleteMany();

        // delete orgs
        await req.db.Org.deleteMany();

        // delete orgAccessCodes
        await req.db.OrgAccessCode.deleteMany();

        // delete teamAgreements
        await req.db.TeamAgreement.deleteMany();

        // delete pulses
        await req.db.Pulse.deleteMany();

        res.json({
            status: 'success',
            message: 'database has been boomed'
        })
        return;
    } catch (e) {
        res.json({
            status: 'error',
            error: 'something went wrong'
        });
        return;
    }

})

router.post("/exportdata", async (req, res) => {
    if (process.env.SUPER_SECRET_PASSWORD != req.body.SUPER_SECRET_PASSWORD) {
        res.json({
            status: 'error',
            message: 'you are not Nam-ho'
        })
        return
    }
    let allOrgs = await req.db.Org.find()
        .populate("members", "_id email firstName lastName standing major phone")

    let result = []

    for (let i = 0; i < allOrgs.length; i++) {
        let orgObj = new Object()
        let org = allOrgs.at(i)

        orgObj.orgid = String(org._id)
        orgObj.groupName = org.name
        orgObj.courseTitle = org.courseTitle
        orgObj.quarter = org.quarterOffered
        
        let teamAgreement = await req.db.TeamAgreement.find({
            orgid : String(org._id)
        })

        
        if (teamAgreement.length == 1) {
            let teamAgreementObj = new Object()
            teamAgreementObj.teamGoals = teamAgreement.at(0).teamGoals
            teamAgreementObj.meetingTimes = teamAgreement.at(0).meetingTimes
            teamAgreementObj.communicationChannels = teamAgreement.at(0).communicationChannels
            orgObj.teamAgreement = teamAgreementObj
        }

        let members = org.members
        let memArr = []
        for (let j = 0; j < members.length; j++) {
            let memObj = new Object()
            let member = members.at(j)
            memObj.email = member.email
            memObj.firstName = member.firstName
            memObj.lastName = member.lastName
            memObj.standing = member.standing
            memObj.major = member.major
            memObj.phone = member.phone
            
            let pulse = await req.db.Pulse.find({
                orgid : String(org._id),
                userid : String(member._id)
            })

            if (pulse.length != 0) {
                console.log(pulse)
                let pulseArr = []
                
                for (let k = 0; k < pulse.length; k++) {
                    let pulse2 = pulse.at(k)
                    let pulseObj = new Object()
                    pulseObj.week = pulse2.week
                    pulseObj.workload = pulse2.answers.at(0)
                    pulseObj.communication = pulse2.answers.at(1)
                    pulseObj.participation = pulse2.answers.at(2)
                    pulseObj.morale = pulse2.answers.at(3)
                    pulseObj.progress = pulse2.answers.at(4)
                    pulseArr.push(pulseObj)
                }
                memObj.pulse = pulseArr
            }
            memArr.push(memObj)
        }
        orgObj.members = memArr

        result.push(orgObj)
    }

    res.json({
        status: 'success',
        message: result
    })
    return
})


/*

    body:
        {
            SUPER_SECRET_PASSWORD
        }

*/
router.post('/testaccounts', async (req, res) => {
    if (process.env.SUPER_SECRET_PASSWORD != req.body.SUPER_SECRET_PASSWORD) {
        res.json({
            status: 'error',
            message: 'you are not Nam-ho'
        })
        return
    }

    // 2 accounts
    let user1 = await req.db.User.create({
        email: "email1",
        firstName: "firstname1",
        lastName: "lastname1",
        userType: "user",
        hash: "hash1",
        salt: "salt1",
        admin: [],
        orgs: [],
        standing: "standing1",
        major: "major1",
        MBTI: "MBTI1",
        phone: "phone1",
        workstyle: "workstyle1"
        // no profile pic
    })

    let user2 = await req.db.User.create({
        email: "email2",
        firstName: "firstname2",
        lastName: "lastname2",
        userType: "user",
        hash: "hash2",
        salt: "salt2",
        admin: [],
        orgs: [],
        standing: "standing2",
        major: "major2",
        MBTI: "MBTI2",
        phone: "phone2",
        workstyle: "workstyle2"
        // no profile pic
    })

    // group
    let org = await req.db.Org.create({
        name: "testorg",
        admin: user1,
        courseTitle: "INFO 491",
        quarterOffered: "AU 23",
        members: [user1, user2],
        viewed: [user1, user2],
        weekNumber: 2
    });

    await req.db.User.findByIdAndUpdate(
        user1._id,
        { 
            $push:
            { 
                admin: org._id,
                orgs: {
                    _id : org._id,
                    name : org.name
                }
            }
        })

    await req.db.User.findByIdAndUpdate(
        user2._id,
        { 
            $push:
            { 
                orgs: {
                    _id : org._id,
                    name : org.name
                }
            }
        })

    // user profile
    await req.db.UserProfile.create({
        userid: user1,
        orgid: org,
        questions: ["question1", "question2", "question3"],
        answers: ["answer1", "answer2", "answer3"],
    })

    await req.db.UserProfile.create({
        userid: user2,
        orgid: org,
        questions: ["question1", "question2", "question3"],
        answers: ["answer1", "answer2", "answer3"],
    })

    // team agreement
    await req.db.TeamAgreement.create({
        orgid: org._id,
        teamGoals: "make ian proud",
        meetingTimes: "everyday",
        communicationChannels: "discord",
        pulse: {
            weekday: "monday",
            hour: "1",
            minute: "30"
        }
    })

    // 2 pulses
    await req.db.Pulse.create({
        orgid: org._id,
        userid: user1._id,
        questions: ["The workload is equitably distributed?",
         "The team is communicative and responsive?", 
        "All members of your team regularly participate in meetings?",
        "Team morale and energy is going well",
        "The project is progressing"],
        answers: ["5", "5", "5", "5", "5"],
        week: 1
    })

    await req.db.Pulse.create({
        orgid: org._id,
        userid: user1._id,
        questions: ["The workload is equitably distributed?",
         "The team is communicative and responsive?", 
        "All members of your team regularly participate in meetings?",
        "Team morale and energy is going well",
        "The project is progressing"],
        answers: ["5", "5", "5", "5", "5"],
        week: 2
    })

    await req.db.Pulse.create({
        orgid: org._id,
        userid: user2._id,
        questions: ["The workload is equitably distributed?",
         "The team is communicative and responsive?", 
        "All members of your team regularly participate in meetings?",
        "Team morale and energy is going well",
        "The project is progressing"],
        answers: ["5", "5", "5", "5", "5"],
        week: 1
    })

    await req.db.Pulse.create({
        orgid: org._id,
        userid: user2._id,
        questions: ["The workload is equitably distributed?",
         "The team is communicative and responsive?", 
        "All members of your team regularly participate in meetings?",
        "Team morale and energy is going well",
        "The project is progressing"],
        answers: ["5", "5", "5", "5", "5"],
        week: 2
    })


    res.json({
        status: 'success',
        message: 'test accounts and groups have been created'
    })
    return
})

export default router;