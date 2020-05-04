const express = require('express');
const router = express.Router()
const gravatar = require('gravatar')
const bcyrpt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');
const User = require('../../models/User')

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', 
    [check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Please eneter password with 4 or more characters')
        .isLength({ min: 4, max: 8 })
    ],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    const { name, email, password } = req.body
    

    try {
        // see is user exists
        let user = await User.findOne({email})

        if(user) {
            return res.status(400).json({errors: [{msg: 'user already exists'}]})
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcyrpt.genSalt(10);
        user.password = await bcyrpt.hash(password, salt);


        await user.save()

        const payload = {
            user: {
                id: user.id
            }
        }

        res.send('user registered successfuly')
        // get user gravatar

        // encrypt password 

        //return json webtoken

        console.log(req.body);

    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('server error')    
    }
    
    
})

module.exports = router