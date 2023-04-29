import express from 'express';
var router = express.Router();

router.post('/create', async (req, res) => {
    if (!req.session.isAuthenticated) {
        res.json({
            status: 'error',
            message: 'not authenticated'
        })
    }
    try {
        const characters ='abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < 7; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        let self = await req.db.User.findById(req.session.userid)

        await req.db.OrgAccessCode.create({
            accessCode: result,
            creator: self._id,
            members: [self],
            orgid : ''
        });

        res.json({
            status: 'success',
            accessCode: result
        })
        
    } catch (e) {
        console.log(e)
        res.json({
            status: 'error',
            error: 'something went wrong'
        });
    }
})

/*
    no body
*/
router.delete('/delete', async (req, res) => {
    
    if (!req.session.isAuthenticated) {
        res.json({
            status: 'error',
            message: 'not authenticated'
        })
    }
    try {
        let orgAccessCode = await req.db.OrgAccessCode.findOne({
            creator : req.session.userid
        })
        if (orgAccessCode != null) {
            await req.db.OrgAccessCode.deleteOne({
                creator : req.session.userid
            })
        }
        res.json({
            status: 'success'
        })
    } catch (e) {
        res.json({
            status: 'error',
            error: 'something went wrong'
        });
    }
})

/* POST: /join
    Adds logged user to specified organization.
    Payload Body:
    {
        accessCode: 'organizations access code'
    }
    User authentication required
*/
router.post('/join', async (req, res) => {
    if (!req.session.isAuthenticated) {
        res.json({
            status: 'error',
            message: 'not authenticated'
        })
        return
    } else {
        try {
            // find accesscode id using access code
            let orgAccessCode = await req.db.OrgAccessCode.findOne({
                accessCode : req.body.accessCode
            })
            if (orgAccessCode == null) {
                res.json({
                    status: 'error',
                    error: 'code does not exist'
                });
                return
            }

            // check if the staging group is full
            if (orgAccessCode.members >= 5) {
                res.json({
                    status: 'error',
                    error: 'staging is full'
                });
                return;
            }

            // push self to staging member array
            let self = await req.db.User.findById(req.session.userid)
            await req.db.OrgAccessCode.findByIdAndUpdate(
                orgAccessCode._id,
                { 
                    $push:
                    { 
                        members : self
                    }
                })

            res.json({
                status: 'success'
            });
            return
        } catch (error) {
            res.json({
                status: 'error',
                error: '404'
            });
            return
        }
    }
});

/*  GET: /:accesscode
    returns members in the staging room
*/
router.get('/:accesscode', async (req, res) => {
    if (!req.session.isAuthenticated) {
        res.json({
            status: 'error',
            message: 'not authenticated'
        })
        return
    }
    try {
        // find accesscode id using access code
        let orgAccessCode = await req.db.OrgAccessCode.findOne({
            accessCode : req.params.accesscode
        })
        .populate('members', '_id firstName lastName profilePic')

        if (orgAccessCode == null) {
            res.json({
                status: 'error',
                error: 'code does not exist'
            });
            return
        }
        
        res.json({
            status: 'success',
            members: orgAccessCode.members,
            orgid: orgAccessCode.orgid
        })
        return
    } catch(e) {
        res.json({
            status: 'error',
            error: 'something went wrong'
        });
        return
    }
})

export default router;