const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req,res) => {

    const {error} = await registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send("Email Alrady Exists");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        });
    
        try{
            const savedUser = await user.save();
            res.json({user: user._id});
        }catch(err){
            res.status(400).send(err);
            console.log({message: err});
        }
});

router.post("/login", async (req, res) => {

    const {error} = await loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Invalid Email");

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const comPassword = await bcrypt.compare(user.password, hashPassword);
    if(!comPassword) return res.status(400).send("Invalid Password");

    const token = jwt.sign({_id: user._id}, process.env.JWT_TOKEN_SEC);
    res.header('auth-token', token).send(token);

    res.send("Login");
});


module.exports = router;