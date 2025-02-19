import express from 'express';
var router = express.Router();

router.get('/questions', async (req, res) => {
    try {
        let questions = await req.db.Questions.find()

        if (questions.length == 0) {
            res.json({
                status: 'error',
                message: 'no questions found'
            })
            return
        }

        res.json({
            status: 'success',
            questions: questions[0]
        })
        return
    } catch (e) {
        res.json({
            status: 'error',
            error: 'error'
        });
    }
})

router.get('/:orgid/:userid', async (req, res) => {
    // console.log('sessionIsAuthenticated: ' + req.session.id)
    if(req.session.isAuthenticated) {
        try {
            const orgid = req.params.orgid;
            const userid = req.params.userid;
            const userprofile = await req.db.UserProfile.findOne({userid: userid, orgid: orgid});
            
            if (userprofile != null) {
                res.json({
                    status: 'success',
                    _id: userprofile._id,
                    orgid: userprofile.orgid,
                    userid: userprofile.userid,
                    questions: userprofile.questions,
                    answers: userprofile.answers
                });
            } else {
                res.json({
                    status: 'error',
                    error: 'profile not created'
                });
            }
            
        } catch (error) {
            res.json({
                status: 'error',
                error: 'error'
            });
        }
    } else {
        res.json({
            status: 'error',
            error: 'not authenticated'
        });
    }
});

router.post('/create', async (req, res) => {
    // console.log('sessionIsAuthenticated: ' + req.session.id)
    if(req.session.isAuthenticated) {
        try {
            console.log('here');
            await req.db.UserProfile.create({
                orgid: req.body.orgid,
                userid: req.body.userid,
                questions: req.body.questions,
                answers: req.body.answers
            });
            res.json({
                status: 'success',
                orgid: req.body.orgid,
                userid: req.body.userid
            });
        } catch (error) {
            res.json({
                status: 'error',
                error: 'error'
            });
        }
    } else {
        res.json({
            status: 'error',
            error: 'not authenticated'
        });
    }
});

router.put('/:orgid/:userid', async (req, res) => {
    // console.log('sessionIsAuthenticated: ' + req.session.id)
    if(req.session.isAuthenticated) {
        try {
            console.log('here');
            const orgid = req.params.orgid;
            const userid = req.params.userid;
            const userprofile = await req.db.UserProfile.findOneAndUpdate(
                {userid: userid, orgid: orgid}, {answers: req.body.answers}
            );
            userprofile.save();
            res.json({
                status: 'success',
                _id: userprofile._id,
                orgid: userprofile.orgid,
                userid: userprofile.userid,
                questions: userprofile.questions,
                answers: userprofile.answers
            });
        } catch (error) {
            res.json({
                status: 'error',
                error: 'error'
            });
        }
    } else {
        res.json({
            status: 'error',
            error: 'not authenticated'
        });
    }
});

router.delete('/:orgid/:userid', async (req, res) => {
    // console.log('sessionIsAuthenticated: ' + req.session.id)
    if(req.session.isAuthenticated) {
        try {
            console.log('here');
            const orgid = req.params.orgid;
            const userid = req.params.userid;
            await req.db.UserProfile.delete(
                {userid: userid, orgid: orgid}
            );
            res.json({
                status: 'success'
            });
        } catch (error) {
            res.json({
                status: 'error',
                error: 'error'
            });
        }
    } else {
        res.json({
            status: 'error',
            error: 'not authenticated'
        });
    }
});


export default router;

