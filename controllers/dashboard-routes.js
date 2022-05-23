// import files/dependencies
const { Post, User, Comment } = require('../models');
const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');

// route to render dashboard page for logged in user
router.get('/', withAuth, (req, res) => {
    // all of user posts are obtained from the database
    Post.findAll({
        where: {
            // use the id from the session
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [
        {
            model: Comment,
            attributes: [
                'id', 
                'comment_text', 
                'post_id', 
                'user_id', 
                'created_at'
            ],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username']
        }
    ]
    })
    .then(dbPostData => {
        // serialize data
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// route to edit post
router.get('/edit/:id', withAuth, (req, res) => {
    // all of users posts are obtained from db
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [
        {
            model: User,
            attributes: ['username']
        },
        {
            model: Comment,
            attributes: [
                'id',
                'comment_text',
                'post_id',
                'created_at'
            ],
            include: {
                model: User,
                attributes: ['usernamae']
            }
        }
    ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found' });
            return;
        }
        // serialize data 
        const post = dbPostData.get({ plain: true });
        res.render('edit-post', { post, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/edituser', withAuth, (req, res) => {
    // access user model and run findOne() method to get a single user based on parameters
    User.findOne({
        //when data is sent back, exclude password property
        attributes: { exclude: ['password'] },
        where: {
            //user id as parameter for the request
            id: req.session.user_id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
          // if no user is found, return an error
          res.status(404).json({ message: 'No user found' });
          return;
        }
        // otherwise, return the data for the requested user
        const user = dbUserData.get({ plain: true });
        res.render('edit-user', {user, loggedIn: true});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      })
});

module.exports = router;