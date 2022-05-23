// import files/dependencies
const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// get all posts
router.get('/', (req, res) => {

    Post.findAll({
        // from the post table, include these attributes
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        // order posts from most recent to least
        order: [
            ['created_at']
        ],
        include: [
            // from User table, include post creator's username
            {
            model: User,
            attributes: ['username']
        },
        {
            //from Comment table, include all comments
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
    // return posts in JSON format
    .then(dbPostData => res.json(dbPostData.reverse()))
    // catch server error
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// get a single post by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            // specify post id parameter
            id: req.params.id
        },
        // from the post table, include these attributes
        attributes: [
            'id',
            'content',
            'title',
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
        // if no posts are returned by that id, return an error
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found'});
            return;
        }
        res.json(dbPostData);
    })
    // catch error
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// post new post
router.post('/', withAuth, (req, res) => {
    // expects objects 
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch( err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// update post
router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        content: req.body.content
    }, {
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// delete post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;