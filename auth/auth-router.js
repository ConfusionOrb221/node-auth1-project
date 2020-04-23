const bcrypt = require('bcryptjs');

const router = require("express").Router();

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 8);

    user.password = hash;

    Users.add(user)
    .then(saved =>{
        res.status(201).json({username: saved.username});
    })
    .catch(err =>{
        res.status(500).json({message: 'problem with the db', error: err})
    })
});

router.post('/login', (req, res) =>{
    const {username, password} = req.body;

    Users.findBy({ username })
    .then(([user]) =>{
        if(user && bcrypt.compareSync(password, user.password)){
            req.session.user = username;
            res.status(200).json({message: 'Welcome!'});
        } else {
            res.status(401).json({message: 'You shall not pass!'});
        }
    })
    .catch(err =>{
        res.status(500).json({message: 'problem with the db', error: err})
    })
})

router.get('/logout', (req, res) =>{
    req.session.destroy(err =>{
        err ? res.send('unable to logout') : res.send('logged out')
    });
})


module.exports = router;