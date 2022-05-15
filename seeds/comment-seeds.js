const { Comment } = require('../models');

const commentData = [{
        comment_text: "Wow, this is useful.",
        user_id: 1,
        post_id: 1
    },
    {
        comment_text: "Hey this is great!",
        user_id: 2,
        post_id: 2
    },
    {
        comment_text: "Thank you so much for this!",
        user_id: 3,
        post_id: 3
    }
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;