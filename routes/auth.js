const express = require('express');
const router = express.Router();
const connection = require('../db/connection');
const forAdmin = require('../middleware/admin');
const { body, validationResult, cookie } = require('express-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//login function
router.post('/login',
    body('email').isEmail().withMessage("please enter a valid email"),
    body('password').isLength({ min: 8, max: 15 }).withMessage("please enter a valid password")
    , (req, res) => {
        try{
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        //chick for email
        connection.query('select * from users where email = ? ',
            req.body.email, (err, results, fields) => {
                if (err)
                    console.log(err);
                if (results.length > 0)//results is an array of objects that match query
                {

                    if (results[0].approve == null || results[0].approve == false) {
                        res.status(403).json({ message: 'not apporved yet' });
                    }

                    //compare to password
                    const chickOnPassword = bcrypt.compareSync(req.body.password, results[0].password);
                    if (chickOnPassword) {
                        delete results[0].password;
                        if(results[0].role==1)
                        res.status(200).json({ message: "welcome admin", data: results[0] });
                        else
                        res.status(200).json({ message: "welcome user", data: results[0] });
                    }
                    else {
                        res.json({ message: "incorrect password" });
                    }

                }
                else {
                    res.json({message:'the email is not found!'});
                }

            });
        }
        catch(err){
            console.log(err);
        }
    });

//register function for normal user

router.post('/register',
    body('email').isEmail().withMessage("please enter a valide email"),
    body('name').isString().withMessage("please enter a valide name"),
    body('password').isLength({ min: 8, max: 15 })
        .withMessage("the password should be within a (10-15)character")
    , (req, res) => {
        //1-chich with express validatore
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            //2-chick if email exists means if its already token per someone else
            connection.query('select * from users where email = ?',
                req.body.email, (err, results, fields) => {
                    if (err) {
                        console.log(err);
                    }
                    if (results.length > 0) {
                        return res.json({ message: "the eamil is already token" });
                    }
                    else {
                        //3-prepare user object before inser it
                        const user = {
                            email: req.body.email,
                            name: req.body.name,
                            password: bcrypt.hashSync(req.body.password, 10),
                            token: crypto.randomBytes(16).toString("hex")
                        }
                        //4-insert email in DB
                        connection.query('insert into users set ?'
                            , user, (err, results, fields) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).json({ err: err });
                                }
                                else {
                                    res.status(200)
                                        .json({
                                            message: "registration is done successfully",
                                            user
                                        });
                                }
                            })

                    }
                })
        }
        catch (err) {
            console.log(err);
        }
    });

//register function as admin

router.post('/register/admin',
body('email').isEmail().withMessage("please enter a valide email"),
body('name').isString().withMessage("please enter a valide name"),
body('password').isLength({ min: 8, max: 15 })
    .withMessage("the password should be within a (10-15)character")
, (req, res) => {
    //1-chich with express validatore
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        //2-chick if email exists means if its already token per someone else
        connection.query('select * from users where email = ?',
            req.body.email, (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                if (results.length > 0) {
                    return res.json({ message: "the eamil is already token" });
                }
                else {
                    //3-prepare user object before inser it
                    const admin = {
                        email: req.body.email,
                        name: req.body.name,
                        password: bcrypt.hashSync(req.body.password, 10),
                        token: crypto.randomBytes(16).toString("hex"),
                        role:1,
                        approve:1
                    }
                    //4-insert email in DB
                    connection.query('insert into users set ?'
                        , admin, (err, results, fields) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ err: err });
                            }
                            else {
                                res.status(200)
                                    .json({
                                        message: "registration is done successfully",
                                        admin
                                    });
                            }
                        })
                }
            })
    }
    catch (err) {
        console.log(err);
    }
});

router.route('/userRequest').get(forAdmin,(req, res) => {
    connection.query('SELECT * FROM users WHERE approve IS NULL', 
    (err, results, fields) => {
        if (err)
            console.log(err);

        res.json({ results });
    });
}).patch(forAdmin,(req, res) => {
    connection.query('update users set approve = ? where id = ?', 
    [req.body.approve, req.body.id], (err, results, fields) => {
        if (err)
            console.log(err);
            else{
                if(req.body.approve==false){
                    connection.query('DELETE FROM users WHERE id = ?',
                    req.body.id,(err,results,fields)=>{
                        if(err)
                        console.log(err);
                        else{
                            res.status(200).json({message:"Rejection done"})
                        }
                    })
                }
                else
                    res.json({ message:"the Approval done" ,results});
    }
    })
});
module.exports = router;