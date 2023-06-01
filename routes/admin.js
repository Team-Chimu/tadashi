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

export default router;