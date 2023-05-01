import express from 'express';
var router = express.Router();

/*
    body:
    {
        SUPER_SECRET_PASSWORD
    }
*/
router.delete('/', async (req, res) => {
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