// import files/dependencies
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const router = require('express').Router();

//render homepage
router.get('/', (req, res) => {
    Post.findAll({
        // query confirmation from Post table to include these attributes
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [
        {
            // include posts creator and username
            model: User,
            attributes: ['username']
        },
        {
            // include all comments
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
        }
    ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// render login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// render signup page
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

// return single post page
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            // specify id parameter in the query
            id: req.params.id
        },
        // query confirmation to include these attributes
        attributes: [
            'id',
            'content',
            'title',
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
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found'});
            return;
        }
        const post = dbPostData.get({ plain: true });
        console.log(post);
        res.render('single-post', { post, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;