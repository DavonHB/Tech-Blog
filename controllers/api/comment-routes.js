// import dependencies 
const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get comments
router.get('/', (req,res) => {
    // access comment model and run .findAll() method to find all comments
    Comment.findAll({})
    // return data as JSON format
    .then(dbCommentData => res.json(dbCommentData))
    // catch server error
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// post new comments
router.post('/', withAuth, (req, res) => {
    // check if sessions exists
    if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            // use user id from session
            user_id: req.session.user_id,
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch( err => {
            console.log(err);
            res.status(400).json(err);
        })
    }
});

// delete a comment
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'No comment found'});
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;