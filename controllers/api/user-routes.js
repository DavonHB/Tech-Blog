// import files/dependencies 
const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// get all users
router.get('/', (req, res) => {
    // access user model and run .findAll() method to get all users
    User.findAll({
        // when the data is sent back exclude the password property
        attributes: { exclude: ['[password]'] }
    })
    // return data as JSON format
    .then(dbUserData => res.json(dbUserData))
    // if there is a server error 
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// get sing user by id
router.get('/:id', (req, res) => {
    // access User model and run findOne() method to get single user user based on parameters
    User.findOne({
        // when data is sent back, exclude the password property 
        attributes: { exclude: ['password'] },
        where: {
            // use id as the parameter for the request
            id: req.params.id
        },
        include: [
        {
            // include posts user has created
            model: Post,
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ]
        },
        {
            // include comments user has commented on
            model: Comment,
            attributes: [
                'id',
                'comment_text',
                'created_at'
            ],
            // include posts user has upvoted
            include: {
                model: Post,
                attributes: ['title']
            }   
        }
    ]
    })
    .then(dbUserData => {
        // check if user exists
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// add a new user
router.post('/', withAuth, (req, res) => {
    // expects an object with passed values
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    // send user data back to the client as confirmation and save the session
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData)
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// login for user
router.post('/login', (req, res) => {
    // findOne() method by username to look for an existing user with the email address
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(dbUserData => {
        // if no username found, return an error
        if (!dbUserData) {
            res.status(400).json({ message: 'No user found with that username.' });
            return;
        }
        // otherwise verify user
        // call instance method in User model
        const valid = dbUserData.checkPassword(req.body.password);

        // if password is invalid, return error
        if(!valid) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }
        // otherwise save the session and return user object and a success message
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in' });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

// logout existing user
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// update an existing user
router.put('/:id', withAuth, (req, res) => {
    // update method that expects username, email, and password
    User.update(req.body, {
        // since a hook exists for the password hash, noted
        individualHooks: true,
        // use id as parameter for individual user to be updated
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// delete an existing user
router.delete('/:id', withAuth, (req, res) => {
    // destroy method
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;