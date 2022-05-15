const { User } = require('../models');

const userData = [{
        username: 'Kyle',
        password: 'kyleizcool'

    },
    {
        username: 'Kayla',
        password: 'kaylaizcool'
    },
    {
        username: 'Kelly',
        password: 'kellyizcool'
    }
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;